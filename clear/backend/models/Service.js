import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  serviceId: { type: String, unique: true, required: true },
  nameVi: { type: String, required: true },
  nameEn: { type: String, required: true },
  descVi: { type: String, required: true },
  descEn: { type: String, required: true },
  img: { type: String, required: true },
  featuresVi: [{ type: String }],
  featuresEn: [{ type: String }],
  iconType: { type: String, default: 'laundry' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
