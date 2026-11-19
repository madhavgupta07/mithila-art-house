import { categories } from '../../data/collections';
import { formatPrice, cn } from '../../lib/utils';

const styles = ['Traditional Madhubani', 'Contemporary Mithila', 'Folk Fusion'];
const availabilityOptions = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'made_to_order', label: 'Made to order' },
];

function Checkbox({ label, checked, onChange, count }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-[13px] text-charcoal/75 hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-vermilion focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
      />
      <span className="flex-1">{label}</span>
      {typeof count === 'number' && <span className="font-sans text-[10px] text-charcoal/40">{count}</span>}
    </label>
  );
}

export default function Filters({ filters, update, reset, resultCount, className }) {
  const toggleArrayValue = (key, value) => {
    const current = filters[key] || [];
    update(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  return (
    <div className={cn('font-sans', className)}>
      <div className="flex items-center justify-between border-b border-ink/10 pb-4">
        <h2 className="text-[11px] font-medium uppercase tracking-luxe text-ink">Refine</h2>
        <button
          type="button"
          onClick={reset}
          className="text-[10px] uppercase tracking-wide2 text-vermilion hover:text-ink"
        >
          Clear all
        </button>
      </div>
      <p className="mt-3 text-[11px] text-charcoal/50">{resultCount} artworks in view</p>

      <fieldset className="mt-7">
        <legend className="mb-3 text-[10px] font-medium uppercase tracking-wide2 text-charcoal/60">
          Collection
        </legend>
        <div className="space-y-0.5">
          {categories
            .filter((category) => category.slug !== 'custom')
            .map((category) => (
              <Checkbox
                key={category.slug}
                label={category.name}
                count={category.count}
                checked={filters.categories.includes(category.slug)}
                onChange={() => toggleArrayValue('categories', category.slug)}
              />
            ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-3 text-[10px] font-medium uppercase tracking-wide2 text-charcoal/60">
          Art style
        </legend>
        <div className="space-y-0.5">
          {styles.map((style) => (
            <Checkbox
              key={style}
              label={style}
              checked={filters.styles.includes(style)}
              onChange={() => toggleArrayValue('styles', style)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-3 text-[10px] font-medium uppercase tracking-wide2 text-charcoal/60">
          Price range
        </legend>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="price-min">
            Minimum price
          </label>
          <input
            id="price-min"
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(event) => update('minPrice', Math.max(0, Number(event.target.value)))}
            className="w-full border border-ink/15 bg-transparent px-3 py-2 text-xs outline-none focus:border-vermilion"
          />
          <span className="text-charcoal/40">–</span>
          <label className="sr-only" htmlFor="price-max">
            Maximum price
          </label>
          <input
            id="price-max"
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(event) => update('maxPrice', Math.max(0, Number(event.target.value)))}
            className="w-full border border-ink/15 bg-transparent px-3 py-2 text-xs outline-none focus:border-vermilion"
          />
        </div>
        <label className="mt-4 block" htmlFor="price-slider">
          <span className="sr-only">Maximum price slider</span>
          <input
            id="price-slider"
            type="range"
            min="0"
            max="25000"
            step="500"
            value={filters.maxPrice}
            onChange={(event) => update('maxPrice', Number(event.target.value))}
            className="w-full accent-vermilion"
          />
        </label>
        <p className="mt-2 text-[11px] text-charcoal/50">
          Up to {formatPrice(filters.maxPrice)}
        </p>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-3 text-[10px] font-medium uppercase tracking-wide2 text-charcoal/60">
          Availability
        </legend>
        <div className="space-y-0.5">
          {availabilityOptions.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={filters.availability.includes(option.value)}
              onChange={() => toggleArrayValue('availability', option.value)}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-8 border-t border-ink/10 pt-6">
        <p className="text-[11px] leading-5 text-charcoal/50">
          Prices and stock in this catalogue are sample data.
        </p>
      </div>
    </div>
  );
}
