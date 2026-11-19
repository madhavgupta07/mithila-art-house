import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatPrice, cn } from '../../lib/utils';
import { useProducts } from '../../context/ProductsContext';
import { useCartStore, useUiStore } from '../../context/store';
import Modal from '../Common/Modal';
import ArtImage from '../Common/ArtImage';
import Button from '../Common/Button';

export default function QuickView() {
  const { productBySlug } = useProducts();
  const slug = useUiStore((state) => state.quickViewSlug);
  const closeQuickView = useUiStore((state) => state.closeQuickView);
  const openCart = useUiStore((state) => state.openCart);
  const addItem = useCartStore((state) => state.addItem);
  const product = slug ? productBySlug(slug) : null;
  const [size, setSize] = useState('');
  const [frame, setFrame] = useState('');

  useEffect(() => {
    if (product) {
      setSize(product.dimensions[0].label);
      setFrame(product.framing[0].label);
    }
  }, [product]);

  if (!product) return null;

  const sizeExtra = product.dimensions.find((d) => d.label === size)?.modifier || 0;
  const frameExtra = product.framing.find((f) => f.label === frame)?.modifier || 0;

  return (
    <Modal open={Boolean(slug)} onClose={closeQuickView} title={`Quick view: ${product.name}`} size="lg">
      <div className="grid md:grid-cols-2">
        <ArtImage src={product.images[0].src} alt={product.images[0].alt} className="aspect-square md:aspect-auto md:h-full" />
        <div className="p-7 sm:p-10">
          <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">{product.artStyle}</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-ink">{product.name}</h2>
          <p className="mt-2 text-[13px] text-charcoal/65">{product.subtitle}</p>
          <p className="mt-5 font-display text-2xl text-ink">{formatPrice(product.price + sizeExtra + frameExtra)}</p>
          <p className="mt-5 text-[13px] leading-6 text-charcoal/70">{product.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">Size</span>
              <select
                value={size}
                onChange={(event) => setSize(event.target.value)}
                className="mt-2 w-full border border-ink/20 bg-transparent px-3 py-2.5 text-sm text-ink outline-none focus:border-vermilion"
              >
                {product.dimensions.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">Framing</span>
              <select
                value={frame}
                onChange={(event) => setFrame(event.target.value)}
                className="mt-2 w-full border border-ink/20 bg-transparent px-3 py-2.5 text-sm text-ink outline-none focus:border-vermilion"
              >
                {product.framing.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              full
              onClick={() => {
                addItem(product, { size, frame });
                closeQuickView();
                toast.success(`${product.name} added to your cart.`);
                openCart();
              }}
            >
              Add to cart
            </Button>
            <Button variant="outline" to={`/product/${product.slug}`} onClick={closeQuickView}>
              Full details
            </Button>
          </div>
          <p className="mt-4 text-[11px] leading-5 text-charcoal/50">
            Sample catalogue · artwork visuals are original illustrations for this storefront.
          </p>
        </div>
      </div>
    </Modal>
  );
}
