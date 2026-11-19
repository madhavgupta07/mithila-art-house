const env = import.meta.env;

/**
 * All store-specific configuration lives here.
 * Values that are not supplied through .env stay empty on purpose — the storefront
 * never invents contact details, WhatsApp numbers or payment credentials.
 */
export const siteConfig = {
  name: 'Mithila Art House',
  shortName: 'Mithila',
  tagline: 'A Madhubani Art Gallery',
  url: env.VITE_SITE_URL || 'https://mithila-art.example',
  currency: 'INR',
  locale: 'en-IN',
  email: env.VITE_CONTACT_EMAIL || '',
  phone: env.VITE_CONTACT_PHONE || '',
  whatsapp: (env.VITE_WHATSAPP_NUMBER || '').replace(/[^\d]/g, ''),
  address: env.VITE_BUSINESS_ADDRESS || '',
  instagram: env.VITE_INSTAGRAM_URL || '',
  shipping: {
    flatFee: Number(env.VITE_SHIPPING_FEE || 99),
    freeAbove: Number(env.VITE_FREE_SHIPPING_ABOVE || 4999),
    note: 'Estimate shown for this storefront. Confirm real charges before launch.',
  },
  // Empty by default: the app stays frontend-only unless the backend is enabled.
  apiUrl: env.VITE_API_URL || '',
  razorpayKeyId: env.VITE_RAZORPAY_KEY_ID || '',
  razorpayEnabled: Boolean(env.VITE_RAZORPAY_KEY_ID),
  coupons: (() => {
    const sampleCoupon = [
      { code: 'WELCOME10', type: 'percent', value: 10, minSubtotal: 0, label: 'Sample preview code' },
    ];
    try {
      const configured = JSON.parse(env.VITE_COUPONS || 'null');
      return Array.isArray(configured) && configured.length ? configured : sampleCoupon;
    } catch {
      return sampleCoupon;
    }
  })(),
  // Without a Razorpay key the whole checkout stays explicitly no-payment.
  paymentsSampleOnly: !env.VITE_RAZORPAY_KEY_ID,
};

export const whatsappEnabled = Boolean(siteConfig.whatsapp);

export function whatsappLink(message = '') {
  if (!whatsappEnabled) return null;
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
