import mongoose from 'mongoose';

const pricingPlanSchema = new mongoose.Schema({
  planId: { type: String, unique: true, required: true },
  nameVi: { type: String, required: true },
  nameEn: { type: String, required: true },
  noteVi: { type: String, required: true },
  noteEn: { type: String, required: true },
  featured: { type: Boolean, default: false },
  featuresVi: [{ type: String }],
  featuresEn: [{ type: String }],
  iconType: { type: String, default: 'domestic' },
  order: { type: Number, default: 0 }
});

const additionalItemSchema = new mongoose.Schema({
  itemId: { type: String, unique: true, required: true },
  nameVi: { type: String, required: true },
  nameEn: { type: String, required: true },
  priceVi: { type: String, required: true },
  priceEn: { type: String, required: true },
  order: { type: Number, default: 0 }
});

const pricingSchema = new mongoose.Schema({
  plans: [pricingPlanSchema],
  additionalItems: [additionalItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

const Pricing = mongoose.model('Pricing', pricingSchema);

export default Pricing;
