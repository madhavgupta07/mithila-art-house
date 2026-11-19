/**
 * Thin API client for the optional MERN backend.
 *
 * The storefront is designed to degrade gracefully: if no API is reachable,
 * callers fall back to the bundled sample data and browser-only sample flow.
 */

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const apiConfigured = Boolean(API_URL);

export async function apiFetch(path, options = {}) {
  // With no API URL configured the app stays fully frontend-only. Skipping
  // the request here also avoids noisy Vite proxy errors during `npm run dev`.
  if (!apiConfigured) {
    throw new Error('API is not configured. Set VITE_API_URL=/api to use the backend.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || `Request failed (${response.status})`);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export const fetchProducts = () => apiFetch('/products');

export const saveOrder = (order) =>
  apiFetch('/orders', { method: 'POST', body: JSON.stringify(order) });

export const saveInquiry = (inquiry) =>
  apiFetch('/inquiries', { method: 'POST', body: JSON.stringify(inquiry) });

export const createRazorpayOrder = (orderId) =>
  apiFetch('/payments/create', { method: 'POST', body: JSON.stringify({ orderId }) });

export const verifyRazorpayPayment = (payload) =>
  apiFetch('/payments/verify', { method: 'POST', body: JSON.stringify(payload) });

export const adminFetch = (path, adminKey, options = {}) =>
  apiFetch(path, {
    ...options,
    headers: { 'x-admin-key': adminKey, ...(options.headers || {}) },
  });

let razorpayScriptPromise = null;

export function loadRazorpayScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser only'));
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => {
      razorpayScriptPromise = null;
      script.remove();
      reject(new Error('Could not load the Razorpay checkout script.'));
    };
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

/**
 * Opens Razorpay Checkout. Card details are entered in Razorpay's hosted
 * form — this app never sees or stores them.
 */
export async function openRazorpayCheckout({ keyId, orderId, amount, currency, description, prefill }) {
  const Razorpay = await loadRazorpayScript();
  if (!Razorpay) throw new Error('Razorpay checkout is unavailable.');

  return new Promise((resolve, reject) => {
    let settled = false;
    const done = (fn, value) => {
      if (settled) return;
      settled = true;
      fn(value);
    };

    const checkout = new Razorpay({
      key: keyId,
      amount,
      currency,
      name: 'Mithila Art House',
      description,
      order_id: orderId,
      prefill: prefill || {},
      notes: { source: 'mithila-art-house-storefront' },
      theme: { color: '#C13A24' },
      handler: (response) => done(resolve, response),
      modal: {
        ondismiss: () => done(reject, new Error('Payment window was closed before completion.')),
      },
    });

    checkout.on('payment.failed', (response) => {
      done(reject, new Error(response?.error?.description || 'The payment was not completed.'));
    });

    checkout.open();
  });
}
