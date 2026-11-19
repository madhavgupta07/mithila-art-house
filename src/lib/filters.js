import { categoryBySlug } from '../data/collections';

const searchableText = (product) =>
  [
    product.name,
    product.subtitle,
    product.artStyle,
    product.category,
    ...(product.categories || []),
    ...(product.tags || []),
    product.description,
  ]
    .join(' ')
    .toLowerCase();

export function filterProducts(items = [], filters = {}) {
  const {
    query = '',
    categories = [],
    styles = [],
    availability = [],
    minPrice = 0,
    maxPrice = 25000,
    sort = 'featured',
  } = filters;

  const needle = query.trim().toLowerCase();
  const result = items.filter((product) => {
    if (needle) {
      const haystack = searchableText(product);
      const categoryNames = (product.categories || [])
        .map((slug) => categoryBySlug(slug)?.name || '')
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(needle) && !categoryNames.includes(needle)) return false;
    }
    const selectedCategories = categories.filter((slug) => slug !== 'all-art');
    if (selectedCategories.length && !selectedCategories.some((slug) => product.categories.includes(slug))) return false;
    if (styles.length && !styles.includes(product.artStyle)) return false;
    if (availability.length && !availability.includes(product.availability)) return false;
    if (product.price < Number(minPrice) || product.price > Number(maxPrice)) return false;
    return true;
  });

  const sorted = [...result];
  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'popularity':
      sorted.sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || b.stock - a.stock);
      break;
    case 'newest':
      sorted.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
      break;
    default:
      sorted.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          Number(b.bestseller) - Number(a.bestseller),
      );
  }
  return sorted;
}

export const emptyFilters = {
  query: '',
  categories: [],
  styles: [],
  availability: [],
  minPrice: 0,
  maxPrice: 25000,
  sort: 'featured',
};
