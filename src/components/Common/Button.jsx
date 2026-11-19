import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-indigoDeep text-ivory hover:bg-indigo border border-indigoDeep hover:border-indigo',
  accent: 'bg-vermilion text-ivory hover:bg-terra border border-vermilion hover:border-terra',
  outline: 'border border-ink/25 text-ink hover:border-indigoDeep hover:text-indigoDeep bg-transparent',
  light: 'bg-ivory text-ink border border-ivory hover:bg-paper',
  ghost: 'text-ink hover:text-vermilion bg-transparent',
};

const sizes = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-6 py-3 text-[12px]',
  lg: 'px-8 py-4 text-[12px]',
};

const Button = forwardRef(function Button(
  { children, className, variant = 'primary', size = 'md', to, href, full, type = 'button', ...props },
  ref,
) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2.5 font-sans font-medium uppercase tracking-wide2 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    full && 'w-full',
    className,
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} type={type} className={classes} {...props}>
      {children}
    </button>
  );
});

export default Button;
