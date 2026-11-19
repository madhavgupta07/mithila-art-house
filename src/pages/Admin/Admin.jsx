import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaLock, FaArrowRight, FaTrash, FaPen, FaPlus, FaRotateRight, FaDatabase } from 'react-icons/fa6';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import Button from '../../components/Common/Button';
import { adminFetch } from '../../lib/api';
import { categories } from '../../data/collections';
import { formatPrice } from '../../lib/utils';
import { useProducts } from '../../context/ProductsContext';

const STORAGE_KEY = 'mithila-admin-key';

const defaultOptions = [
  { label: '30 × 40 cm', modifier: 0 },
  { label: '45 × 60 cm', modifier: 4500 },
  { label: '60 × 80 cm', modifier: 9000 },
];
const defaultFraming = [
  { label: 'Unframed', modifier: 0 },
  { label: 'Rolled with protective border', modifier: 600 },
  { label: 'Framed — natural wood', modifier: 3200 },
];

const emptyProduct = {
  slug: '',
  name: '',
  subtitle: '',
  price: 0,
  originalPrice: null,
  category: 'home-decor',
  categoriesText: 'home-decor',
  artStyle: 'Traditional Madhubani',
  tagsText: '',
  stock: 6,
  availability: 'in_stock',
  featured: false,
  bestseller: false,
  newArrival: false,
  description: '',
  symbolism: '',
  inspiration: '',
  dimensionsText: JSON.stringify(defaultOptions, null, 2),
  framingText: JSON.stringify(defaultFraming, null, 2),
  imagesText: JSON.stringify(
    [{ src: '/images/art/art-cosmic-lotus.svg', alt: 'Sample artwork', label: 'Full artwork' }],
    null,
    2,
  ),
};

const toForm = (product) => ({
  ...product,
  categoriesText: (product.categories || []).join(', '),
  tagsText: (product.tags || []).join(', '),
  dimensionsText: JSON.stringify(product.dimensions || [], null, 2),
  framingText: JSON.stringify(product.framing || [], null, 2),
  imagesText: JSON.stringify(product.images || [], null, 2),
});

const splitList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const parseArray = (value, label) => {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error('not an array');
    return parsed;
  } catch {
    throw new Error(`${label} must be a valid JSON array.`);
  }
};

const makeId = () => `MAH-${Date.now().toString(36).toUpperCase()}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [keyInput, setKeyInput] = useState('');
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { refresh } = useProducts();

  const request = useCallback(
    (path, options) => adminFetch(path, adminKey, options),
    [adminKey],
  );

  const load = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      if (tab === 'products') {
        const data = await adminFetch('/products', adminKey);
        setProducts(data.products || []);
      } else if (tab === 'orders') {
        const data = await request('/orders');
        setOrders(data.orders || []);
      } else {
        const data = await request('/inquiries');
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      setError(err.message || 'Could not reach the API. Is the server running?');
    } finally {
      setBusy(false);
    }
  }, [adminKey, request, tab]);

  useEffect(() => {
    if (adminKey) load();
  }, [adminKey, load]);

  const signIn = (event) => {
    event.preventDefault();
    const value = keyInput.trim();
    if (!value) return;
    setAdminKey(value);
    try {
      sessionStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Session storage is optional.
    }
    setKeyInput('');
  };

  const signOut = () => {
    setAdminKey('');
    setProducts([]);
    setOrders([]);
    setInquiries([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Session storage is optional.
    }
  };

  const startNew = () => {
    setEditing('new');
    setForm(emptyProduct);
    setError('');
  };

  const startEdit = (product) => {
    setEditing(product.id);
    setForm(toForm(product));
    setError('');
  };

  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const saveProduct = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = {
        ...form,
        id: form.id || makeId(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        stock: Number(form.stock),
        categories: splitList(form.categoriesText),
        tags: splitList(form.tagsText),
        dimensions: parseArray(form.dimensionsText, 'Size options'),
        framing: parseArray(form.framingText, 'Framing options'),
        images: parseArray(form.imagesText, 'Images'),
      };
      delete payload.categoriesText;
      delete payload.tagsText;
      delete payload.dimensionsText;
      delete payload.framingText;
      delete payload.imagesText;

      if (editing === 'new') {
        await request('/products', { method: 'POST', body: JSON.stringify(payload) });
        toast.success('Product created.');
      } else {
        await request(`/products/${editing}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast.success('Product updated.');
      }
      setEditing(null);
      await load();
      await refresh();
    } catch (err) {
      setError(err.message || 'Could not save the product.');
      toast.error(err.message || 'Could not save the product.');
    } finally {
      setBusy(false);
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await request(`/products/${product.id}`, { method: 'DELETE' });
      toast.success('Product deleted.');
      await load();
      await refresh();
    } catch (err) {
      toast.error(err.message || 'Could not delete the product.');
    } finally {
      setBusy(false);
    }
  };

  if (!adminKey) {
    return (
      <>
        <Seo title="Admin" description="Private catalogue administration for the Mithila Art House sample." canonical="/admin" />
        <PageHeader
          eyebrow="Store management"
          title="Admin access."
          description="This area is protected by a single server-side API key — a deliberate placeholder, not real user authentication."
          breadcrumbs={[{ label: 'Admin' }]}
        />
        <Container className="py-16">
          <form onSubmit={signIn} className="mx-auto max-w-md border border-ink/12 bg-paper/30 p-8">
            <FaLock aria-hidden="true" className="text-2xl text-vermilion" />
            <label htmlFor="admin-key" className="mt-6 block font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">
              Admin API key
            </label>
            <input
              id="admin-key"
              type="password"
              value={keyInput}
              onChange={(event) => setKeyInput(event.target.value)}
              className="mt-2 w-full border border-ink/25 bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-vermilion"
              placeholder="Value of ADMIN_API_KEY"
              autoComplete="off"
            />
            <div className="mt-6">
              <Button type="submit" size="lg" full>Unlock dashboard</Button>
            </div>
            <p className="mt-5 text-[11px] leading-5 text-charcoal/55">
              The key is kept in session storage only for this browser tab. Replace this gate with real authentication before any public launch.
            </p>
            <div className="mt-6">
              <Link to="/" className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/55 hover:text-vermilion">
                Back to the gallery <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </form>
        </Container>
      </>
    );
  }

  return (
    <>
      <Seo title="Admin Dashboard" description="Manage sample products, orders and inquiries for the MERN sample." canonical="/admin" />
      <PageHeader
        eyebrow="Store management"
        title="Dashboard."
        description="Manage the MongoDB-backed catalogue and review sample orders and inquiries."
        breadcrumbs={[{ label: 'Admin' }]}
      />

      <Container className="py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/12 pb-5">
          <div className="flex flex-wrap gap-2">
            {[
              ['products', 'Products'],
              ['orders', 'Orders'],
              ['inquiries', 'Inquiries'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={`border px-4 py-2 font-sans text-[10px] uppercase tracking-wide2 transition-colors ${
                  tab === value
                    ? 'border-indigoDeep bg-indigoDeep text-ivory'
                    : 'border-ink/20 text-charcoal/60 hover:border-vermilion hover:text-vermilion'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={load} className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/55 hover:text-vermilion">
              <FaRotateRight aria-hidden="true" /> Refresh
            </button>
            <button type="button" onClick={signOut} className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/55 hover:text-vermilion">
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 border border-vermilion/30 bg-vermilion/5 p-4 text-[12px] text-vermilion" role="alert">
            {error}
          </div>
        )}

        {tab === 'products' && (
          <div className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-sans text-[11px] uppercase tracking-wide2 text-charcoal/55">
                {products.length} products in MongoDB
              </p>
              <Button size="sm" onClick={startNew}><FaPlus aria-hidden="true" /> Add product</Button>
            </div>

            {editing && (
              <form onSubmit={saveProduct} className="mt-8 border border-ink/12 bg-paper/30 p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-3xl text-ink">
                    {editing === 'new' ? 'New artwork' : `Edit ${form.name}`}
                  </h2>
                  <button type="button" onClick={() => setEditing(null)} className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/55 hover:text-vermilion">
                    Close
                  </button>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ['slug', 'Slug (URL)', true],
                    ['name', 'Name', true],
                    ['subtitle', 'Subtitle', false],
                    ['price', 'Price (INR)', true],
                    ['originalPrice', 'Original price', false],
                    ['stock', 'Stock', false],
                  ].map(([name, label, required]) => (
                    <label key={name} className="block">
                      <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">{label}</span>
                      <input
                        value={form[name] ?? ''}
                        onChange={(event) => setField(name, event.target.value)}
                        required={required}
                        className="mt-2 w-full border border-ink/20 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-vermilion"
                      />
                    </label>
                  ))}

                  <label className="block">
                    <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">Primary category</span>
                    <select
                      value={form.category}
                      onChange={(event) => setField('category', event.target.value)}
                      className="mt-2 w-full border border-ink/20 bg-ivory px-3 py-2.5 text-sm outline-none focus:border-vermilion"
                    >
                      {categories.filter((item) => item.slug !== 'all-art' && item.slug !== 'custom').map((item) => (
                        <option key={item.slug} value={item.slug}>{item.name}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">Categories (comma separated)</span>
                    <input
                      value={form.categoriesText}
                      onChange={(event) => setField('categoriesText', event.target.value)}
                      className="mt-2 w-full border border-ink/20 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-vermilion"
                    />
                  </label>

                  <label className="block">
                    <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">Art style</span>
                    <input
                      value={form.artStyle || ''}
                      onChange={(event) => setField('artStyle', event.target.value)}
                      className="mt-2 w-full border border-ink/20 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-vermilion"
                    />
                  </label>

                  <label className="block">
                    <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">Tags (comma separated)</span>
                    <input
                      value={form.tagsText}
                      onChange={(event) => setField('tagsText', event.target.value)}
                      className="mt-2 w-full border border-ink/20 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-vermilion"
                    />
                  </label>

                  <label className="block">
                    <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">Availability</span>
                    <select
                      value={form.availability}
                      onChange={(event) => setField('availability', event.target.value)}
                      className="mt-2 w-full border border-ink/20 bg-ivory px-3 py-2.5 text-sm outline-none focus:border-vermilion"
                    >
                      <option value="in_stock">In stock</option>
                      <option value="made_to_order">Made to order</option>
                      <option value="out_of_stock">Out of stock</option>
                    </select>
                  </label>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {['description', 'symbolism', 'inspiration'].map((name) => (
                    <label key={name} className="block">
                      <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60 capitalize">{name}</span>
                      <textarea
                        rows={4}
                        value={form[name] || ''}
                        onChange={(event) => setField(name, event.target.value)}
                        className="mt-2 w-full border border-ink/20 bg-transparent px-3 py-2.5 text-sm leading-6 outline-none focus:border-vermilion"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-6">
                  {['featured', 'bestseller', 'newArrival'].map((flag) => (
                    <label key={flag} className="flex items-center gap-2 font-sans text-[11px] text-charcoal/70">
                      <input
                        type="checkbox"
                        checked={Boolean(form[flag])}
                        onChange={(event) => setField(flag, event.target.checked)}
                        className="h-4 w-4 accent-vermilion"
                      />
                      {flag}
                    </label>
                  ))}
                </div>

                <details className="mt-8 border-t border-ink/12 pt-6">
                  <summary className="cursor-pointer font-sans text-[10px] uppercase tracking-wide2 text-vermilion">
                    Advanced fields (JSON)
                  </summary>
                  <div className="mt-5 grid gap-5 lg:grid-cols-3">
                    {[
                      ['dimensionsText', 'Size options'],
                      ['framingText', 'Framing options'],
                      ['imagesText', 'Images'],
                    ].map(([name, label]) => (
                      <label key={name} className="block">
                        <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">{label}</span>
                        <textarea
                          rows={10}
                          spellCheck="false"
                          value={form[name]}
                          onChange={(event) => setField(name, event.target.value)}
                          className="mt-2 w-full border border-ink/20 bg-ivory px-3 py-2 font-mono text-[11px] leading-5 outline-none focus:border-vermilion"
                        />
                      </label>
                    ))}
                  </div>
                </details>

                <div className="mt-8">
                  <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save product'}</Button>
                </div>
              </form>
            )}

            <div className="mt-8 overflow-x-auto border border-ink/12">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-paper/60 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/55">
                  <tr>
                    <th className="p-4">Artwork</th>
                    <th className="p-4">ID / Slug</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 text-[13px]">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={product.images?.[0]?.src} alt="" className="h-12 w-10 border border-ink/10 object-cover" />
                          <span className="font-display text-lg text-ink">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-charcoal/60">{product.id}<br />{product.slug}</td>
                      <td className="p-4">{formatPrice(product.price)}</td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4">
                        <div className="flex gap-4">
                          <button type="button" onClick={() => startEdit(product)} className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60 hover:text-vermilion">
                            <FaPen aria-hidden="true" /> Edit
                          </button>
                          <button type="button" onClick={() => deleteProduct(product)} className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60 hover:text-vermilion">
                            <FaTrash aria-hidden="true" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && !busy && (
                    <tr><td colSpan={5} className="p-8 text-center text-charcoal/55">No products found. Seed the database or add one above.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="mt-10 overflow-x-auto border border-ink/12">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-paper/60 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/55">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 text-[13px]">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="p-4 font-mono text-[11px]">{order.id}</td>
                    <td className="p-4">{order.customer?.email}</td>
                    <td className="p-4">{formatPrice(order.totals?.total)}</td>
                    <td className="p-4">{order.paymentMethod || '—'}</td>
                    <td className="p-4">
                      <span className={order.status === 'paid' ? 'text-forest' : 'text-charcoal/65'}>{order.status}</span>
                    </td>
                    <td className="p-4 text-charcoal/55">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
                {orders.length === 0 && !busy && (
                  <tr><td colSpan={6} className="p-8 text-center text-charcoal/55">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'inquiries' && (
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {inquiries.map((item) => (
              <article key={item._id || item.id} className="border border-ink/12 bg-paper/30 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-sans text-[10px] uppercase tracking-wide2 text-vermilion">{item.type}</span>
                  <span className="text-[11px] text-charcoal/50">{formatDate(item.createdAt)}</span>
                </div>
                <h2 className="mt-3 font-display text-2xl text-ink">{item.subject || item.name || 'Inquiry'}</h2>
                <p className="mt-1 text-[12px] text-charcoal/60">{item.name} · {item.email}</p>
                <p className="mt-4 whitespace-pre-wrap text-[13px] leading-6 text-charcoal/75">{item.message}</p>
                {item.theme && (
                  <p className="mt-4 text-[11px] text-charcoal/55">
                    Theme: {item.theme} · Style: {item.style || '—'} · Size: {item.size || '—'}
                  </p>
                )}
              </article>
            ))}
            {inquiries.length === 0 && !busy && (
              <p className="p-8 text-center text-charcoal/55 lg:col-span-2">No inquiries yet.</p>
            )}
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-ink/12 pt-6 text-[11px] text-charcoal/55">
          <FaDatabase aria-hidden="true" />
          <span>Data is stored in the configured MongoDB database. This dashboard is a sample tool, not a hardened admin system.</span>
        </div>
      </Container>
    </>
  );
}
