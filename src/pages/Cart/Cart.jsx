import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaTrash } from 'react-icons/fa6';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import Button from '../../components/Common/Button';
import EmptyState from '../../components/Common/EmptyState';
import CartItem from '../../components/Cart/CartItem';
import OrderSummary from '../../components/Cart/OrderSummary';
import { useCartStore } from '../../context/store';

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <>
      <Seo
        title="Your Cart"
        description="Review the artworks in your sample cart, adjust quantities and explore the sample checkout flow."
        canonical="/cart"
      />
      <PageHeader
        eyebrow="Your selection"
        title="The cart."
        description="Take a moment with your choices. Quantities, size and framing can all be adjusted here — nothing is charged in this storefront."
        breadcrumbs={[{ label: 'Cart' }]}
      />

      <Container className="py-14">
        {items.length === 0 ? (
          <EmptyState
            title="Your cart is empty."
            description="Browse the gallery and add the artworks you would like to live with. Your cart is saved in this browser."
            actionLabel="Explore the collection"
            actionTo="/shop"
          />
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/12 pb-5">
                <p className="font-sans text-[11px] uppercase tracking-wide2 text-charcoal/60">
                  {items.length} {items.length === 1 ? 'artwork' : 'artworks'} in your cart
                </p>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    toast.success('Cart cleared.');
                  }}
                  className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/55 transition-colors hover:text-vermilion"
                >
                  <FaTrash aria-hidden="true" /> Clear cart
                </button>
              </div>

              <div>
                {items.map((item) => (
                  <CartItem key={item.key} item={item} />
                ))}
              </div>

              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-wide2 text-ink transition-colors hover:text-vermilion"
              >
                <FaArrowLeft aria-hidden="true" /> Continue browsing
              </Link>
            </div>

            <OrderSummary className="self-start lg:sticky lg:top-28">
              <Button to="/checkout" full size="lg">
                Proceed to checkout
              </Button>
              <p className="mt-4 text-center text-[11px] leading-5 text-charcoal/50">
                Sample checkout — no live payment is taken.
              </p>
            </OrderSummary>
          </div>
        )}
      </Container>
    </>
  );
}
