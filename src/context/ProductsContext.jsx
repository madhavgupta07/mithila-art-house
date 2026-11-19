import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { products as localProducts } from '../data/products';
import { fetchProducts } from '../lib/api';

const ProductsContext = createContext(null);

/**
 * Serves the product catalogue from the MERN API when it is available and
 * falls back to the bundled sample data otherwise. The rest of the app reads
 * products only through this context, so the source never leaks into views.
 */
export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(localProducts);
  const [source, setSource] = useState('local');
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      if (Array.isArray(data?.products) && data.products.length) {
        setProducts(data.products);
        setSource('api');
        return true;
      }
      return false;
    } catch {
      // Backend offline — silently keep the bundled catalogue.
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => {
    const productBySlug = (slug) => products.find((product) => product.slug === slug);
    const productsByFlag = (flag) => products.filter((product) => product[flag]);
    const getRelatedProducts = (product, limit = 4) =>
      products
        .filter((item) => item.slug !== product.slug)
        .map((item) => ({
          item,
          score:
            item.categories?.filter((category) => product.categories?.includes(category)).length * 2 +
            (item.artStyle === product.artStyle ? 1 : 0) +
            (item.bestseller ? 0.5 : 0),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ item }) => item);

    return { products, source, loading, refresh, productBySlug, productsByFlag, getRelatedProducts };
  }, [products, source, loading, refresh]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used inside ProductsProvider');
  return context;
}
