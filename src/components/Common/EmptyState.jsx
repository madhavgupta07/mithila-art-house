import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function EmptyState({ icon, title, description, actionLabel, actionTo, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-20 text-center', className)}>
      {icon && <div className="mb-5 text-4xl text-indigo/50">{icon}</div>}
      <h3 className="font-display text-3xl text-ink">{title}</h3>
      {description && <p className="mt-3 max-w-md text-sm leading-7 text-charcoal/70">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-7 border-b border-vermilion pb-1 font-sans text-[11px] uppercase tracking-wide2 text-vermilion transition-colors hover:text-ink"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
