import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  orderCode: { type: String, unique: true, required: true },
  serviceType: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  suburb: { type: String, default: '' },
  state: { type: String, default: '' },
  pickupDate: { type: String, default: '' },
  pickupTime: { type: String, default: '' },
  frequency: { type: String, default: 'one-off' },
  detergent: { type: String, default: 'Organic Sinh Học (Eco-Friendly)' },
  softener: { type: String, default: 'Hương Oải Hương (Lavender)' },
  deliverySpeed: { type: String, default: 'standard' }, // 'standard' | 'express'
  expressFee: { type: Number, default: 0 },
  notes: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null nếu guest
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PICKED_UP', 'WASHING', 'DELIVERING', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
}, { timestamps: true });


const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
