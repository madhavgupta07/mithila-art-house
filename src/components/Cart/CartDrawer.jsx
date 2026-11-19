import { Link } from 'react-router-dom';
import { FaXmark } from 'react-icons/fa6';
import { selectCartCount, selectSubtotal, useCartStore, useCartTotals, useUiStore } from '../../context/store';
import { formatPrice } from '../../lib/utils';
import { siteConfig } from '../../config/site';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import Container from '../Common/Container';
import CartItem from './CartItem';

export default function CartDrawer() {
  const cartOpen = useUiStore((state) => state.cartOpen);
  const closeCart = useUiStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const count = useCartStore(selectCartCount);
  const totals = useCartTotals();
  const subtotal = useCartStore(selectSubtotal);

  useLockBodyScroll(cartOpen);
  useEscapeKey(cartOpen, closeCart);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-soft"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <h2 className="font-display text-3xl text-ink">Your cart</h2>
            <p className="mt-1 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/50">
              {count} {count === 1 ? 'artwork' : 'artworks'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center border border-ink/10 hover:bg-ink hover:text-ivory"
            aria-label="Close cart"
          >
            <FaXmark />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-3xl text-ink">Nothing here yet.</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-charcoal/65">
                Browse the collection and save the artworks that speak to you.
              </p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="mt-6 border-b border-vermilion pb-1 font-sans text-[11px] uppercase tracking-wide2 text-vermilion"
              >
                Explore artwork
              </Link>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.key} item={item} compact />)
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 bg-paper/50 px-6 py-5">
            <div className="flex items-center justify-between font-sans text-[12px]">
              <span className="uppercase tracking-wide2 text-charcoal/60">Subtotal</span>
              <span className="text-lg text-ink">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-[11px] text-charcoal/50">
              Shipping {totals.shipping === 0 ? 'estimated as free' : `est. ${formatPrice(totals.shipping)}`} · {siteConfig.shipping.note}
            </p>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="mt-5 block bg-indigoDeep px-6 py-4 text-center font-sans text-[11px] uppercase tracking-wide2 text-ivory transition-colors hover:bg-vermilion"
            >
              Proceed to checkout
            </Link>
            <Link
              to="/cart"
              onClick={closeCart}
              className="mt-3 block text-center font-sans text-[11px] uppercase tracking-wide2 text-ink underline underline-offset-4"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
