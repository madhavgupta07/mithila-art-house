import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { siteConfig } from '../config/site';
import { clamp } from '../lib/utils';

const makeKey = (id, size, frame) => `${id}|${size}|${frame}`;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',

      addItem: (product, options = {}, quantity = 1) => {
        const size = options.size || product.dimensions?.[0]?.label || 'Standard';
        const frame = options.frame || product.framing?.[0]?.label || 'Unframed';
        const sizeExtra = product.dimensions?.find((d) => d.label === size)?.modifier || 0;
        const frameExtra = product.framing?.find((f) => f.label === frame)?.modifier || 0;
        const unitPrice = product.price + sizeExtra + frameExtra;
        const key = makeKey(product.id, size, frame);

        set((state) => {
          const existing = state.items.find((item) => item.key === key);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: clamp(item.quantity + quantity, 1, product.stock || 10) }
                  : item,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                key,
                productId: product.id,
                slug: product.slug,
                name: product.name,
                artist: product.artist,
                image: product.images?.[0]?.src || '',
                size,
                frame,
                unitPrice,
                quantity: clamp(quantity, 1, product.stock || 10),
                maxQuantity: product.stock || 10,
              },
            ],
          };
        });
      },

      removeItem: (key) => set((state) => ({ items: state.items.filter((item) => item.key !== key) })),
      setQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key
              ? { ...item, quantity: clamp(quantity, 1, item.maxQuantity || 10) }
              : item,
          ),
        })),
      clearCart: () => set({ items: [], couponCode: '' }),

      applyCoupon: (code) => {
        const normalized = String(code || '').trim().toUpperCase();
        const coupon = siteConfig.coupons.find((c) => c.code.toUpperCase() === normalized);
        if (!coupon) return { ok: false, message: 'That code is not recognised in this storefront.' };
        const subtotal = selectSubtotal(get());
        if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
          return { ok: false, message: `Add ${siteConfig.currency} ${coupon.minSubtotal - subtotal} more to use this code.` };
        }
        set({ couponCode: normalized });
        return { ok: true, message: 'Coupon applied to this sample order.' };
      },
      clearCoupon: () => set({ couponCode: '' }),
    }),
    { name: 'mithila-cart-v1' },
  ),
);

export const selectCartCount = (state) => state.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectSubtotal = (state) =>
  state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

export function selectTotals(state) {
  const subtotal = selectSubtotal(state);
  const coupon = siteConfig.coupons.find(
    (c) => c.code.toUpperCase() === String(state.couponCode || '').toUpperCase(),
  );
  const discount = coupon
    ? coupon.type === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(Number(coupon.value), subtotal)
    : 0;
  const discounted = Math.max(subtotal - discount, 0);
  const shipping = !state.items.length || discounted >= siteConfig.shipping.freeAbove
    ? 0
    : siteConfig.shipping.flatFee;
  return { subtotal, discount, shipping, total: discounted + shipping };
}

/** Select primitives first so the derived object is memoised (Zustand v5 safe). */
export function useCartTotals() {
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  return useMemo(() => selectTotals({ items, couponCode }), [items, couponCode]);
}

export const useWishlistStore = create(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((item) => item !== id) : [...state.ids, id],
        })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((item) => item !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'mithila-wishlist-v1' },
  ),
);

export const useRecentStore = create(
  persist(
    (set) => ({
      slugs: [],
      push: (slug) =>
        set((state) => ({
          slugs: [slug, ...state.slugs.filter((s) => s !== slug)].slice(0, 8),
        })),
      clear: () => set({ slugs: [] }),
    }),
    { name: 'mithila-recent-v1' },
  ),
);

export const useUiStore = create((set) => ({
  cartOpen: false,
  mobileNavOpen: false,
  quickViewSlug: null,
  openCart: () => set({ cartOpen: true, mobileNavOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen, cartOpen: false })),
  closeMobileNav: () => set({ mobileNavOpen: false }),
  openQuickView: (slug) => set({ quickViewSlug: slug }),
  closeQuickView: () => set({ quickViewSlug: null }),
}));
