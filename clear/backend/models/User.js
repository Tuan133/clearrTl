import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, default: '' },
  password: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'STAFF', 'ADMIN'], default: 'CUSTOMER' },
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Pre-save hook: Hash password before saving to MongoDB
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
