import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Booking from './models/Booking.js';
import Contact from './models/Contact.js';
import Newsletter from './models/Newsletter.js';

dotenv.config();

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

    // 3. Test Newsletter submission
    const newsletter = await Newsletter.create({
      email: `testsubscriber_${Date.now()}@example.com`
    });
    console.log('✅ 3. Newsletter Form Saved:', newsletter.email);

    console.log('🎉 ALL FORMS TESTED & SAVED SUCCESSFULLY TO MONGODB ATLAS!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Form test failed:', error.message);
    process.exit(1);
  }
};

testForms();
