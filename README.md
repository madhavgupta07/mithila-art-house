# Mithila Art House

A premium, multi-page React storefront for a **sample catalogue of Mithila / Madhubani-inspired artwork**. It is designed as a curated online gallery: warm paper textures, Mithila-inspired borders and motifs, editorial context, and a complete shopping flow.

> **This is a sample project.** The product visuals are original SVG illustrations made for this repo. They are not photographs of hand-painted works, not historically authentic pieces, and not attributed to named artists. Prices, stock, artist profiles, policies, shipping estimates and payment records are sample data. No live payment gateway is connected and no money is taken; Razorpay test mode is available only when test keys are configured.

---

## Quick start

Requires Node.js 18+.

```bash
npm install
npm start
```

`npm start` is the common command. It starts the frontend-only storefront by default, and automatically starts Vite **and** the Express API when MongoDB is configured and reachable. Vite opens at `http://localhost:5173`.

To preview the decision without starting anything:

```bash
node scripts/start.js --check
```

```bash
npm run build      # production build in dist/
npm run preview    # preview the production build
npm run art:generate  # optional: regenerate the original SVG artwork (Python 3)
```

For the full MERN stack, see [MERN backend](#mern-backend) below. In short:

```bash
cp server/.env.example server/.env   # add your MongoDB URI and an admin key
npm run server:seed                  # push the 16 sample products to MongoDB
npm start                            # React (:5173) + Express (:4000) together
```

Copy `.env.example` to `.env.local` if you want to configure contact details, WhatsApp, coupons or shipping estimates. All values are optional; the storefront works without them.

`npm start` injects `VITE_API_URL=/api` into Vite automatically when it detects a reachable MongoDB, so inquiries and orders are actually posted to the API. A plain `npm run dev` stays frontend-only and makes no `/api` requests; if you run `npm run dev` and `npm run server` in separate terminals, add `VITE_API_URL=/api` to `.env.local` yourself.

---

## What is included

### Pages and routes

| Route | Purpose |
| --- | --- |
| `/` | Editorial home page with featured works, collections, heritage section and carousel |
| `/shop` | Catalogue with search, category/style/price/availability filters and sorting |
| `/product/:slug` | Product detail page with gallery, zoom, options, motif notes and related works |
| `/about` | Gallery story and honest explanation of the storefront |
| `/artists` | Clearly labelled placeholder artist profiles |
| `/custom` | Sample custom-artwork inquiry form |
| `/contact` | Sample contact form plus configurable contact details |
| `/cart` | Full cart with quantities, coupon field and order summary |
| `/wishlist` | Locally saved artworks |
| `/checkout` | Complete form flow with placeholder payment choices — no payment taken |
| `/order-success` | Local sample confirmation screen |
| `/search?q=` | Search results by name, motif, style, category or subject |
| `/faq` | Frequently asked questions with FAQ structured data |
| `/policies/shipping`, `/policies/returns`, `/policies/privacy`, `/policies/terms` | Transparent template policies |
| `/image-credits` | Attribution for editorial photographs and a note on original SVG art |
| `/admin` | Key-protected dashboard for products, orders and inquiries (sample gate) |
| `*` | Styled 404 page |

### Shopping behaviour

- 16 distinct sample artworks with prices, original prices, categories, styles, tags, sizes, framing, stock, flags and motif notes.
- Cart, wishlist and recently viewed state persisted in `localStorage` with Zustand `persist`.
- Filters and sort state reflected in the URL so results can be shared or bookmarked.
- Coupon field with a built-in **WELCOME10** preview code; override with `VITE_COUPONS`.
- Quantity controls, size/framing modifiers, subtotal, discount, shipping estimate and total.
- Checkout validates details with React Hook Form, creates a local order reference, clears the cart and shows a confirmation screen.
- **No card, UPI, bank or other financial details are collected.** Payment choices are UI placeholders unless Razorpay test keys are configured.

---

## MERN backend

An Express + Mongoose API lives in `server/`. The storefront still works without it: `ProductsContext` falls back to the bundled catalogue, checkout creates a browser-only order, and forms stay on screen. When the API is reachable the same UI transparently uses MongoDB instead.

### Setup

1. Start MongoDB. Use a local MongoDB Community Server instance with
   `mongodb://127.0.0.1:27017/mithila-art-house`, or create a free **MongoDB Atlas**
   cluster and get a connection string.
2. Copy the server environment template and fill in the values:

   ```bash
   cp server/.env.example server/.env
   ```

   | Variable | Purpose |
   | --- | --- |
   | `PORT` | API port, default `4000` |
   | `MONGODB_URI` | Local or Atlas connection string (required) |
   | `CLIENT_ORIGIN` | Allowed browser origin, default `http://localhost:5173` |
   | `ADMIN_API_KEY` | Shared secret for admin endpoints (required for `/admin`) |
   | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | **Test-mode** keys; payments stay no-payment without them |
   | `RAZORPAY_WEBHOOK_SECRET` | Verifies Razorpay webhook payloads |
   | `SHIPPING_FEE`, `FREE_SHIPPING_ABOVE` | Server-side shipping estimate |
   | `COUPONS` | JSON array of server-side coupon objects |

3. Seed the catalogue (idempotent):

   ```bash
   npm run server:seed
   ```

4. Start everything:

   ```bash
   npm start
   ```

   It detects the configured MongoDB, launches both apps, and injects `VITE_API_URL=/api` into Vite so form submissions reach the API. You can also run them in separate terminals with `npm run dev` and `npm run server` — in that case add `VITE_API_URL=/api` to `.env.local` yourself. Vite proxies `/api` to `http://localhost:4000`, so no browser CORS setup is needed in development.

### API

| Method | Path | Access |
| --- | --- | --- |
| `GET` | `/api/health` | public |
| `GET` | `/api/products` (`category`, `q`, `sort`, `available=true`) | public |
| `GET` | `/api/products/:slug` | public |
| `POST` / `PUT` / `DELETE` | `/api/products` | `x-admin-key` |
| `POST` | `/api/orders` | public — recalculates totals from MongoDB prices |
| `GET` | `/api/orders/:id` | public (random reference) |
| `GET` | `/api/orders` | `x-admin-key` |
| `POST` | `/api/inquiries` | public — contact and custom briefs |
| `GET` | `/api/inquiries` | `x-admin-key` |
| `POST` | `/api/payments/create` | public — creates a Razorpay test order |
| `POST` | `/api/payments/verify` | public — verifies HMAC signature before marking paid |
| `POST` | `/api/payments/webhook` | Razorpay signature |

Orders and inquiries are stored in MongoDB. Admin endpoints use a single `ADMIN_API_KEY` header as a **placeholder**, not real user accounts or JWT auth. Replace it before exposing the site publicly.

### Razorpay payment flow (test mode only)

1. Set **test** `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` on the server and the *same test* `VITE_RAZORPAY_KEY_ID` in the web app's `.env.local`.
2. Checkout creates a local order (`awaiting_payment`), then asks the server to create a Razorpay order for the **server-computed** amount in paise.
3. The Razorpay Checkout script opens. Card details are entered in Razorpay's hosted form; this project never receives or stores them.
4. On return, the browser sends the payment identifiers to `/api/payments/verify`. The server verifies the HMAC signature with `crypto.timingSafeEqual`, cross-checks the captured payment and amount, and only then marks the order `paid`.
5. A signed webhook handles `payment.captured` and `payment.failed` as a second channel.

**No live keys, real refunds, stock reduction, or confirmation emails are implemented.** Never put a live secret key in a `VITE_` variable — those values are public in the browser bundle.

### Is this a good stack to begin with?

Yes, with one caveat: MERN is a mainstream, well-documented learning stack, and Razorpay's hosted checkout is safer than building a card form yourself because PCI scope stays with Razorpay. But doing MongoDB + admin + orders + payments at once is a lot. A sensible order is: (1) seed and browse products, (2) place sample orders and read inquiries in `/admin`, (3) add Razorpay test keys last. Do not treat a client-side success screen as proof of payment — the server-verification step above is the important habit.

---

## Architecture

```text
src/
├── App.jsx                 # Lazy-loaded routes
├── main.jsx                # Router, HelmetProvider, products provider, toast provider
├── components/
│   ├── Cart/               # Cart drawer, cart line items, order summary
│   ├── Common/             # Buttons, SEO, modal, image wrapper, headings, forms
│   ├── Filters/            # Shop filter panel
│   ├── Forms/              # Reusable React Hook Form fields
│   ├── Layout/             # Announcement, navbar, footer, layout, scroll restore
│   ├── ProductCard/        # Product card and quick-view modal
│   └── ProductGallery/     # Zoom + thumbnail gallery
├── config/site.js          # Central store configuration from environment variables
├── context/
│   ├── store.js            # Zustand stores and derived selectors
│   └── ProductsContext.jsx # API-backed catalogue with local fallback
├── data/                   # Products, collections, artists, FAQs, image credits
├── hooks/                  # Debounce, body-scroll lock, Escape key
├── lib/
│   ├── api.js              # Fetch wrapper + Razorpay checkout helper
│   ├── filters.js          # Catalogue filtering and sorting
│   └── utils.js            # Formatting and small utilities
└── pages/                  # Route-level components (including Admin)
```

server/
├── index.js, app.js        # Server bootstrap and Express configuration
├── config.js, db.js        # Environment parsing and MongoDB connection
├── middleware/             # Admin key and error handlers
├── models/                 # Product, Order and Inquiry schemas
├── routes/                 # products, orders, inquiries, payments
└── scripts/seed.js         # Idempotent sample-catalogue seed
```

### Key dependencies

React 18, Vite 5, Tailwind CSS 3, React Router 6, Framer Motion, React Icons, Swiper, React Hook Form, React Hot Toast, React Helmet Async, Zustand, `clsx` and `tailwind-merge`.

Backend: Node.js, Express 4, Mongoose 8, Razorpay, Helmet, CORS and express-rate-limit.

---

## Configuration

All store-specific values live in `src/config/site.js` and come from `.env.local`.

| Variable | Used for |
| --- | --- |
| `VITE_SITE_URL` | Canonical URLs, Open Graph URLs, structured data, sitemap domain |
| `VITE_CONTACT_EMAIL` | Contact page email link |
| `VITE_CONTACT_PHONE` | Contact page phone link |
| `VITE_WHATSAPP_NUMBER` | WhatsApp links on product, custom and contact pages; digits only after sanitising |
| `VITE_BUSINESS_ADDRESS` | Contact page address |
| `VITE_INSTAGRAM_URL` | Footer and contact page social link |
| `VITE_SHIPPING_FEE` | Sample flat shipping estimate |
| `VITE_FREE_SHIPPING_ABOVE` | Sample free-shipping threshold |
| `VITE_COUPONS` | JSON array of sample coupon objects |

Example coupon object:

```json
{ "code": "WELCOME10", "type": "percent", "value": 10, "minSubtotal": 0 }
```

`type` can be `percent` or `flat`. Coupons are evaluated in the browser only.

No contact details, WhatsApp number or business address are invented by the storefront. If a variable is empty, the relevant UI says it is not configured.

---

## Imagery and licensing

### Product artwork

`public/images/art/` contains 51 original SVG files generated by `scripts/generate_art.py`: three views (full, detail and framed) for each of the 16 artworks, plus three abstract portrait placeholders. They are original illustrations, openly regenerable, and are labelled as sample artwork throughout the UI.

To regenerate:

```bash
python scripts/generate_art.py
```

The generator uses only the Python standard library.

### Editorial photographs

`public/images/heritage/` contains ten openly licensed documentary photographs from Wikimedia Commons, used only in About, Home, Artists and Contact editorial sections. Full attribution — title, author, licence and source — is available on `/image-credits` and in `src/data/imageCredits.json`.

`scripts/fetch_commons.py` and `scripts/prepare_heritage.py` document how candidate images were discovered and converted to WebP. `scripts/.tmp-commons/` is ignored by Git and is not needed at runtime. Do not add Commons photos as product imagery unless you have visually verified them and confirmed the licence terms.

---

## Vercel deployment

The GitHub repo is connected to Vercel, so pushes to `main` build and deploy automatically. `vercel.json` builds Vite into `dist/` and routes `/api/*` to the catch-all serverless function in `api/[...path].js`, which runs the existing Express app and keeps a cached MongoDB connection.

Set these Vercel project environment variables:

- `MONGODB_URI` — a cloud MongoDB URI. A local `mongodb://127.0.0.1` address will not work from Vercel.
- `ADMIN_API_KEY` — shared key for `/admin` and the admin API routes.
- `COUPONS` — optional JSON array; set here to the WELCOME10 preview code.
- `CLIENT_ORIGIN` — the deployed origin, for example `https://mithila-art-house.vercel.app`.
- Optional Razorpay **test** keys: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` and `VITE_RAZORPAY_KEY_ID`.

`VITE_API_URL=/api` is supplied by `vercel.json` at build time, so the built storefront calls the same-origin API. Payments remain test-mode only and are verified on the server.

---

## Before launching a real store

1. Replace product SVGs with authorised photographs of actual artworks, each with verified provenance and artist consent.
2. Replace artist placeholders with real, approved profiles. Do not invent credentials, awards or years of experience.
3. Replace policy templates with terms reviewed for your business and jurisdiction.
4. Connect forms to a backend or form service.
5. Replace test Razorpay keys with live ones, keep signature/webhook verification, reduce stock and send real confirmations. Never rely on a client-side “success” screen as proof of payment, and replace the single admin API key with real authentication.
6. Replace shipping estimates with real rates and publish accurate delivery terms.
7. Add a verified review system; do not seed fake testimonials.
8. Set `VITE_SITE_URL`, update `public/sitemap.xml` and `public/robots.txt`, and add SPA rewrite rules on your host so deep links such as `/shop` resolve to `index.html`.
9. Re-check image licences and attribution before publishing.

---

## Accessibility and performance notes

- Semantic landmarks, skip link, labelled form fields, visible focus states and `aria-*` attributes on dialogs and controls.
- `prefers-reduced-motion` support in CSS and Framer Motion components.
- Lazy-loaded routes, lazy images with intrinsic dimensions, manual chunks for React/Motion/Swiper, and memoised product cards.
- Per-page titles, descriptions, canonical URLs, Open Graph/Twitter tags and structured data via React Helmet Async.
- Responsive layouts from mobile through large desktop.

---

## Disclaimer

This is a front-end portfolio/sample build with an optional MERN backend. It does not sell art, take live payments, verify authenticity, or represent any real artist or business. Without the API configured, inquiries and orders stay in the browser; with it configured they are stored in MongoDB as sample records, and no email is sent. Replace the placeholder data and connect real services before using it commercially.
