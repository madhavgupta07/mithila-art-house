import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import ProductCard from '../../components/ProductCard/ProductCard';
import EmptyState from '../../components/Common/EmptyState';
import ArtImage from '../../components/Common/ArtImage';
import { useProducts } from '../../context/ProductsContext';
import { categories, themes } from '../../data/collections';
import { filterProducts } from '../../lib/filters';

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const { products } = useProducts();
  const query = params.get('q') || '';
  const [text, setText] = useState(query);
  const [sort, setSort] = useState(params.get('sort') || 'featured');

  useEffect(() => setText(query), [query]);

  const results = useMemo(
    () => filterProducts(products, { query, sort, maxPrice: 25000 }),
    [query, sort, products],
  );

  const submit = (event) => {
    event.preventDefault();
    const value = text.trim();
    const next = new URLSearchParams();
    if (value) next.set('q', value);
    if (sort !== 'featured') next.set('sort', sort);
    setParams(next);
  };

  return (
    <>
      <Seo
        title={query ? `Results for “${query}”` : 'Search Artwork'}
        description={`Search the sample Mithila art catalogue${query ? ` for ${query}` : ''} by motif, style, artist label and subject.`}
        canonical="/search"
      />
      <PageHeader
        eyebrow="Find your motif"
        title={query ? `Results for “${query}”` : 'Search the gallery.'}
        description="Search by artwork name, motif, theme, style or subject. Try “peacock”, “lotus”, “wedding” or “mandala”."
        breadcrumbs={[{ label: 'Search' }]}
      />

      <Container className="py-12">
        <form onSubmit={submit} className="flex flex-col gap-4 border-b border-ink/12 pb-7 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="results-search" className="mb-2 block font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">
              Search artworks
            </label>
            <div className="flex items-center gap-3 border-b border-ink/30 pb-3">
              <FaMagnifyingGlass aria-hidden="true" className="text-charcoal/45" />
              <input
                id="results-search"
                type="search"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Artwork, motif, style…"
                className="w-full bg-transparent font-display text-2xl text-ink outline-none placeholder:text-charcoal/35"
              />
            </div>
          </div>
          <label className="sm:w-56">
            <span className="mb-2 block font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="w-full border border-ink/20 bg-transparent px-4 py-3 font-sans text-[12px] outline-none focus:border-vermilion"
            >
              <option value="featured">Featured</option>
              <option value="popularity">Most popular</option>
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
          <button
            type="submit"
            className="border border-indigoDeep bg-indigoDeep px-7 py-3 font-sans text-[11px] uppercase tracking-wide2 text-ivory transition-colors hover:border-vermilion hover:bg-vermilion sm:mb-px"
          >
            Search
          </button>
        </form>

        {query && (
          <p className="mt-7 font-sans text-[11px] uppercase tracking-wide2 text-charcoal/55">
            {results.length} {results.length === 1 ? 'artwork' : 'artworks'} found
          </p>
        )}

        {results.length > 0 ? (
          <div className="mt-9 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <>
            <EmptyState
              title={query ? 'No artworks matched that search.' : 'Start with a motif.'}
              description={query ? 'Try a broader term, or explore one of the collections below.' : 'Choose one of the popular motifs to see related artworks in the sample catalogue.'}
              actionLabel="View all artwork"
              actionTo="/shop"
            />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {themes.map((theme) => (
                <Link key={theme.slug} to={`/search?q=${encodeURIComponent(theme.query)}`} className="group relative overflow-hidden border border-ink/10">
                  <ArtImage src={theme.image} alt={theme.name} className="aspect-[3/4] w-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 font-display text-xl text-ivory">
                    {theme.name}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {categories.slice(1, 8).map((category) => (
                <Link
                  key={category.slug}
                  to={`/shop?category=${category.slug}`}
                  className="border border-ink/15 px-4 py-2 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/65 transition-colors hover:border-vermilion hover:text-vermilion"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
