import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import jwt from 'jsonwebtoken';

import connectDB from './config/db.js';
import Contact from './models/Contact.js';
import Booking from './models/Booking.js';
import GiftCard from './models/GiftCard.js';
import Newsletter from './models/Newsletter.js';
import User from './models/User.js';
import Service from './models/Service.js';
import Pricing from './models/Pricing.js';
import {
  protect,
  authorize,
  selfOrAdmin,
  generateAccessToken,
  generateRefreshToken
} from './middleware/auth.js';
import {
  validate,
  registerSchema,
  loginSchema,
  changePasswordSchema,
  bookingSchema,
  contactSchema,
  giftCardSchema,
  newsletterSchema,
  adminCreateUserSchema,
} from './middleware/validate.js';
import errorHandler from './middleware/errorHandler.js';
import { seedServicesAndPricing, seedDemoUsers } from './seedData.js';
import {
  sendBookingConfirmation,   // Luồng duy nhất: To=khách, BCC=admin, Gift Card tùy chọn
  sendGiftCardToRecipient    // Gửi gift card độc lập (không kèm booking)
} from './services/emailService.js';


dotenv.config();

// 1. Kết nối MongoDB Atlas & Tự động Seed Dữ Liệu
connectDB().then(async () => {
  await seedServicesAndPricing();
  await seedDemoUsers();
});


const app = express();
const PORT = process.env.PORT || 5001;

// 2. Bảo mật HTTP Headers (Helmet)
app.use(helmet());

// 3. Chống tấn công NoSQL Injection
app.use(mongoSanitize());

// 4. Cấu hình CORS an toàn (Hỗ trợ nhiều tên miền Vercel & Localhost)
const clientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : [];

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  ...clientUrls
];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      (typeof origin === 'string' && origin.endsWith('.vercel.app'))
    ) {
      callback(null, true);
    } else {
      callback(new Error('Tên miền không được cấp quyền bởi CORS policy!'));
    }
  },
  credentials: true
}));

// 5. Giới hạn số lượng Request (Rate Limiting - Bỏ qua localhost trong môi trường dev)
const isDev = process.env.NODE_ENV !== 'production';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  skip: (req) => isDev || req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1',
  message: { success: false, message: 'Quá nhiều yêu cầu từ IP này. Vui lòng thử lại sau 15 phút!' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => isDev || req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1',
  message: { success: false, message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút!' }
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: "Welcome to TLaundry Secured Backend API Server 🚀" });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: "TLaundry Backend API Server Running & Secured" });
});


// ═══════════════════════════════════════════════════════════════════════════════
// AUTH APIS - Đăng ký / Đăng nhập / Refresh Token / Đăng xuất / Profile
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới (Khách hàng)
 * Public - Không cần token
 */
app.post('/api/auth/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    // req.body đã được validate & sanitize bởi Zod (registerSchema)
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email này đã được sử dụng!' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'CUSTOMER' // Đăng ký public chỉ tạo CUSTOMER
    });

    // Cấp phát cả Access Token & Refresh Token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Lưu refresh token vào DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Đăng nhập (Khách hàng & Admin)
 * Public - Không cần token
 */
app.post('/api/auth/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    // req.body đã được validate & sanitize bởi Zod (loginSchema)
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác!' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Tài khoản đã bị khoá! Vui lòng liên hệ Admin.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Cập nhật refresh token trong DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/refresh-token
 * Làm mới Access Token bằng Refresh Token
 * Public - Dùng refreshToken từ body
 */
app.post('/api/auth/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token không được cung cấp!' });
    }

    // Xác minh refresh token
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh'
      );
    } catch {
      return res.status(401).json({ success: false, message: 'Refresh token không hợp lệ hoặc đã hết hạn!' });
    }

    // Tìm user và kiểm tra refresh token có khớp với DB không (token rotation)
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token đã bị thu hồi hoặc không hợp lệ!' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Tài khoản đã bị khoá!' });
    }

    // Cấp phát Access Token mới + Rotate Refresh Token
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Làm mới token thành công!',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Đăng xuất - Xoá refresh token khỏi DB
 * Protected - Cần Access Token
 */
app.post('/api/auth/logout', protect, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.json({ success: true, message: 'Đăng xuất thành công!' });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Lấy thông tin profile của người dùng đang đăng nhập
 * Protected - Cần Access Token
 */
app.get('/api/auth/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/auth/me
 * Cập nhật thông tin profile cá nhân
 * Protected - Cần Access Token
 */
app.put('/api/auth/me', protect, async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    res.json({ success: true, message: 'Cập nhật thông tin thành công!', data: user });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/auth/change-password
 * Đổi mật khẩu
 * Protected - Cần Access Token
 */
app.put('/api/auth/change-password', protect, validate(changePasswordSchema), async (req, res, next) => {
  try {
    // req.body đã được validate bởi Zod (changePasswordSchema)
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác!' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    next(error);
  }
});


// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN AUTH - Tạo tài khoản Admin/Staff (Chỉ Admin mới làm được)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/admin/users
 * Admin tạo tài khoản Staff/Admin mới
 * Protected - ADMIN only
 */
app.post('/api/admin/users', protect, authorize('ADMIN'), validate(adminCreateUserSchema), async (req, res, next) => {
  try {
    // req.body đã được validate bởi Zod (adminCreateUserSchema)
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email này đã được sử dụng!' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role
    });

    res.status(201).json({
      success: true,
      message: `Tạo tài khoản ${role} thành công!`,
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/users
 * Lấy danh sách tất cả users
 * Protected - ADMIN, STAFF
 */
app.get('/api/admin/users', protect, authorize('ADMIN', 'STAFF'), async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/users/:id/toggle-active
 * Khoá / Mở khoá tài khoản người dùng
 * Protected - ADMIN only
 */
app.put('/api/admin/users/:id/toggle-active', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: `Tài khoản đã được ${user.isActive ? 'mở khoá' : 'khoá'} thành công!`,
      data: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive }
    });
  } catch (error) {
    next(error);
  }
});


// ═══════════════════════════════════════════════════════════════════════════════
// BOOKING APIS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/bookings
 * Tạo đơn đặt dịch vụ mới
 * Public - Không cần đăng nhập (hoặc tự động liên kết nếu có token)
 */
app.post('/api/bookings', validate(bookingSchema), async (req, res, next) => {
  try {
    // req.body đã được validate & sanitize bởi Zod (bookingSchema)
    const { serviceType } = req.body;

    // Tự động liên kết với user nếu có JWT trong header
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.isActive) userId = user._id;
      } catch {
        // Bỏ qua nếu token không hợp lệ - vẫn cho đặt đơn
      }
    }

    const randomOrderCode = 'TL-' + Math.floor(100000 + Math.random() * 900000);

    const newBooking = await Booking.create({
      ...req.body,
      orderCode: randomOrderCode,
      serviceType: serviceType || 'Giặt Ủi Gia Đình',
      userId // sẽ là null nếu khách chưa đăng nhập
    });

    console.log(`✅ New Booking Saved: OrderCode [${newBooking.orderCode}] UserID [${userId || 'guest'}]`);

    // 📧 1 email duy nhất: To=khách xác nhận đơn, BCC=admin tự động — fire-and-forget
    sendBookingConfirmation(newBooking, null)
      .catch(err => console.error('❌ [Email] Unexpected error in booking email:', err.message));

    res.status(201).json({
      success: true,
      message: 'Đặt lịch thành công! Mã đơn hàng của bạn là: ' + newBooking.orderCode,
      orderCode: newBooking.orderCode,
      data: newBooking
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/my-orders
 * Khách hàng xem lịch sử đơn hàng của chính mình
 * Protected - CUSTOMER (chỉ đơn của mình), ADMIN/STAFF (tất cả đơn theo email)
 */
app.get('/api/bookings/my-orders', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let filter = {};

    if (req.user.role === 'CUSTOMER') {
      // Tìm theo userId HOẶC email để bao gồm đơn đặt lúc chưa đăng nhập
      filter = {
        $or: [
          { userId: req.user._id },
          { email: req.user.email }
        ]
      };
    }

    if (status) filter.status = status;

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/:orderCode/track
 * Theo dõi trạng thái đơn giặt theo mã đơn
 * Public - Có thể xem bằng mã đơn (không cần đăng nhập)
 */
app.get('/api/bookings/:orderCode/track', async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ orderCode: req.params.orderCode });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng với mã này!' });
    }

    // Ẩn thông tin nhạy cảm khi không có auth
    const { _id, orderCode, serviceType, status, pickupDate, createdAt, firstName, lastName } = booking;
    res.json({
      success: true,
      data: { _id, orderCode, serviceType, status, pickupDate, createdAt, firstName, lastName }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings
 * Admin/Staff xem tất cả đơn hàng (có filter, phân trang)
 * Protected - ADMIN, STAFF only
 */
app.get('/api/bookings', protect, authorize('ADMIN', 'STAFF'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate + 'T23:59:59');
    }

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/bookings/:id/status
 * Cập nhật trạng thái đơn hàng
 * Protected - ADMIN, STAFF only
 */
app.put('/api/bookings/:id/status', protect, authorize('ADMIN', 'STAFF'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'PICKED_UP', 'WASHING', 'DELIVERING', 'COMPLETED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ!' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });

    res.json({ success: true, message: 'Cập nhật trạng thái thành công!', data: booking });
  } catch (error) {
    next(error);
  }
});


// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT APIS
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/contact', validate(contactSchema), async (req, res, next) => {
  try {
    // req.body đã được validate & sanitize bởi Zod (contactSchema)
    const newContact = await Contact.create(req.body);

    console.log('✅ New Contact Saved to MongoDB:', newContact._id);
    res.status(201).json({ success: true, message: 'Tin nhắn liên hệ đã được gửi thành công!', data: newContact });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/contact
 * Lấy danh sách tin nhắn liên hệ (có phân trang, lọc theo trạng thái)
 * Protected - ADMIN, STAFF only
 */
app.get('/api/contact', protect, authorize('ADMIN', 'STAFF'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: contacts.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: contacts
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/contact/:id/resolve
 * Đánh dấu tin nhắn liên hệ là đã xử lý
 * Protected - ADMIN, STAFF only
 */
app.patch('/api/contact/:id/resolve', protect, authorize('ADMIN', 'STAFF'), async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'PROCESSED' },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin nhắn liên hệ!' });
    }

    res.json({
      success: true,
      message: 'Đã đánh dấu tin nhắn là đã xử lý!',
      data: contact
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/contact/:id/unresolve
 * Đánh dấu lại tin nhắn liên hệ là chưa xử lý
 * Protected - ADMIN, STAFF only
 */
app.patch('/api/contact/:id/unresolve', protect, authorize('ADMIN', 'STAFF'), async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'PENDING' },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin nhắn liên hệ!' });
    }

    res.json({
      success: true,
      message: 'Đã đánh dấu tin nhắn là chưa xử lý!',
      data: contact
    });
  } catch (error) {
    next(error);
  }
});


// ═══════════════════════════════════════════════════════════════════════════════
// GIFT CARD APIS
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/gift-cards', validate(giftCardSchema), async (req, res, next) => {
  try {
    // req.body đã được validate & sanitize bởi Zod (giftCardSchema)
    const randomCode = 'TL-' + Math.floor(100000 + Math.random() * 900000);
    const newCard = await GiftCard.create({
      ...req.body,
      code: randomCode,
    });

    console.log('✅ New GiftCard Saved to MongoDB:', newCard.code);

    // 📧 Gửi email gift card bất đồng bộ (fire-and-forget) — không block API response
    sendGiftCardToRecipient(newCard)
      .catch(err => console.error('❌ [Email] Unexpected error in gift card email:', err.message));

    res.status(201).json({
      success: true,
      message: 'Đặt mua thẻ quà tặng thành công! Mã thẻ của bạn là: ' + newCard.code,
      code: newCard.code,
      data: newCard
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD & THỐNG KÊ
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/dashboard
 * Thống kê tổng quan: đơn hàng hôm nay/tháng này, doanh thu, thẻ quà tặng, liên hệ chưa xử lý
 * Protected - ADMIN, STAFF only
 */
app.get('/api/admin/dashboard', protect, authorize('ADMIN', 'STAFF'), async (req, res) => {
  try {
    const now = new Date();

    // Ngày hôm nay (từ 00:00:00 đến 23:59:59)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // Tháng này (từ ngày 1 đến cuối tháng)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // --- Thống kê Đơn hàng ---
    const [
      totalOrdersToday,
      totalOrdersThisMonth,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      ordersByStatus
    ] = await Promise.all([
      Booking.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
      Booking.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'PENDING' }),
      Booking.countDocuments({ status: 'COMPLETED' }),
      Booking.countDocuments({ status: 'CANCELLED' }),
      Booking.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    // --- Thống kê Doanh thu (tổng mệnh giá Gift Card đã bán) ---
    const [
      totalGiftCardsSold,
      giftCardsSoldToday,
      giftCardsSoldThisMonth,
      revenueToday,
      revenueThisMonth,
      revenueTotal
    ] = await Promise.all([
      GiftCard.countDocuments(),
      GiftCard.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
      GiftCard.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      GiftCard.aggregate([
        { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      GiftCard.aggregate([
        { $match: { createdAt: { $gte: monthStart, $lte: monthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      GiftCard.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    // --- Thống kê Liên hệ ---
    const [totalContacts, pendingContacts, processedContacts] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'PENDING' }),
      Contact.countDocuments({ status: 'PROCESSED' })
    ]);

    // --- Thống kê Người dùng ---
    const [totalUsers, totalCustomers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'CUSTOMER' })
    ]);

    // --- 5 đơn hàng mới nhất ---
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderCode firstName lastName serviceType status createdAt');

    // --- 5 liên hệ chưa xử lý mới nhất ---
    const recentPendingContacts = await Contact.find({ status: 'PENDING' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject createdAt');

    res.json({
      success: true,
      data: {
        orders: {
          today: totalOrdersToday,
          thisMonth: totalOrdersThisMonth,
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
          byStatus: ordersByStatus
        },
        giftCards: {
          totalSold: totalGiftCardsSold,
          soldToday: giftCardsSoldToday,
          soldThisMonth: giftCardsSoldThisMonth
        },
        revenue: {
          today: revenueToday[0]?.total || 0,
          thisMonth: revenueThisMonth[0]?.total || 0,
          total: revenueTotal[0]?.total || 0
        },
        contacts: {
          total: totalContacts,
          pending: pendingContacts,
          processed: processedContacts
        },
        users: {
          total: totalUsers,
          customers: totalCustomers
        },
        recentBookings,
        recentPendingContacts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


app.get('/api/gift-cards', protect, authorize('ADMIN', 'STAFF'), async (req, res) => {
  try {
    const cards = await GiftCard.find().sort({ createdAt: -1 });
    res.json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ═══════════════════════════════════════════════════════════════════════════════
// NEWSLETTER APIS
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/newsletter', validate(newsletterSchema), async (req, res, next) => {
  try {
    // req.body đã được validate & sanitize bởi Zod (newsletterSchema)
    const { email } = req.body;

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email này đã đăng ký nhận tin từ trước!' });
    }

    const subscriber = await Newsletter.create({ email });
    console.log('✅ New Newsletter Subscriber:', subscriber.email);
    res.status(201).json({ success: true, message: 'Đăng ký nhận thông tin khuyến mãi thành công!' });
  } catch (error) {
    next(error);
  }
});


// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES & PRICING DYNAMIC APIS
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/pricing', async (req, res) => {
  try {
    const pricing = await Pricing.findOne().sort({ updatedAt: -1 });
    if (!pricing) {
      return res.status(404).json({ success: false, message: 'Chưa có dữ liệu bảng giá' });
    }
    res.json({ success: true, data: pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ═══════════════════════════════════════════════════════════════════════════════
// 404 Handler — Route không tồn tại
// ═══════════════════════════════════════════════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route [${req.method}] ${req.originalUrl} không tồn tại!` });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL ERROR HANDLER (Centralized — phải đặt SAU tất cả routes)
// ═══════════════════════════════════════════════════════════════════════════════
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 TLaundry Backend API running at http://localhost:${PORT}`);
  console.log(`🔐 Auth endpoints: /api/auth/register | /api/auth/login | /api/auth/refresh-token`);
  console.log(`🛡️  RBAC: CUSTOMER(my-orders) | ADMIN/STAFF(all endpoints)`);
  console.log(`🔒 Security: Helmet + CORS + Rate Limit + Mongo Sanitize + Zod Validation`);
});
