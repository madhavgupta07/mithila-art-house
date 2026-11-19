import mongoose from 'mongoose';

const { Schema } = mongoose;

const jsonOptions = {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
};

const itemSchema = new Schema(
  {
    slug: { type: String, default: '' },
    productId: { type: String, default: '' },
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    size: { type: String, default: '' },
    frame: { type: String, default: '' },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
);

const customerSchema = new Schema(
  {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postcode: { type: String, default: '' },
    country: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { _id: false },
);

const totalsSchema = new Schema(
  {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    items: { type: [itemSchema], default: [] },
    customer: { type: customerSchema, required: true },
    paymentMethod: { type: String, default: '' },
    paymentMode: { type: String, enum: ['sample', 'razorpay'], default: 'sample' },
    couponCode: { type: String, default: null },
    totals: { type: totalsSchema, required: true },
    status: {
      type: String,
      enum: ['sample', 'awaiting_payment', 'paid', 'payment_failed', 'cancelled'],
      default: 'sample',
      index: true,
    },
    // Never store card numbers, CVV or UPI IDs — only provider-side references.
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    paidAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    id: false,
    versionKey: false,
    toJSON: jsonOptions,
    toObject: jsonOptions,
  },
);

export const Order = mongoose.model('Order', orderSchema);
export default Order;
