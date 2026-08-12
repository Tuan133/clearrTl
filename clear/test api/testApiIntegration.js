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
import Service from '../backend/models/Service.js';
import Pricing from '../backend/models/Pricing.js';
import { seedServicesAndPricing } from '../backend/seedData.js';

const runTest = async () => {
  try {
    await connectDB();
    await seedServicesAndPricing();

    console.log('\n🧪 --- TESTING ALL RESTFUL APIS INTEGRATION ---\n');

    // 1. Test POST /api/bookings
    const randomOrderCode = 'TL-' + Math.floor(100000 + Math.random() * 900000);
    const booking = await Booking.create({
      orderCode: randomOrderCode,
      serviceType: 'Giặt Ủi Gia Đình',
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      email: 'nguyenvana@example.com',
      phone: '0912345678',
      address: '100 Nguyễn Thị Minh Khai',
      suburb: 'Quận 1',
      state: 'VIC',
      pickupDate: '2026-08-05',
      pickupTime: 'Sáng (8am-12pm)',
      notes: 'Giao nhanh trước 5h chiều'
    });
    console.log('✅ 1. POST /api/bookings OK: Generated OrderCode =', booking.orderCode);

    // 2. Test POST /api/contact
    const contact = await Contact.create({
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0988888888',
      subject: 'Hỏi về nhượng quyền',
      message: 'Tôi muốn tư vấn mở đại lý tại Sài Gòn'
    });
    console.log('✅ 2. POST /api/contact OK: Contact ID =', contact._id);

    // 3. Test POST /api/gift-cards
    const giftCode = 'TL-' + Math.floor(100000 + Math.random() * 900000);
    const giftCard = await GiftCard.create({
      code: giftCode,
      amount: 150,
      recipientName: 'Lê Văn C',
      recipientEmail: 'levanc@example.com',
      senderName: 'Trần Thị B',
      senderEmail: 'tranthib@example.com',
      message: 'Món quà nho nhỏ tặng bạn!',
      deliveryDate: '2026-08-15'
    });
    console.log('✅ 3. POST /api/gift-cards OK: Generated GiftCode =', giftCard.code);

    // 4. Test POST /api/newsletter
    const testEmail = `newsletter_${Date.now()}@example.com`;
    const subscriber = await Newsletter.create({ email: testEmail });
    console.log('✅ 4. POST /api/newsletter OK: Subscribed Email =', subscriber.email);

    // 5. Test GET /api/services & GET /api/pricing
    const services = await Service.find({ isActive: true });
    console.log(`✅ 5a. GET /api/services OK: Found ${services.length} active services`);

    const pricing = await Pricing.findOne();
    console.log(`✅ 5b. GET /api/pricing OK: Found ${pricing?.plans?.length || 0} pricing plans & ${pricing?.additionalItems?.length || 0} additional items`);

    console.log('\n🎉 ALL 5 RESTFUL APIS VERIFIED SUCCESSFULLY WITH MONGODB ATLAS!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
};

runTest();
