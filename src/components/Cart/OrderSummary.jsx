import { useState } from 'react';
import toast from 'react-hot-toast';
import { siteConfig } from '../../config/site';
import { selectCartCount, useCartStore, useCartTotals } from '../../context/store';
import { formatPrice } from '../../lib/utils';

export default function OrderSummary({ children, className = '' }) {
  const [code, setCode] = useState('');
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const clearCoupon = useCartStore((state) => state.clearCoupon);
  const count = useCartStore(selectCartCount);
  const totals = useCartTotals();

  const submitCoupon = (event) => {
    event.preventDefault();
    const result = applyCoupon(code);
    if (result.ok) {
      toast.success(result.message);
      setCode('');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <aside className={`border border-ink/12 bg-paper/40 p-6 sm:p-8 ${className}`} aria-label="Order summary">
      <div className="flex items-baseline justify-between border-b border-ink/12 pb-5">
        <h2 className="font-display text-3xl text-ink">Order summary</h2>
        <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/50">
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="mt-6 space-y-3 font-sans text-[12px]">
        <div className="flex justify-between text-charcoal/70">
          <span>Subtotal</span>
          <span className="text-ink">{formatPrice(totals.subtotal)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-forest">
            <span>Coupon ({couponCode})</span>
            <span>− {formatPrice(totals.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-charcoal/70">
          <span>Shipping estimate</span>
          <span className="text-ink">
            {totals.shipping === 0 ? 'Free / not applicable' : formatPrice(totals.shipping)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-baseline justify-between border-t border-ink/12 pt-5">
        <span className="font-sans text-[11px] uppercase tracking-wide2 text-charcoal/70">Estimated total</span>
        <span className="font-display text-3xl text-ink">{formatPrice(totals.total)}</span>
      </div>
      <p className="mt-2 text-[11px] leading-5 text-charcoal/50">{siteConfig.shipping.note}</p>

      {items.length > 0 && (
        <div className="mt-7 border-t border-ink/12 pt-6">
          <p className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">Coupon code</p>
          {couponCode ? (
            <div className="mt-3 flex items-center justify-between border border-forest/40 bg-forest/5 px-4 py-3">
              <span className="font-sans text-[12px] text-forest">{couponCode} applied</span>
              <button
                type="button"
                onClick={() => {
                  clearCoupon();
                  toast('Coupon removed.');
                }}
                className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60 hover:text-vermilion"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={submitCoupon} className="mt-3 flex gap-2">
              <label htmlFor="coupon-code" className="sr-only">Coupon code</label>
              <input
                id="coupon-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder={siteConfig.coupons[0]?.code || 'Enter code'}
                className="min-w-0 flex-1 border border-ink/20 bg-ivory px-3 py-2.5 font-sans text-[12px] uppercase outline-none focus:border-vermilion"
              />
              <button
                type="submit"
                className="border border-indigoDeep bg-indigoDeep px-4 py-2.5 font-sans text-[10px] uppercase tracking-wide2 text-ivory transition-colors hover:bg-vermilion hover:border-vermilion"
              >
                Apply
              </button>
            </form>
          )}
          {siteConfig.coupons.length > 0 && !couponCode && (
            <p className="mt-2 text-[11px] text-charcoal/45">
              Sample preview code: {siteConfig.coupons.map((coupon) => coupon.code).join(', ')}
            </p>
          )}
        </div>
      )}

      {children && <div className="mt-7">{children}</div>}

      <p className="mt-6 border-t border-ink/12 pt-5 text-[11px] leading-5 text-charcoal/50">
        These totals are estimates. The API recalculates prices, discounts and shipping from MongoDB when it is connected.
      </p>
    </aside>
  );
}
