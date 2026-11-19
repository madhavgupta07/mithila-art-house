import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaExpand } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { formatPrice, getDiscountPercent, cn } from '../../lib/utils';
import { useUiStore, useWishlistStore } from '../../context/store';
import Badge from '../Common/Badge';
import ArtImage from '../Common/ArtImage';

function ProductCard({ product, className, imageClassName }) {
  const ids = useWishlistStore((state) => state.ids);
  const toggle = useWishlistStore((state) => state.toggle);
  const openQuickView = useUiStore((state) => state.openQuickView);
  const saved = ids.includes(product.id);
  const discount = getDiscountPercent(product.price, product.originalPrice);

  const onWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(product.id);
    toast.success(saved ? 'Removed from your wishlist.' : 'Saved to your wishlist.');
  };

  return (
    <article className={cn('group relative', className)}>
      <div className="relative overflow-hidden border border-ink/10 bg-paper">
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <ArtImage
            src={product.images[0].src}
            alt={product.images[0].alt}
            className="aspect-[4/5] w-full"
            imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
          <ArtImage
            src={product.images[1].src}
            alt={`${product.name} detail`}
            className="absolute inset-0 aspect-auto opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.bestseller && <Badge variant="bestseller">Bestseller</Badge>}
          {product.newArrival && <Badge variant="new">New arrival</Badge>}
          {discount > 0 && <Badge variant="sale">{discount}% off</Badge>}
          {product.availability === 'made_to_order' && <Badge variant="neutral">Made to order</Badge>}
          {product.availability === 'sold_out' && <Badge variant="soldout">Sold out</Badge>}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => openQuickView(product.slug)}
            className="flex flex-1 items-center justify-center gap-2 bg-ivory/95 px-3 py-2.5 font-sans text-[10px] uppercase tracking-wide2 text-ink transition-colors hover:bg-indigoDeep hover:text-ivory"
          >
            <FaExpand aria-hidden="true" /> Quick view
          </button>
          <button
            type="button"
            onClick={onWishlist}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            aria-pressed={saved}
            className={cn(
              'flex h-10 w-10 items-center justify-center border border-ink/10 bg-ivory/95 transition-colors hover:bg-vermilion hover:text-ivory',
              saved ? 'text-vermilion' : 'text-ink',
            )}
          >
            {saved ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-sans text-[9px] uppercase tracking-luxe text-vermilion">{product.artStyle}</p>
          <h3 className="mt-2 font-display text-[22px] leading-tight text-ink transition-colors group-hover:text-vermilion">
            <Link to={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="mt-1 text-[12px] text-charcoal/60">{product.subtitle}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-xl text-ink">{formatPrice(product.price)}</p>
          {product.originalPrice && (
            <p className="mt-0.5 font-sans text-[11px] text-charcoal/45 line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
