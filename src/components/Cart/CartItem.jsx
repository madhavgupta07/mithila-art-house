import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa6';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../context/store';
import ArtImage from '../Common/ArtImage';

export default function CartItem({ item, compact = false }) {
  const { setQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 border-b border-ink/10 py-5">
      <Link to={`/product/${item.slug}`} className="shrink-0">
        <ArtImage
          src={item.image}
          alt={item.name}
          className={compact ? 'h-24 w-20' : 'h-32 w-24 sm:h-36 sm:w-28'}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/product/${item.slug}`}
              className="font-display text-xl leading-tight text-ink hover:text-vermilion"
            >
              {item.name}
            </Link>
            <p className="mt-1 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/50">
              {item.artist}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            className="text-charcoal/50 transition-colors hover:text-vermilion"
            aria-label={`Remove ${item.name} from cart`}
          >
            <FaTrash size={13} />
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-charcoal/60">
          {item.size} · {item.frame}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="inline-flex items-center border border-ink/20">
            <button
              type="button"
              onClick={() => setQuantity(item.key, item.quantity - 1)}
              className="px-2.5 py-1.5 text-sm text-ink hover:bg-paper"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              −
            </button>
            <span className="min-w-6 text-center font-sans text-xs" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(item.key, item.quantity + 1)}
              className="px-2.5 py-1.5 text-sm text-ink hover:bg-paper"
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>
          <p className="font-display text-xl text-ink">{formatPrice(item.unitPrice * item.quantity)}</p>
        </div>
      </div>
    </div>
  );
}
