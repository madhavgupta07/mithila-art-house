import toast from 'react-hot-toast';
import { FaHeart } from 'react-icons/fa6';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import EmptyState from '../../components/Common/EmptyState';
import ProductCard from '../../components/ProductCard/ProductCard';
import Button from '../../components/Common/Button';
import { useProducts } from '../../context/ProductsContext';
import { useCartStore, useWishlistStore } from '../../context/store';

export default function Wishlist() {
  const { products } = useProducts();
  const ids = useWishlistStore((state) => state.ids);
  const remove = useWishlistStore((state) => state.remove);
  const clear = useWishlistStore((state) => state.clear);
  const addItem = useCartStore((state) => state.addItem);
  const saved = products.filter((product) => ids.includes(product.id));

  const addAll = () => {
    saved.forEach((product) => addItem(product));
    toast.success(`${saved.length} ${saved.length === 1 ? 'artwork' : 'artworks'} added to your cart.`);
  };

  return (
    <>
      <Seo
        title="Your Wishlist"
        description="Artworks you saved to your browser's wishlist in this sample gallery."
        canonical="/wishlist"
      />
      <PageHeader
        eyebrow="Saved for later"
        title="Your wishlist."
        description="A quiet corner for the pieces you want to return to. Saved locally in this browser, with no account required."
        breadcrumbs={[{ label: 'Wishlist' }]}
      />

      <Container className="py-14">
        {saved.length === 0 ? (
          <EmptyState
            icon={<FaHeart />}
            title="Nothing saved yet."
            description="Use the heart button on any artwork to keep it here while you decide."
            actionLabel="Browse the collection"
            actionTo="/shop"
          />
        ) : (
          <>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-ink/12 pb-5">
              <p className="font-sans text-[11px] uppercase tracking-wide2 text-charcoal/60">
                {saved.length} {saved.length === 1 ? 'artwork' : 'artworks'} saved
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" variant="outline" onClick={addAll}>
                  Add all to cart
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    toast.success('Wishlist cleared.');
                  }}
                  className="px-3 py-2 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/55 transition-colors hover:text-vermilion"
                >
                  Clear wishlist
                </button>
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saved.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <button
                    type="button"
                    onClick={() => {
                      remove(product.id);
                      toast.success(`${product.name} removed from your wishlist.`);
                    }}
                    className="mt-4 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/50 transition-colors hover:text-vermilion"
                  >
                    Remove from wishlist
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
