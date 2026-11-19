import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSliders, FaXmark, FaMagnifyingGlass } from 'react-icons/fa6';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import Breadcrumbs from '../../components/Common/Breadcrumbs';
import Button from '../../components/Common/Button';
import EmptyState from '../../components/Common/EmptyState';
import ArtImage from '../../components/Common/ArtImage';
import ProductCard from '../../components/ProductCard/ProductCard';
import Filters from '../../components/Filters/Filters';
import { useProducts } from '../../context/ProductsContext';
import { categoryBySlug } from '../../data/collections';
import { emptyFilters, filterProducts } from '../../lib/filters';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cn } from '../../lib/utils';

const splitParam = (value) => (value ? value.split(',').filter(Boolean) : []);

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'popularity', label: 'Most popular' },
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const { products } = useProducts();
  const [mobileFilters, setMobileFilters] = useState(false);
  const [searchText, setSearchText] = useState(params.get('q') || '');
  useLockBodyScroll(mobileFilters);

  const filters = useMemo(
    () => ({
      query: params.get('q') || '',
      categories: splitParam(params.get('category')),
      styles: splitParam(params.get('style')),
      availability: splitParam(params.get('availability')),
      minPrice: Number(params.get('min') || 0),
      maxPrice: Number(params.get('max') || 25000),
      sort: params.get('sort') || 'featured',
    }),
    [params],
  );

  const visible = useMemo(() => filterProducts(products, filters), [filters, products]);
  const activeCategory = filters.categories.length === 1 ? categoryBySlug(filters.categories[0]) : null;

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    const handlers = {
      categories: (v) => (v.length ? next.set('category', v.join(',')) : next.delete('category')),
      styles: (v) => (v.length ? next.set('style', v.join(',')) : next.delete('style')),
      availability: (v) => (v.length ? next.set('availability', v.join(',')) : next.delete('availability')),
      minPrice: (v) => (v ? next.set('min', String(v)) : next.delete('min')),
      maxPrice: (v) => (v >= 25000 ? next.delete('max') : next.set('max', String(v))),
      sort: (v) => (v === 'featured' ? next.delete('sort') : next.set('sort', v)),
      query: (v) => (v ? next.set('q', v) : next.delete('q')),
    };
    handlers[key]?.(value);
    setParams(next, { replace: true });
  };

  const reset = () => {
    setSearchText('');
    setParams(new URLSearchParams(), { replace: true });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    update('query', searchText.trim());
  };

  const filterProps = { filters, update, reset, resultCount: visible.length };

  return (
    <>
      <Seo
        title={activeCategory?.name || 'The Collection'}
        description={activeCategory?.description || 'Browse original Mithila-inspired artwork by collection, style, price and availability.'}
        canonical="/shop"
      />

      <section className="relative overflow-hidden border-b border-ink/10 bg-paper/50">
        <div className="pointer-events-none absolute inset-0 paper-texture opacity-30" aria-hidden="true" />
        <Container className="relative grid gap-8 py-12 lg:grid-cols-[1fr_0.45fr] lg:items-center lg:py-16">
          <div>
            <Breadcrumbs items={[{ label: 'Shop' }]} />
            <h1 className="mt-6 font-display text-5xl leading-none text-ink sm:text-6xl">
              {activeCategory?.name || 'The Collection'}
            </h1>
            <p className="mt-4 max-w-xl text-[14px] leading-7 text-charcoal/70">
              {activeCategory?.description ||
                'Original Mithila-inspired illustrations, grouped so you can find the right motif, mood and scale for your space.'}
            </p>
          </div>
          <ArtImage
            src={activeCategory?.image || '/images/art/art-cosmic-lotus.svg'}
            alt={activeCategory?.name || 'Mithila-inspired artwork'}
            className="hidden aspect-[16/10] w-full border border-ink/10 lg:block"
          />
        </Container>
      </section>

      <Container className="py-12">
        <div className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-center">
          <form onSubmit={submitSearch} className="flex w-full max-w-sm items-center gap-3 border-b border-ink/25 pb-2">
            <label htmlFor="shop-search" className="sr-only">Search artworks</label>
            <FaMagnifyingGlass aria-hidden="true" className="text-charcoal/50" />
            <input
              id="shop-search"
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search artworks, motifs, styles…"
              className="w-full bg-transparent py-1.5 text-[13px] outline-none placeholder:text-charcoal/40"
            />
            {searchText && (
              <button type="button" onClick={() => { setSearchText(''); update('query', ''); }} aria-label="Clear search">
                <FaXmark className="text-charcoal/50 hover:text-vermilion" />
              </button>
            )}
          </form>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2.5 font-sans text-[10px] uppercase tracking-wide2 lg:hidden"
            >
              <FaSliders aria-hidden="true" /> Filters
            </button>
            <label htmlFor="shop-sort" className="sr-only">Sort artworks</label>
            <select
              id="shop-sort"
              value={filters.sort}
              onChange={(event) => update('sort', event.target.value)}
              className="border border-ink/20 bg-transparent px-4 py-2.5 font-sans text-[11px] text-ink outline-none focus:border-vermilion"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[230px_1fr]">
          <aside className="hidden lg:block" aria-label="Product filters">
            <Filters {...filterProps} className="sticky top-28" />
          </aside>

          <div>
            {(filters.query ||
              filters.categories.length > 0 ||
              filters.styles.length > 0 ||
              filters.availability.length > 0 ||
              filters.minPrice > 0 ||
              filters.maxPrice < 25000) && (
              <div className="mb-8 flex flex-wrap items-center gap-2">
                {filters.query && (
                  <button type="button" onClick={() => update('query', '')} className="border border-ink/15 px-3 py-1.5 font-sans text-[10px] uppercase tracking-wide2 hover:border-vermilion hover:text-vermilion">
                    “{filters.query}” ×
                  </button>
                )}
                {filters.categories.map((slug) => (
                  <button key={slug} type="button" onClick={() => update('categories', filters.categories.filter((c) => c !== slug))} className="border border-ink/15 px-3 py-1.5 font-sans text-[10px] uppercase tracking-wide2 hover:border-vermilion hover:text-vermilion">
                    {categoryBySlug(slug)?.name || slug} ×
                  </button>
                ))}
                {filters.styles.map((style) => (
                  <button key={style} type="button" onClick={() => update('styles', filters.styles.filter((s) => s !== style))} className="border border-ink/15 px-3 py-1.5 font-sans text-[10px] uppercase tracking-wide2 hover:border-vermilion hover:text-vermilion">
                    {style} ×
                  </button>
                ))}
              </div>
            )}

            {visible.length === 0 ? (
              <EmptyState
                title="No artworks match those filters."
                description="Try a different motif, widen the price range or clear the filters to see the full collection."
                actionLabel="Reset filters"
                actionTo="/shop"
              />
            ) : (
              <>
                <p className="mb-7 font-sans text-[11px] uppercase tracking-wide2 text-charcoal/50">
                  Showing {visible.length} of {products.length} artworks
                </p>
                <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                  {visible.map((product, index) => (
                    <ProductCard key={product.id} product={product} className={cn(index % 5 === 0 && 'xl:col-span-1')} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Container>

      {mobileFilters && (
        <div className="fixed inset-0 z-[85] lg:hidden">
          <button type="button" aria-label="Close filters" onClick={() => setMobileFilters(false)} className="absolute inset-0 bg-ink/55" />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm overflow-y-auto bg-ivory p-6">
            <div className="mb-6 flex justify-end">
              <button type="button" onClick={() => setMobileFilters(false)} aria-label="Close filters" className="border border-ink/15 p-2">
                <FaXmark />
              </button>
            </div>
            <Filters {...filterProps} />
            <Button full className="mt-8" onClick={() => setMobileFilters(false)}>
              Show {visible.length} artworks
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
