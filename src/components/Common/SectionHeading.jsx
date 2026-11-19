import { cn } from '../../lib/utils';
import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, description, align = 'left', action, className }) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        align === 'right' && 'items-end text-right',
        className,
      )}
    >
      {eyebrow && (
        <span className="font-sans text-[10px] font-medium uppercase tracking-luxe text-vermilion">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-3xl font-display text-4xl font-medium leading-[1.08] text-ink sm:text-5xl lg:text-[56px]">
        {title}
      </h2>
      {description && <p className="max-w-xl text-[15px] leading-7 text-charcoal/75">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </Reveal>
  );
}
