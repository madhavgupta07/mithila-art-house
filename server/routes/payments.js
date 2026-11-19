import express from 'express';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';

import Order from '../models/Order.js';
import config, { isRazorpayConfigured } from '../config.js';

const router = express.Router();

const razorpay = isRazorpayConfigured()
  ? new Razorpay({ key_id: config.razorpayKeyId, key_secret: config.razorpayKeySecret })
  : null;

function hmacHex(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

// Compare digests in constant time; timingSafeEqual throws on unequal lengths.
function signaturesMatch(actual, expected) {
  const left = Buffer.from(String(actual ?? ''));
  const right = Buffer.from(String(expected ?? ''));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

const toPaise = (amount) => Math.round((Number(amount) || 0) * 100);

router.post('/create', async (req, res, next) => {
  try {
    const order = await Order.findOne({ id: req.body?.orderId });
    if (!order) {
      return res.status(404).json({ ok: false, message: 'Order not found.' });
    }
    if (order.status !== 'awaiting_payment') {
      return res.status(400).json({ ok: false, message: 'Order is not awaiting payment.' });
    }
    if (!razorpay || !isRazorpayConfigured()) {
      return res.status(503).json({
        ok: false,
        message:
          'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the server.',
      });
    }

    const amount = toPaise(order.totals.total);
    if (amount <= 0) {
      return res.status(400).json({ ok: false, message: 'Order amount is invalid.' });
    }

    // Razorpay expects paise; the order receipt ties the payment back to us.
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: order.id,
      notes: { orderId: order.id },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.json({
      ok: true,
      keyId: config.razorpayKeyId,
      orderId: razorpayOrder.id,
      amount,
      currency: 'INR',
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/verify', async (req, res, next) => {
  try {
    const {
      orderId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = req.body || {};

    const order = await Order.findOne({ id: orderId });
    if (!order) {
      return res.status(404).json({ ok: false, message: 'Order not found.' });
    }
    if (order.status === 'paid') {
      return res.json({ ok: true, order });
    }
    if (!config.razorpayKeySecret) {
      return res.status(503).json({
        ok: false,
        message: 'RAZORPAY_KEY_SECRET is not configured on the server.',
      });
    }
    if (order.razorpayOrderId && order.razorpayOrderId !== razorpayOrderId) {
      return res.status(400).json({ ok: false, message: 'Payment verification failed.' });
    }

    const expected = hmacHex(`${razorpayOrderId}|${razorpayPaymentId}`, config.razorpayKeySecret);
    if (!signaturesMatch(razorpaySignature, expected)) {
      return res.status(400).json({ ok: false, message: 'Payment verification failed.' });
    }

    // Client success is never enough: cross-check the captured payment with
    // Razorpay when possible. A network/API failure still falls back to the
    // verified signature, but logs a warning for operators.
    if (razorpay && razorpayPaymentId) {
      try {
        const payment = await razorpay.payments.fetch(razorpayPaymentId);
        const expectedAmount = toPaise(order.totals.total);
        if (
          payment.status !== 'captured' ||
          (payment.amount !== undefined && Number(payment.amount) !== expectedAmount)
        ) {
          return res.status(400).json({ ok: false, message: 'Payment verification failed.' });
        }
      } catch (error) {
        console.warn(
          '[payments] Could not fetch payment for cross-check; trusting valid signature.',
          error.message,
        );
      }
    }

    order.status = 'paid';
    order.razorpayOrderId = razorpayOrderId || order.razorpayOrderId;
    order.razorpayPaymentId = razorpayPaymentId || order.razorpayPaymentId;
    order.razorpaySignature = razorpaySignature || order.razorpaySignature;
    order.paidAt = new Date();
    await order.save();

    return res.json({ ok: true, order });
  } catch (error) {
    return next(error);
  }
});

// Raw-body parser and signature verification happen here (see app.js).
router.post('/webhook', async (req, res, next) => {
  try {
    if (!config.razorpayWebhookSecret) {
      return res.status(503).json({
        ok: false,
        message: 'RAZORPAY_WEBHOOK_SECRET is not configured on the server.',
      });
    }

    const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body ?? {}));
    const expected = hmacHex(raw, config.razorpayWebhookSecret);
    if (!signaturesMatch(req.get('x-razorpay-signature'), expected)) {
      return res.status(400).json({ ok: false, message: 'Invalid webhook signature.' });
    }

    let payload;
    try {
      payload = JSON.parse(raw.toString('utf8'));
    } catch {
      return res.status(400).json({ ok: false, message: 'Invalid webhook payload.' });
    }

    if (payload.event === 'payment.captured' || payload.event === 'payment.failed') {
      const payment = payload?.payload?.payment?.entity || {};
      const orderId =
        payment.notes?.orderId || payment.receipt || payload?.payload?.order?.entity?.receipt;

      if (orderId) {
        const order = await Order.findOne({ id: orderId });
        if (order) {
          if (payload.event === 'payment.captured') {
            order.status = 'paid';
            order.paidAt = order.paidAt || new Date();
          } else {
            order.status = 'payment_failed';
          }
          order.razorpayPaymentId = payment.id || order.razorpayPaymentId;
          order.razorpayOrderId = payment.order_id || order.razorpayOrderId;
          await order.save();
        }
      }
    }

    // Acknowledge quickly; unrelated events are intentionally ignored.
    return res.status(200).json({ ok: true, received: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
