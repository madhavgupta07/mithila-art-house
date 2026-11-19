import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { siteConfig } from '../config/site';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const priceFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: 'currency',
  currency: siteConfig.currency,
  maximumFractionDigits: 0,
});

export function formatPrice(amount = 0) {
  return priceFormatter.format(Number(amount) || 0);
}

export function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function truncate(text = '', length = 120) {
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

export function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function getDiscountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function generateOrderId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MAH-${stamp}${random}`;
}
