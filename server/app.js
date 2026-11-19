import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { config } from './config.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import inquiriesRouter from './routes/inquiries.js';
import paymentsRouter from './routes/payments.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());

// Restrict browser access to the configured storefront origin(s).
const allowedOrigins = config.clientOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'mithila-art-api', time: new Date().toISOString() });
});

// The webhook needs the exact raw bytes to verify Razorpay's HMAC, so it must
// be mounted with `express.raw` BEFORE the global JSON body parser.
app.use('/api/payments/webhook', express.raw({ type: 'application/json', limit: '1mb' }));

app.use(express.json({ limit: '1mb' }));

const rateLimitResponse = {
  ok: false,
  message: 'Too many requests. Please try again shortly.',
};
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse,
});
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse,
});

app.use('/api/products', productsRouter);
app.use('/api/orders', writeLimiter, ordersRouter);
app.use('/api/inquiries', writeLimiter, inquiriesRouter);
app.use('/api/payments', paymentLimiter, paymentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
