import dotenv from 'dotenv';

dotenv.config();

const asNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

// Coupons are supplied as a JSON array in the environment so rates can change
// without a code deploy. Invalid entries are ignored rather than crashing boot.
function parseCoupons(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (coupon) =>
        coupon &&
        typeof coupon.code === 'string' &&
        ['percent', 'flat'].includes(coupon.type) &&
        Number.isFinite(Number(coupon.value)),
    );
  } catch (error) {
    console.warn('[config] COUPONS could not be parsed:', error.message);
    return [];
  }
}

export const config = {
  port: asNumber(process.env.PORT, 4000),
  mongoUri: process.env.MONGODB_URI || '',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  adminApiKey: process.env.ADMIN_API_KEY || '',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  shippingFee: asNumber(process.env.SHIPPING_FEE, 99),
  freeShippingAbove: asNumber(process.env.FREE_SHIPPING_ABOVE, 4999),
  coupons: parseCoupons(process.env.COUPONS),
};

export const isRazorpayConfigured = () =>
  Boolean(config.razorpayKeyId && config.razorpayKeySecret);

export default config;
