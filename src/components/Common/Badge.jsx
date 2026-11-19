import { cn } from '../../lib/utils';

const styles = {
  bestseller: 'bg-indigoDeep text-ivory',
  new: 'bg-forest text-ivory',
  sale: 'bg-vermilion text-ivory',
  soldout: 'bg-ink text-ivory',
  neutral: 'bg-ivory/95 text-ink border border-ink/10',
};

export default function Badge({ children, variant = 'neutral', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-wide2',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
