import express from 'express';
import crypto from 'node:crypto';

import Product from '../models/Product.js';
import Order from '../models/Order.js';
import config, { isRazorpayConfigured } from '../config.js';
import requireAdmin from '../middleware/admin.js';

const router = express.Router();

const money = (value) => Math.round((Number(value) || 0) * 100) / 100;
const badRequest = (res, message) => res.status(400).json({ ok: false, message });
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Prices always come from MongoDB. Submitted unitPrice is trusted only for
// no-payment sample items whose slug is not in the catalogue.
router.post('/', async (req, res, next) => {
  try {
    const { items, customer = {}, paymentMethod = '', paymentMode, couponCode, sampleOnly } =
      req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return badRequest(res, 'At least one item is required.');
    }
    if (!customer.email || !emailPattern.test(String(customer.email))) {
      return badRequest(res, 'A valid customer email is required.');
    }

    const trustSamplePrices = sampleOnly === true;
    const computedItems = [];

    for (const item of items) {
      if (!item || typeof item !== 'object') {
        return badRequest(res, 'Invalid item in order.');
      }

      const slug = item.slug ? String(item.slug) : '';
      const product = slug ? await Product.findOne({ slug }) : null;
      let unitPrice;

      if (product) {
        const dimension = (product.dimensions || []).find((option) => option.label === item.size);
        const framing = (product.framing || []).find((option) => option.label === item.frame);
        unitPrice = money(product.price + (dimension?.modifier || 0) + (framing?.modifier || 0));
      } else if (trustSamplePrices) {
        const submitted = Number(item.unitPrice);
        if (!Number.isFinite(submitted) || submitted < 0) {
          return badRequest(res, 'A valid unitPrice is required for no-payment items.');
        }
        unitPrice = money(submitted);
      } else {
        return badRequest(res, `Unknown product: ${slug || '(missing slug)'}.`);
      }

      const quantity = Math.max(1, Math.trunc(Number(item.quantity) || 1));
      computedItems.push({
        slug: slug || product?.slug || '',
        productId: product?.id || item.productId || '',
        name: item.name || product?.name || '',
        image: item.image || product?.images?.[0]?.src || '',
        size: item.size || '',
        frame: item.frame || '',
        unitPrice,
        quantity,
      });
    }

    const subtotal = money(
      computedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    );

    let discount = 0;
    if (couponCode) {
      const code = String(couponCode).trim().toLowerCase();
      const coupon = config.coupons.find((entry) => entry.code.toLowerCase() === code);
      if (coupon && subtotal >= money(coupon.minSubtotal || 0)) {
        const raw = coupon.type === 'percent'
          ? (subtotal * Number(coupon.value)) / 100
          : Number(coupon.value);
        discount = Math.min(money(raw), subtotal);
      }
    }

    const payableSubtotal = money(subtotal - discount);
    const shipping = payableSubtotal >= config.freeShippingAbove ? 0 : money(config.shippingFee);
    const total = money(payableSubtotal + shipping);

    const mode = paymentMode === 'razorpay' ? 'razorpay' : 'sample';
    let status = 'sample';
    if (mode === 'razorpay') {
      if (isRazorpayConfigured()) {
        status = 'awaiting_payment';
      } else {
        console.warn('[orders] Razorpay requested but not configured; order saved in no-payment mode.');
      }
    }

    const order = new Order({
      id: `MAH-${Date.now().toString(36).toUpperCase()}${crypto
        .randomBytes(3)
        .toString('hex')
        .toUpperCase()}`,
      items: computedItems,
      customer,
      paymentMethod: String(paymentMethod),
      paymentMode: mode,
      couponCode: couponCode ? String(couponCode).trim() : null,
      totals: { subtotal, discount, shipping, total },
      status,
    });
    await order.save();

    return res.status(201).json({ ok: true, order });
  } catch (error) {
    return next(error);
  }
});

router.get('/', requireAdmin, async (_req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json({ ok: true, orders });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) {
      return res.status(404).json({ ok: false, message: 'Order not found.' });
    }
    return res.json({ ok: true, order });
  } catch (error) {
    return next(error);
  }
});

export default router;
