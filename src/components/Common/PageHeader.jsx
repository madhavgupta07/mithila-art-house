import Breadcrumbs from './Breadcrumbs';
import Container from './Container';

export default function PageHeader({ eyebrow, title, description, breadcrumbs = [], children, className = 'py-14 lg:py-20' }) {
  return (
    <section className={`relative overflow-hidden border-b border-ink/10 bg-paper/50 ${className}`}>
      <div className="pointer-events-none absolute inset-0 paper-texture opacity-30" aria-hidden="true" />
      <Container className="relative">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-7 max-w-3xl">
          {eyebrow && (
            <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">{eyebrow}</p>
          )}
          <h1 className="mt-4 font-display text-5xl leading-[1.02] text-ink sm:text-6xl lg:text-7xl">{title}</h1>
          {description && <p className="mt-5 text-[15px] leading-8 text-charcoal/75">{description}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
