# Mithila Art House API

Express + MongoDB (Mongoose) backend for the React storefront. Runs independently from the Vite app; no root files are modified.

## Setup

1. `cd server`
2. `cp .env.example .env` (PowerShell: `Copy-Item .env.example .env`)
3. Fill in `MONGODB_URI` and, if you need admin endpoints, `ADMIN_API_KEY`.
4. `npm install --no-audit --no-fund`
5. `npm run seed` to load the 16 sample products from `../src/data/products.js`.
6. `npm run dev` (nodemon) or `npm start` (plain node).

The API listens on `http://localhost:4000` by default and allows only `CLIENT_ORIGIN` through CORS.

### Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | HTTP port. |
| `MONGODB_URI` | — | MongoDB connection string (required). |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin(s); comma-separated for multiple. |
| `ADMIN_API_KEY` | — | Shared key required in `x-admin-key` for admin routes. If unset, admin routes return 503. |
| `RAZORPAY_KEY_ID` | — | Razorpay key id; required to create/verify payments. |
| `RAZORPAY_KEY_SECRET` | — | Razorpay key secret; used for signature HMAC and API calls. |
| `RAZORPAY_WEBHOOK_SECRET` | — | Secret used to verify the webhook signature. |
| `SHIPPING_FEE` | `99` | Flat shipping fee in INR. |
| `FREE_SHIPPING_ABOVE` | `4999` | Discounted subtotal at/above which shipping is free. |
| `COUPONS` | `[]` | JSON array of `{ code, type: "percent"\|"flat", value, minSubtotal }`. |

## Seed

`npm run seed` upserts every sample catalogue item by its `id` and stores its array position as `sortIndex`. It is idempotent: run it as often as you like.

## API

Base path: `/api`. All responses are JSON with an `ok` flag.

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | none | `{ ok, service, time }` |
| `GET` | `/products` | none | List products in `sortIndex` order. Query: `category`, `q`, `sort` (`featured`, `popularity`, `newest`, `price-asc`, `price-desc`), `available=true`. |
| `GET` | `/products/:slug` | none | Single product, or 404. |
| `POST` | `/products` | `x-admin-key` | Create a product. |
| `PUT` | `/products/:id` | `x-admin-key` | Update a product by catalogue `id`. |
| `DELETE` | `/products/:id` | `x-admin-key` | Delete a product by catalogue `id`. |
| `POST` | `/orders` | none | Create an order; all totals are recomputed server-side. |
| `GET` | `/orders/:id` | none | Look up an order by its generated `id`. |
| `GET` | `/orders` | `x-admin-key` | List orders, newest first. |
| `POST` | `/inquiries` | none | Store a contact or custom-art inquiry. |
| `GET` | `/inquiries` | `x-admin-key` | List inquiries, newest first. |
| `POST` | `/payments/create` | none | Create a Razorpay order for an `awaiting_payment` order (amount in paise). |
| `POST` | `/payments/verify` | none | Verify signature + captured payment, then mark the order `paid`. |
| `POST` | `/payments/webhook` | Razorpay signature | Handle `payment.captured` / `payment.failed`; raw body only. |

### Order calculation

Prices are always taken from MongoDB: `product.price` plus the exact-label dimension and framing modifiers. A submitted `unitPrice` is trusted **only** when the slug is not in the catalogue and `sampleOnly: true` is sent. Discounts use `COUPONS`; shipping is free when the discounted subtotal meets `FREE_SHIPPING_ABOVE`. An order is `awaiting_payment` only when `paymentMode: "razorpay"` and Razorpay keys exist; otherwise it is a `sample` order.

### Payment safety

No card numbers, CVV or UPI IDs are ever accepted or stored. Orders are marked `paid` only after a valid HMAC signature (and, when reachable, a captured Razorpay payment with a matching amount). The webhook verifies `x-razorpay-signature` over the raw request body.

### Admin auth

`x-admin-key: <ADMIN_API_KEY>` is a deliberate lightweight placeholder, not real authentication — there are no accounts or JWTs. It uses constant-time comparison and returns 401 for a missing/invalid key, 503 when unconfigured. Put a real auth layer in front of these routes before exposing the API publicly.
