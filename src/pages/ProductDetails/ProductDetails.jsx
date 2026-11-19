import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaWhatsapp, FaCheck, FaTruck, FaShieldHalved } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import Breadcrumbs from '../../components/Common/Breadcrumbs';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Accordion from '../../components/Common/Accordion';
import SectionHeading from '../../components/Common/SectionHeading';
import ProductGallery from '../../components/ProductGallery/ProductGallery';
import ProductCard from '../../components/ProductCard/ProductCard';
import { formatPrice, getDiscountPercent, cn } from '../../lib/utils';
import { useProducts } from '../../context/ProductsContext';
import { categoryBySlug } from '../../data/collections';
import { siteConfig, whatsappEnabled, whatsappLink } from '../../config/site';
import { useCartStore, useRecentStore, useUiStore, useWishlistStore } from '../../context/store';
import NotFound from '../NotFound';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { productBySlug, getRelatedProducts } = useProducts();
  const product = productBySlug(slug);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUiStore((state) => state.openCart);
  const pushRecent = useRecentStore((state) => state.push);
  const ids = useWishlistStore((state) => state.ids);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const [size, setSize] = useState('');
  const [frame, setFrame] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSize(product.dimensions[0].label);
      setFrame(product.framing[0].label);
      setQuantity(1);
      pushRecent(product.slug);
    }
  }, [product, pushRecent]);

  if (!product) return <NotFound />;

  const saved = ids.includes(product.id);
  const sizeExtra = product.dimensions.find((d) => d.label === size)?.modifier || 0;
  const frameExtra = product.framing.find((f) => f.label === frame)?.modifier || 0;
  const currentPrice = product.price + sizeExtra + frameExtra;
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const related = getRelatedProducts(product);
  const category = categoryBySlug(product.category);
  const waMessage = `Hello, I'd like to know more about "${product.name}" (${product.id}). Size: ${size}, framing: ${frame}.`;
  const waHref = whatsappLink(waMessage);

  const onAdd = (buyNow = false) => {
    addItem(product, { size, frame }, quantity);
    if (buyNow) {
      navigate('/checkout');
      return;
    }
    toast.success(`${product.name} added to your cart.`);
    openCart();
  };

  return (
    <>
      <Seo
        title={product.name}
        description={product.description}
        image={product.images[0].src}
        canonical={`/product/${product.slug}`}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          sku: product.id,
          brand: { '@type': 'Brand', name: siteConfig.name },
          offers: {
            '@type': 'Offer',
            priceCurrency: siteConfig.currency,
            price: product.price,
            availability:
              product.availability === 'made_to_order'
                ? 'https://schema.org/PreOrder'
                : 'https://schema.org/InStock',
            url: `${siteConfig.url}/product/${product.slug}`,
          },
        }}
      />

      <Container className="pt-10">
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/shop' },
            { label: category?.name || 'Artwork', to: `/shop?category=${product.category}` },
            { label: product.name },
          ]}
        />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />

          <div className="lg:pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">
                {product.artStyle} · {product.id}
              </p>
              {product.bestseller && <Badge variant="bestseller">Bestseller</Badge>}
              {product.newArrival && <Badge variant="new">New arrival</Badge>}
            </div>
            <h1 className="mt-4 font-display text-5xl leading-[1.02] text-ink sm:text-6xl">{product.name}</h1>
            <p className="mt-3 font-display text-2xl italic text-charcoal/60">{product.subtitle}</p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-3xl text-ink">{formatPrice(currentPrice)}</span>
              {product.originalPrice && (
                <>
                  <span className="font-sans text-sm text-charcoal/45 line-through">
                    {formatPrice(product.originalPrice + sizeExtra + frameExtra)}
                  </span>
                  {discount > 0 && <Badge variant="sale">{discount}% off</Badge>}
                </>
              )}
            </div>

            <p className="mt-6 text-[14px] leading-7 text-charcoal/75">{product.description}</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label>
                <span className="mb-2 block font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">
                  Size · {sizeExtra ? `+ ${formatPrice(sizeExtra)}` : 'included'}
                </span>
                <select
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                  className="w-full border border-ink/20 bg-transparent px-4 py-3 text-[13px] outline-none focus:border-vermilion"
                >
                  {product.dimensions.map((option) => (
                    <option key={option.label} value={option.label}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-2 block font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">
                  Framing · {frameExtra ? `+ ${formatPrice(frameExtra)}` : 'included'}
                </span>
                <select
                  value={frame}
                  onChange={(event) => setFrame(event.target.value)}
                  className="w-full border border-ink/20 bg-transparent px-4 py-3 text-[13px] outline-none focus:border-vermilion"
                >
                  {product.framing.map((option) => (
                    <option key={option.label} value={option.label}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">Quantity</span>
              <div className="inline-flex items-center border border-ink/20">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-paper" aria-label="Decrease quantity">−</button>
                <span className="min-w-8 text-center text-sm" aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-paper" aria-label="Increase quantity">+</button>
              </div>
              <span className="text-[11px] text-charcoal/50">
                {product.availability === 'in_stock' ? `${product.stock} available in this sample` : 'Made to order'}
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="flex-1" onClick={() => onAdd(false)}>
                Add to cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={() => onAdd(true)}>
                Buy now
              </Button>
              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product.id);
                  toast.success(saved ? 'Removed from your wishlist.' : 'Saved to your wishlist.');
                }}
                aria-pressed={saved}
                aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                className={cn(
                  'flex h-[50px] w-[50px] shrink-0 items-center justify-center border transition-colors',
                  saved ? 'border-vermilion bg-vermilion text-ivory' : 'border-ink/25 text-ink hover:border-vermilion hover:text-vermilion',
                )}
              >
                {saved ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-wide2 text-forest hover:text-vermilion"
              >
                <FaWhatsapp aria-hidden="true" /> Ask about this artwork on WhatsApp
              </a>
            )}
            {!whatsappEnabled && (
              <p className="mt-4 text-[11px] text-charcoal/45">
                WhatsApp inquiries appear once a business number is configured in the environment variables.
              </p>
            )}

            <div className="mt-8 grid gap-3 border-y border-ink/10 py-5 text-[12px] text-charcoal/70 sm:grid-cols-2">
              <p className="flex items-center gap-2"><FaTruck aria-hidden="true" className="text-terracotta" /> Shipping estimate shown at checkout</p>
              <p className="flex items-center gap-2"><FaShieldHalved aria-hidden="true" className="text-terracotta" /> No payment taken in this storefront</p>
            </div>

            <div className="mt-6 bg-paper/60 p-5 text-[12px] leading-6 text-charcoal/65">
              <p className="flex items-start gap-2">
                <FaCheck aria-hidden="true" className="mt-1 shrink-0 text-forest" />
                Sample catalogue notice: this visual is an original illustration created for this storefront. It is not a photograph of a hand-painted artwork by a named artist. Replace with verified imagery and provenance before selling.
              </p>
            </div>
          </div>
        </div>

        {/* Story and details */}
        <div className="mt-20 grid gap-12 border-t border-ink/10 pt-14 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">Meaning & making</p>
            <h2 className="mt-4 font-display text-4xl text-ink">The story behind the work.</h2>
            <div className="mt-7 space-y-6 text-[14px] leading-7 text-charcoal/75">
              <div>
                <h3 className="font-display text-2xl text-ink">Inspiration</h3>
                <p className="mt-2">{product.inspiration}</p>
              </div>
              <div>
                <h3 className="font-display text-2xl text-ink">Symbolism</h3>
                <p className="mt-2">{product.symbolism}</p>
              </div>
            </div>
          </div>
          <Accordion
            items={[
              {
                title: 'Artwork details',
                content: (
                  <ul className="space-y-2">
                    <li><strong>Style:</strong> {product.artStyle}</li>
                    <li><strong>Technique:</strong> {product.technique}</li>
                    <li><strong>Materials:</strong> {product.materials}</li>
                    <li><strong>Surface:</strong> {product.base}</li>
                    <li><strong>Sizes:</strong> {product.dimensions.map((d) => d.label).join(' · ')}</li>
                    <li><strong>Framing:</strong> {product.framing.map((f) => f.label).join(' · ')}</li>
                  </ul>
                ),
              },
              {
                title: 'Shipping & care',
                content: (
                  <div className="space-y-3">
                    <p>{siteConfig.shipping.note} Actual dispatch timelines and charges must be published before launch.</p>
                    <p><strong>Care:</strong> {product.care}</p>
                  </div>
                ),
              },
              {
                title: 'Authenticity & provenance',
                content: (
                  <p>
                    This is a sample listing. No claim of handcraft, age, certification or artisan
                    authorship is made. Add verified provenance, artist consent and documentation
                    for real products.
                  </p>
                ),
              },
              {
                title: 'Reviews',
                content: (
                  <p>
                    No reviews are shown because none have been received. Verified customer reviews
                    will appear here once a review system is connected.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </Container>

      <section className="mt-24 bg-paper/50 py-20">
        <Container>
          <SectionHeading
            eyebrow="You may also like"
            title="More from the gallery."
            action={<Link to="/shop" className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-wide2 text-vermilion hover:text-ink">View all <FaCheck aria-hidden="true" className="hidden" /></Link>}
          />
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </Container>
      </section>
    </>
  );
}
