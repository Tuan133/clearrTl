import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

import connectDB from '../backend/config/db.js';
import User from '../backend/models/User.js';

const testSecurity = async () => {
  try {
    await connectDB();

    // Create an Admin User if not exists
    let admin = await User.findOne({ email: 'admin@tlaundry.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Quản Trị Viên High-Security',
        email: 'admin@tlaundry.com',
        password: 'AdminPassword@2026',
        role: 'ADMIN'
      });
      console.log('✅ Created Admin User with Bcrypt Hashed Password!');
    }

    // Verify Password match
    const isMatch = await admin.matchPassword('AdminPassword@2026');
    console.log('🔒 Password Bcrypt Verification Match:', isMatch);

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('🔑 JWT Token Generated Successfully for Admin:', token.substring(0, 30) + '...');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during security test:', error.message);
    process.exit(1);
  }
};

testSecurity();
