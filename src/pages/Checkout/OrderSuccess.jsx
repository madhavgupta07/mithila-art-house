import { useLocation } from 'react-router-dom';
import { FaCircleCheck, FaCircleInfo, FaClockRotateLeft } from 'react-icons/fa6';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import Button from '../../components/Common/Button';
import EmptyState from '../../components/Common/EmptyState';
import { formatPrice } from '../../lib/utils';

function readStoredOrder() {
  try {
    const raw = sessionStorage.getItem('mithila-sample-order');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const statusCopy = {
  paid: {
    eyebrow: 'Payment verified',
    icon: FaCircleCheck,
    body: (order) =>
      `Razorpay confirmed your test payment and the server recorded order ${order.id}. No live funds were moved.`,
  },
  awaiting_payment: {
    eyebrow: 'Awaiting payment',
    icon: FaClockRotateLeft,
    body: (order) =>
      `Order ${order.id} was saved, but the payment was not completed. Return to checkout to try again.`,
  },
  sample: {
    eyebrow: 'Sample order created',
    icon: FaCircleCheck,
    body: (order) =>
      `Your sample order reference is ${order.id}. ${
        order.persisted
          ? 'It was saved to the MongoDB'
          : 'It exists in this browser only'
      } — no payment was taken, no email was sent, and it is not a real purchase.`,
  },
};

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state || readStoredOrder();
  const copy = statusCopy[order?.status] || statusCopy.sample;
  const StatusIcon = copy.icon;

  return (
    <>
      <Seo
        title="Order Confirmation"
        description="Confirmation for a Mithila Art House sample order. Payments are only marked paid after server-side verification."
        canonical="/order-success"
      />
      <Container className="py-16 lg:py-24">
        {!order ? (
          <EmptyState
            title="No order to show."
            description="Create an order from the cart first. This page displays the most recent order from this browser session."
            actionLabel="Browse artwork"
            actionTo="/shop"
          />
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="border border-forest/25 bg-forest/5 p-8 text-center sm:p-12">
              <StatusIcon aria-hidden="true" className="mx-auto text-4xl text-forest" />
              <p className="mt-5 font-sans text-[10px] uppercase tracking-luxe text-forest">{copy.eyebrow}</p>
              <h1 className="mt-4 font-display text-5xl leading-tight text-ink sm:text-6xl">
                Thank you, {order.name || order.customer?.firstName || 'friend'}.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[14px] leading-7 text-charcoal/75">{copy.body(order)}</p>
              {order.persisted && (
                <p className="mt-3 text-[11px] uppercase tracking-wide2 text-charcoal/45">Saved in the MongoDB</p>
              )}
            </div>

            <div className="mt-6 border border-vermilion/25 bg-vermilion/5 p-5">
              <p className="flex items-start gap-3 text-[12px] leading-6 text-charcoal/75">
                <FaCircleInfo aria-hidden="true" className="mt-0.5 shrink-0 text-vermilion" />
                <span>
                  A storefront must verify payment on the server, reduce stock and send a confirmation before calling
                  anything a confirmed purchase. This storefront verifies Razorpay signatures when keys are configured, but
                  it does not send email, reduce inventory or use live payment keys.
                </span>
              </p>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-3xl text-ink">Order details</h2>
              <div className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
                {[
                  ['Order reference', order.id],
                  ['Created', new Date(order.placedAt || order.createdAt || Date.now()).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })],
                  ['Status', order.status || 'sample'],
                  ['Contact', order.email || order.customer?.email],
                  ['Payment preference', order.paymentMethod],
                  ['Payment ID', order.paymentId || order.razorpayPaymentId],
                  ['Coupon', order.couponCode || 'None'],
                ]
                  .filter(([, value]) => value !== undefined && value !== null)
                  .map(([label, value]) => (
                    <div key={label} className="flex flex-col justify-between gap-1 py-4 sm:flex-row sm:items-center">
                      <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/55">{label}</span>
                      <span className="break-all text-[13px] text-ink">{value || '—'}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-3xl text-ink">Artworks in this order</h2>
              <div className="mt-5 space-y-4">
                {order.items?.map((item) => (
                  <div key={item.key || item.slug} className="flex items-center gap-4 border-b border-ink/10 pb-4">
                    <img src={item.image} alt="" className="h-20 w-16 border border-ink/10 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-xl text-ink">{item.name}</p>
                      <p className="text-[11px] text-charcoal/55">{item.size} · {item.frame} · ×{item.quantity}</p>
                    </div>
                    <p className="font-display text-lg text-ink">{formatPrice(item.unitPrice * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {order.totals && (
              <div className="mt-8 max-w-sm self-end bg-paper/50 p-6">
                <div className="space-y-2 text-[12px] text-charcoal/65">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.totals.subtotal)}</span></div>
                  {order.totals.discount > 0 && (
                    <div className="flex justify-between text-forest"><span>Discount</span><span>− {formatPrice(order.totals.discount)}</span></div>
                  )}
                  <div className="flex justify-between"><span>Shipping estimate</span><span>{formatPrice(order.totals.shipping)}</span></div>
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-ink/12 pt-4">
                  <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">Total</span>
                  <span className="font-display text-2xl text-ink">{formatPrice(order.totals.total)}</span>
                </div>
              </div>
            )}

            <div className="mt-12 flex flex-wrap gap-4">
              <Button to="/shop">Continue exploring</Button>
              <Button to="/faq" variant="outline">Read the FAQ</Button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
