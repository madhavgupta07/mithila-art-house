import express from 'express';
import Product from '../models/Product.js';
import requireAdmin from '../middleware/admin.js';

const router = express.Router();

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Ignore Mongo/audit fields so a client cannot overwrite them on write.
const cleanBody = (body = {}) => {
  const { _id, __v, createdAt, updatedAt, ...rest } = body;
  return rest;
};

const sortOptions = {
  featured: { featured: -1, sortIndex: 1, id: 1 },
  popularity: { bestseller: -1, featured: -1, sortIndex: 1 },
  newest: { newArrival: -1, sortIndex: 1 },
  'price-asc': { price: 1, sortIndex: 1 },
  'price-desc': { price: -1, sortIndex: 1 },
};

router.get('/', async (req, res, next) => {
  try {
    const { category, q, sort, available } = req.query;
    const clauses = [];

    if (category) {
      clauses.push({ $or: [{ category: String(category) }, { categories: String(category) }] });
    }
    if (available === 'true') {
      clauses.push({ availability: 'in_stock', stock: { $gt: 0 } });
    }
    if (q) {
      const pattern = new RegExp(escapeRegex(String(q)), 'i');
      clauses.push({
        $or: [
          { name: pattern },
          { subtitle: pattern },
          { artStyle: pattern },
          { tags: pattern },
          { description: pattern },
        ],
      });
    }

    const filter = clauses.length ? { $and: clauses } : {};
    const sortSpec = sortOptions[sort] || { sortIndex: 1, id: 1 };
    const products = await Product.find(filter).sort(sortSpec);

    res.json({ ok: true, products });
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ ok: false, message: 'Product not found.' });
    }
    return res.json({ ok: true, product });
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.create(cleanBody(req.body));
    return res.status(201).json({ ok: true, product });
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: cleanBody(req.body) },
      { new: true, runValidators: true },
    );
    if (!product) {
      return res.status(404).json({ ok: false, message: 'Product not found.' });
    }
    return res.json({ ok: true, product });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ ok: false, message: 'Product not found.' });
    }
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
