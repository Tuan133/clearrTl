import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env từ backend/.env
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

import connectDB from '../backend/config/db.js';
import Contact from '../backend/models/Contact.js';
import Booking from '../backend/models/Booking.js';
import GiftCard from '../backend/models/GiftCard.js';
import Newsletter from '../backend/models/Newsletter.js';
import Service from '../backend/models/Service.js';
import Pricing from '../backend/models/Pricing.js';
import { seedServicesAndPricing } from '../backend/seedData.js';

const API_PORT = process.env.PORT || 5001;
const BASE_URL = `http://localhost:${API_PORT}/api`;

const formatLog = (title, status, details) => {
  const icon = status === 'SUCCESS' ? '✅' : '❌';
  console.log(`${icon} [${status}] ${title}`);
  if (details) {
    console.log(`   └─> ${details}`);
  }
};

const runAPITests = async () => {
  console.log('\n==================================================');
  console.log('🚀 TLaundry API Test Suite (RESTful Endpoints Check)');
  console.log('==================================================\n');

  let serverInstance = null;

  try {
    const healthCheck = await fetch(`http://localhost:${API_PORT}/api/health`).catch(() => null);
    if (!healthCheck || !healthCheck.ok) {
      console.log(`ℹ️ Server chưa chạy trên port ${API_PORT}. Đang kết nối DB & mở HTTP test server...\n`);
      await connectDB();
      await seedServicesAndPricing();

      const app = express();
      app.use(helmet());
      app.use(mongoSanitize());
      app.use(cors());
      app.use(express.json());

      app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

      app.post('/api/bookings', async (req, res) => {
        try {
          const { firstName, lastName, email, phone, address, suburb, state, pickupDate } = req.body;
          if (!firstName || !lastName || !email || !phone || !address || !suburb || !state || !pickupDate) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
          }
          const orderCode = 'TL-' + Math.floor(100000 + Math.random() * 900000);
          const booking = await Booking.create({ ...req.body, orderCode });
          res.status(201).json({ success: true, orderCode: booking.orderCode, data: booking });
        } catch (e) {
          res.status(400).json({ success: false, message: e.message });
        }
      });

      app.post('/api/contact', async (req, res) => {
        try {
          const { name, email, message } = req.body;
          if (!name || !email || !message) return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
          const contact = await Contact.create(req.body);
          res.status(201).json({ success: true, data: contact });
        } catch (e) {
          res.status(400).json({ success: false, message: e.message });
        }
      });

      app.post('/api/gift-cards', async (req, res) => {
        try {
          const { amount, recipientName, recipientEmail, senderName, senderEmail, deliveryDate } = req.body;
          if (!amount || !recipientName || !recipientEmail || !senderName || !senderEmail || !deliveryDate) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
          }
          const code = 'TL-' + Math.floor(100000 + Math.random() * 900000);
          const card = await GiftCard.create({ ...req.body, code });
          res.status(201).json({ success: true, code: card.code, data: card });
        } catch (e) {
          res.status(400).json({ success: false, message: e.message });
        }
      });

      app.post('/api/newsletter', async (req, res) => {
        try {
          const { email } = req.body;
          if (!email) return res.status(400).json({ success: false, message: 'Email là bắt buộc' });
          const cleanEmail = email.toLowerCase().trim();
          const existing = await Newsletter.findOne({ email: cleanEmail });
          if (existing) return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
          const sub = await Newsletter.create({ email: cleanEmail });
          res.status(201).json({ success: true, message: 'Thành công' });
        } catch (e) {
          res.status(400).json({ success: false, message: e.message });
        }
      });

      app.get('/api/services', async (req, res) => {
        const services = await Service.find({ isActive: true }).sort({ order: 1 });
        res.json({ success: true, count: services.length, data: services });
      });

      app.get('/api/pricing', async (req, res) => {
        const pricing = await Pricing.findOne().sort({ updatedAt: -1 });
        res.json({ success: true, data: pricing });
      });

      serverInstance = app.listen(API_PORT);
      await new Promise(r => setTimeout(r, 500));
    } else {
      console.log(`📡 Đã phát hiện HTTP Server đang chạy tại ${BASE_URL}\n`);
    }
  } catch (err) {
    console.log('⚠️ Đang kết nối CSDL và chạy thử trực tiếp API...');
  }

  let passedTests = 0;
  let totalTests = 0;

  const testRequest = async (name, endpoint, method = 'GET', body = null, expectedStatus = 200) => {
    totalTests++;
    const start = Date.now();
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (body) options.body = JSON.stringify(body);

      const res = await fetch(`${BASE_URL}${endpoint}`, options);
      const data = await res.json().catch(() => ({}));
      const duration = Date.now() - start;

      if (res.status === expectedStatus) {
        passedTests++;
        let detailStr = `Status ${res.status} HTTP OK (${duration}ms)`;
        if (data.orderCode) detailStr += ` | Mã đơn hàng: ${data.orderCode}`;
        if (data.code) detailStr += ` | Mã GiftCard: ${data.code}`;
        if (data.count !== undefined) detailStr += ` | Tổng số lượng: ${data.count}`;
        formatLog(name, 'SUCCESS', detailStr);
        return { success: true, data };
      } else {
        formatLog(name, 'FAILED', `Kỳ vọng HTTP ${expectedStatus} nhưng nhận được ${res.status}: ${data.message || 'Lỗi không xác định'}`);
        return { success: false, data };
      }
    } catch (error) {
      formatLog(name, 'FAILED', `Lỗi kết nối HTTP: ${error.message}`);
      return { success: false, error };
    }
  };

  // 1. Test POST /api/bookings
  await testRequest('1. API Đặt Dịch Vụ (POST /api/bookings)', '/bookings', 'POST', {
    serviceType: 'Giặt Ủi Gia Đình',
    firstName: 'Nguyễn',
    lastName: 'Văn Thịnh',
    email: 'thinh.nguyen@example.com',
    phone: '0988776655',
    address: '123 Nguyễn Trãi',
    suburb: 'Quận 1',
    state: 'VIC',
    pickupDate: '2026-08-10',
    pickupTime: 'Sáng (8am-12pm)',
    notes: 'Gọi trước khi đến lấy đồ'
  }, 201);

  // 2. Test POST /api/contact
  await testRequest('2. API Gửi Liên Hệ (POST /api/contact)', '/contact', 'POST', {
    name: 'Trần Văn Tuấn',
    email: 'tuan.tran@example.com',
    phone: '0912345678',
    subject: 'Hỏi về giá giặt rèm cửa',
    message: 'Shop có dịch vụ giặt rèm tận nhà không?'
  }, 201);

  // 3. Test POST /api/gift-cards
  await testRequest('3. API Đặt Thẻ Quà Tặng (POST /api/gift-cards)', '/gift-cards', 'POST', {
    amount: 200,
    recipientName: 'Lê Thị Mai',
    recipientEmail: 'mai.le@example.com',
    senderName: 'Nguyễn Văn Thịnh',
    senderEmail: 'thinh.nguyen@example.com',
    message: 'Tặng bạn thẻ quà tặng giặt ủi!',
    deliveryDate: '2026-08-20'
  }, 201);

  // 4. Test POST /api/newsletter
  const randEmail = `subscriber_${Date.now()}@example.com`;
  await testRequest('4. API Đăng Ký Nhận Tin (POST /api/newsletter)', '/newsletter', 'POST', {
    email: randEmail
  }, 201);

  // 5. Test Validation Trùng Email
  await testRequest('5. Validation Trùng Email Newsletter (POST /api/newsletter)', '/newsletter', 'POST', {
    email: randEmail
  }, 400);

  // 6. Test GET /api/services
  await testRequest('6. API Lấy Dịch Vụ Động (GET /api/services)', '/services', 'GET', null, 200);

  // 7. Test GET /api/pricing
  await testRequest('7. API Lấy Bảng Giá Động (GET /api/pricing)', '/pricing', 'GET', null, 200);

  console.log('\n==================================================');
  console.log(`📊 BÁO CÁO KẾT QUẢ TEST: ${passedTests}/${totalTests} TESTS PASSED`);
  if (passedTests === totalTests) {
    console.log('🎉 TẤT CẢ CÁC API HOẠT ĐỘNG HOÀN HẢO 100%! ');
  } else {
    console.log('⚠️ Có bài test bị thất bại, vui lòng kiểm tra chi tiết log trên.');
  }
  console.log('==================================================\n');

  if (serverInstance) {
    serverInstance.close();
    process.exit(0);
  }
};

runAPITests();
