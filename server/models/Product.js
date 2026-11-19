import mongoose from 'mongoose';

const { Schema } = mongoose;

// Storefront payloads use the catalogue `id`/`slug`, never Mongo internals.
const jsonOptions = {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
};

const optionSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    modifier: { type: Number, default: 0 },
  },
  { _id: false },
);

const imageSchema = new Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    category: { type: String, required: true, trim: true },
    categories: { type: [String], default: [] },
    artStyle: { type: String, default: '' },
    tags: { type: [String], default: [] },
    artist: { type: String, default: 'Mithila Studio (sample)' },
    technique: { type: String, default: '' },
    materials: { type: String, default: '' },
    base: { type: String, default: '' },
    description: { type: String, default: '' },
    symbolism: { type: String, default: '' },
    inspiration: { type: String, default: '' },
    dimensions: { type: [optionSchema], default: [] },
    framing: { type: [optionSchema], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    availability: {
      type: String,
      enum: ['in_stock', 'made_to_order', 'out_of_stock'],
      default: 'in_stock',
    },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    images: { type: [imageSchema], default: [] },
    care: { type: String, default: '' },
    // Set by the seed script so the API preserves the storefront's display order.
    sortIndex: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
    // Disable Mongoose's built-in `id` virtual so our catalogue `id` field wins.
    id: false,
    versionKey: false,
    toJSON: jsonOptions,
    toObject: jsonOptions,
  },
);

export const Product = mongoose.model('Product', productSchema);
export default Product;
