import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

import connectDB from '../backend/config/db.js';
import Booking from '../backend/models/Booking.js';
import Contact from '../backend/models/Contact.js';
import GiftCard from '../backend/models/GiftCard.js';
import Newsletter from '../backend/models/Newsletter.js';

const testForms = async () => {
  try {
    await connectDB();

    console.log('🧪 Testing form submissions to MongoDB Atlas...');

    // 1. Test Booking submission
    const booking = await Booking.create({
      orderCode: 'TL-' + Math.floor(100000 + Math.random() * 900000),
      serviceType: 'Dịch Vụ Là/Ủi Quần Áo',
      firstName: 'Lê Văn',
      lastName: 'Hùng',
      email: 'hung.le@example.com',
      phone: '0901234567',
      address: '456 Lê Lợi, Phường Bến Thành',
      suburb: 'Quận 1',
      state: 'VIC',
      pickupDate: '2026-08-05',
      pickupTime: 'Chiều (12pm-5pm)',
      frequency: 'weekly',
      notes: 'Test đặt dịch vụ tự động từ form'
    });
    console.log('✅ 1. Booking Form Saved:', booking.orderCode);

    // 2. Test Contact submission
    const contact = await Contact.create({
      name: 'Phạm Minh Anh',
      email: 'minhanh@example.com',
      phone: '0977889900',
      subject: 'Hỏi về giá',
      message: 'Test gửi liên hệ từ form giao diện'
    });
    console.log('✅ 2. Contact Form Saved:', contact._id);

    // 3. Test Gift Card submission
    const giftCard = await GiftCard.create({
      code: 'TL-' + Math.floor(100000 + Math.random() * 900000),
      amount: 100,
      recipientName: 'Đặng Ngọc Mai',
      recipientEmail: 'mai.dang@example.com',
      senderName: 'Lê Văn Hùng',
      senderEmail: 'hung.le@example.com',
      message: 'Chúc mừng sinh nhật bạn nhé!',
      deliveryDate: '2026-08-10'
    });
    console.log('✅ 3. Gift Card Form Saved:', giftCard.code);

    // 4. Test Newsletter submission
    const newsletter = await Newsletter.create({
      email: `testsubscriber_${Date.now()}@example.com`
    });
    console.log('✅ 4. Newsletter Form Saved:', newsletter.email);

    console.log('🎉 ALL FORMS TESTED & SAVED SUCCESSFULLY TO MONGODB ATLAS!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Form test failed:', error.message);
    process.exit(1);
  }
};

testForms();
