import mongoose from 'mongoose';

const giftCardSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  amount: { type: Number, required: true },
  recipientName: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  message: { type: String },
  deliveryDate: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'USED', 'EXPIRED'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
});

const GiftCard = mongoose.model('GiftCard', giftCardSchema);

export default GiftCard;
