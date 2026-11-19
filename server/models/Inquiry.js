import mongoose from 'mongoose';

const { Schema } = mongoose;

const jsonOptions = {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
};

const inquirySchema = new Schema(
  {
    type: { type: String, required: true, enum: ['contact', 'custom'] },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true, minlength: 10 },
    // Optional custom-commission details.
    theme: { type: String, default: '' },
    style: { type: String, default: '' },
    size: { type: String, default: '' },
    budget: { type: String, default: '' },
    palette: { type: String, default: '' },
    timeline: { type: String, default: '' },
    consent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    id: false,
    versionKey: false,
    toJSON: jsonOptions,
    toObject: jsonOptions,
  },
);

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
