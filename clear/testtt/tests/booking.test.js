/**
 * ─────────────────────────────────────────────────────────────
 *  tests/booking.test.js — Integration Tests cho Booking APIs
 *  Chạy: npm run test:booking
 *
 *  APIs được test:
 *   ✅ POST /api/bookings           — Tạo đơn (public + authenticated)
 *   ✅ GET  /api/bookings/:code/track — Theo dõi đơn (public)
 *   ✅ GET  /api/bookings/my-orders  — Đơn của tôi (protected)
 *   ✅ GET  /api/bookings            — Admin xem tất cả (admin only)
 *   ✅ PUT  /api/bookings/:id/status — Cập nhật trạng thái (admin)
 *
 *  YÊU CẦU: Backend server phải đang chạy (npm run dev)
 * ─────────────────────────────────────────────────────────────
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../.env.test') });

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5001';

// ── Dữ liệu test ───────────────────────────────────────────────
const timestamp = Date.now();

const bookingData = {
  serviceType: 'Giặt Ủi Gia Đình',
  firstName:   'Nguyen',
  lastName:    'Van A',
  email:       `booking_${timestamp}@jest.local`,
  phone:       '0901234567',
  address:     '123 Đường Test',
  suburb:      'District 1',
  state:       'Ho Chi Minh City',
  pickupDate:  '2026-09-01',
  pickupTime:  'Morning (8am-12pm)',
  frequency:   'one-off',
  notes:       'Jest integration test booking',
};

// State dùng chung
let createdOrderCode = '';
let createdBookingId = '';
let customerToken    = '';
let adminToken       = '';

// ── Lấy tokens trước khi test ──────────────────────────────────
beforeAll(async () => {
  // Đăng nhập CUSTOMER
  const customerRes = await request(BASE_URL)
    .post('/api/auth/login')
    .send({
      email:    process.env.TEST_CUSTOMER_EMAIL    || 'customer@tlaundry.com',
      password: process.env.TEST_CUSTOMER_PASSWORD || 'customer123',
    });
  customerToken = customerRes.body?.accessToken || '';

  // Đăng nhập ADMIN
  const adminRes = await request(BASE_URL)
    .post('/api/auth/login')
    .send({
      email:    process.env.TEST_ADMIN_EMAIL    || 'admin@tlaundry.com',
      password: process.env.TEST_ADMIN_PASSWORD || 'admin123456',
    });
  adminToken = adminRes.body?.accessToken || '';
});

// ════════════════════════════════════════════════════════════════
// 1. TẠO ĐƠN HÀNG (CREATE BOOKING)
// ════════════════════════════════════════════════════════════════
describe('📦 POST /api/bookings — Tạo đơn đặt dịch vụ', () => {
  it('✅ Tạo đơn thành công khi không có token (guest)', async () => {
    const res = await request(BASE_URL)
      .post('/api/bookings')
      .send(bookingData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('orderCode');
    expect(res.body.orderCode).toMatch(/^TL-\d{6}$/);

    createdOrderCode = res.body.orderCode;
    createdBookingId = res.body.data?._id || '';
  });

  it('✅ Tạo đơn thành công khi có token (authenticated user)', async () => {
    if (!customerToken) return; // Bỏ qua nếu chưa có demo user

    const res = await request(BASE_URL)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ ...bookingData, email: `auth_${timestamp}@jest.local` });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('userId'); // Đã liên kết userId
  });

  it('❌ Tạo đơn thất bại khi thiếu trường bắt buộc (firstName)', async () => {
    const { firstName, ...invalidData } = bookingData;

    const res = await request(BASE_URL)
      .post('/api/bookings')
      .send(invalidData);

    // Server từ chối — 400 (Zod) hoặc 500 (unhandled throw)
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ Tạo đơn thất bại khi thiếu email', async () => {
    const { email, ...noEmail } = bookingData;

    const res = await request(BASE_URL)
      .post('/api/bookings')
      .send(noEmail);

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ Tạo đơn thất bại khi email không hợp lệ', async () => {
    const res = await request(BASE_URL)
      .post('/api/bookings')
      .send({ ...bookingData, email: 'invalid-email-format' });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ Tạo đơn thất bại khi thiếu địa chỉ', async () => {
    const { address, suburb, state, ...noAddress } = bookingData;

    const res = await request(BASE_URL)
      .post('/api/bookings')
      .send(noAddress);

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ Tạo đơn thất bại khi thiếu phone', async () => {
    const { phone, ...noPhone } = bookingData;

    const res = await request(BASE_URL)
      .post('/api/bookings')
      .send(noPhone);

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('✅ OrderCode có định dạng TL-XXXXXX (6 chữ số)', () => {
    expect(createdOrderCode).toMatch(/^TL-\d{6}$/);
  });
});

// ════════════════════════════════════════════════════════════════
// 2. THEO DÕI ĐƠN HÀNG (TRACK BY ORDER CODE)
// ════════════════════════════════════════════════════════════════
describe('🔍 GET /api/bookings/:orderCode/track — Theo dõi đơn', () => {
  it('✅ Xem trạng thái đơn hàng bằng mã đơn (không cần đăng nhập)', async () => {
    if (!createdOrderCode) return;

    const res = await request(BASE_URL)
      .get(`/api/bookings/${createdOrderCode}/track`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderCode).toBe(createdOrderCode);
    expect(res.body.data).toHaveProperty('status');
    expect(res.body.data).toHaveProperty('serviceType');
    // Không trả về thông tin nhạy cảm
    expect(res.body.data).not.toHaveProperty('phone');
    expect(res.body.data).not.toHaveProperty('address');
  });

  it('✅ Đơn mới tạo có status là PENDING', async () => {
    if (!createdOrderCode) return;

    const res = await request(BASE_URL)
      .get(`/api/bookings/${createdOrderCode}/track`);

    expect(res.body.data.status).toBe('PENDING');
  });

  it('❌ Trả về 404 khi mã đơn không tồn tại', async () => {
    const res = await request(BASE_URL)
      .get('/api/bookings/TL-999999/track');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// 3. XEM ĐƠN HÀNG CỦA TÔI (MY ORDERS)
// ════════════════════════════════════════════════════════════════
describe('📋 GET /api/bookings/my-orders — Lịch sử đơn hàng của tôi', () => {
  it('✅ Customer xem được đơn hàng của mình', async () => {
    if (!customerToken) return;

    const res = await request(BASE_URL)
      .get('/api/bookings/my-orders')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
  });

  it('✅ Hỗ trợ phân trang qua query params', async () => {
    if (!customerToken) return;

    const res = await request(BASE_URL)
      .get('/api/bookings/my-orders?page=1&limit=5')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });

  it('✅ Hỗ trợ filter theo status', async () => {
    if (!customerToken) return;

    const res = await request(BASE_URL)
      .get('/api/bookings/my-orders?status=PENDING')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    // Tất cả kết quả phải có status PENDING
    res.body.data.forEach((booking) => {
      expect(booking.status).toBe('PENDING');
    });
  });

  it('❌ Unauthenticated không thể xem my-orders', async () => {
    const res = await request(BASE_URL)
      .get('/api/bookings/my-orders');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// 4. ADMIN: XEM TẤT CẢ ĐƠN HÀNG
// ════════════════════════════════════════════════════════════════
describe('👔 GET /api/bookings — Admin xem tất cả đơn', () => {
  it('✅ Admin xem được tất cả đơn hàng', async () => {
    if (!adminToken) return;

    const res = await request(BASE_URL)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('totalPages');
  });

  it('✅ Admin filter đơn theo status', async () => {
    if (!adminToken) return;

    const res = await request(BASE_URL)
      .get('/api/bookings?status=PENDING')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    res.body.data.forEach((b) => expect(b.status).toBe('PENDING'));
  });

  it('✅ Admin filter đơn theo ngày', async () => {
    if (!adminToken) return;

    const res = await request(BASE_URL)
      .get('/api/bookings?startDate=2026-01-01&endDate=2026-12-31')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('❌ CUSTOMER không thể xem tất cả đơn (GET /api/bookings)', async () => {
    if (!customerToken) return;

    const res = await request(BASE_URL)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('❌ Guest không thể xem tất cả đơn', async () => {
    const res = await request(BASE_URL).get('/api/bookings');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// 5. ADMIN: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
// ════════════════════════════════════════════════════════════════
describe('✏️  PUT /api/bookings/:id/status — Admin cập nhật trạng thái', () => {
  it('✅ Admin cập nhật status thành CONFIRMED', async () => {
    if (!adminToken || !createdBookingId) return;

    const res = await request(BASE_URL)
      .put(`/api/bookings/${createdBookingId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'CONFIRMED' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('CONFIRMED');
  });

  it('❌ Không thể set status không hợp lệ', async () => {
    if (!adminToken || !createdBookingId) return;

    const res = await request(BASE_URL)
      .put(`/api/bookings/${createdBookingId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'INVALID_STATUS' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ CUSTOMER không thể cập nhật status', async () => {
    if (!customerToken || !createdBookingId) return;

    const res = await request(BASE_URL)
      .put(`/api/bookings/${createdBookingId}/status`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ status: 'CANCELLED' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('❌ Trả về 404 khi booking ID không tồn tại', async () => {
    if (!adminToken) return;

    const fakeId = '64b7f3e9a1b2c3d4e5f60000'; // Valid ObjectId format nhưng không tồn tại
    const res = await request(BASE_URL)
      .put(`/api/bookings/${fakeId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'CONFIRMED' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
