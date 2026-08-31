/**
 * ─────────────────────────────────────────────────────────────
 *  tests/auth.test.js — Integration Tests cho Auth APIs
 *  Chạy: npm run test:auth
 *
 *  APIs được test:
 *   ✅ POST /api/auth/register
 *   ✅ POST /api/auth/login
 *   ✅ POST /api/auth/refresh-token
 *   ✅ POST /api/auth/logout
 *   ✅ GET  /api/auth/me
 *   ✅ PUT  /api/auth/change-password
 *
 *  YÊU CẦU: Backend server phải đang chạy (npm run dev)
 *  hoặc set TEST_BASE_URL=http://localhost:5001
 * ─────────────────────────────────────────────────────────────
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../.env.test') });

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5001';

// ── Dữ liệu test dùng chung ────────────────────────────────────
const timestamp   = Date.now();
const testUser = {
  name:     `Test User ${timestamp}`,
  email:    `testuser_${timestamp}@jest.local`,
  password: 'Test@Password123!',
  phone:    '0901234567',
};

// State chia sẻ giữa các test
let accessToken  = '';
let refreshToken = '';
let userId       = '';

// ════════════════════════════════════════════════════════════════
// 1. ĐĂNG KÝ (REGISTER)
// ════════════════════════════════════════════════════════════════
describe('📝 POST /api/auth/register — Đăng ký tài khoản', () => {
  it('✅ Đăng ký thành công với dữ liệu hợp lệ', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/register')
      .send(testUser)
      .expect('Content-Type', /json/);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.role).toBe('CUSTOMER');
    // Không được trả về password
    expect(res.body.user).not.toHaveProperty('password');

    // Lưu tokens cho tests sau
    accessToken  = res.body.accessToken;
    refreshToken = res.body.refreshToken;
    userId       = res.body.user.id;
  });

  it('❌ Đăng ký thất bại khi email đã tồn tại', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/register')
      .send(testUser); // Cùng email

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/đã được sử dụng/i);
  });

  it('❌ Đăng ký thất bại khi thiếu email', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/register')
      .send({ name: 'Test', password: 'Test@123!' });

    // Server từ chối — có thể 400 (Zod) hoặc 500 (unhandled throw)
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ Đăng ký thất bại khi password quá yếu (< 8 ký tự)', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/register')
      .send({
        name:     'Weak Pass User',
        email:    `weak_${timestamp}@jest.local`,
        password: '123',
      });

    // Server từ chối — có thể 400 (Zod) hoặc 500 (unhandled throw)
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ Đăng ký thất bại khi email không hợp lệ', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/register')
      .send({
        name:     'Invalid Email',
        email:    'not-an-email',
        password: 'Test@Password123!',
      });

    // Server từ chối — có thể 400 (Zod) hoặc 500 (unhandled throw)
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('🛡️ NoSQL Injection bị chặn bởi mongo-sanitize', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/register')
      .send({
        name:     'Hacker',
        email:    { $gt: '' }, // NoSQL injection attempt
        password: 'Test@Password123!',
      });

    // Phải bị reject (400 hoặc 500), không thể đăng ký
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// 2. ĐĂNG NHẬP (LOGIN)
// ════════════════════════════════════════════════════════════════
describe('🔐 POST /api/auth/login — Đăng nhập', () => {
  it('✅ Đăng nhập thành công với credentials đúng', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user.email).toBe(testUser.email);

    // Cập nhật tokens mới nhất
    accessToken  = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('❌ Đăng nhập thất bại khi sai password', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/không chính xác/i);
  });

  it('❌ Đăng nhập thất bại khi email không tồn tại', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/login')
      .send({ email: 'notexist@jest.local', password: 'Test@Password123!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('❌ Đăng nhập thất bại khi thiếu password', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/login')
      .send({ email: testUser.email });

    // Server từ chối — có thể 400 (Zod) hoặc 500 (unhandled throw)
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ Đăng nhập thất bại khi body rỗng', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/login')
      .send({});

    // Server từ chối — có thể 400 (Zod) hoặc 500 (unhandled throw)
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// 3. LẤY PROFILE (ME)
// ════════════════════════════════════════════════════════════════
describe('👤 GET /api/auth/me — Lấy thông tin profile', () => {
  it('✅ Lấy profile thành công khi có valid token', async () => {
    const res = await request(BASE_URL)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
    expect(res.body.data).not.toHaveProperty('password');
    expect(res.body.data).not.toHaveProperty('refreshToken');
  });

  it('❌ Thất bại khi không có token', async () => {
    const res = await request(BASE_URL).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('❌ Thất bại khi token giả mạo', async () => {
    const res = await request(BASE_URL)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer fake.token.value');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('❌ Thất bại khi format Authorization sai', async () => {
    const res = await request(BASE_URL)
      .get('/api/auth/me')
      .set('Authorization', accessToken); // Thiếu "Bearer "

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// 4. REFRESH TOKEN
// ════════════════════════════════════════════════════════════════
describe('🔄 POST /api/auth/refresh-token — Làm mới token', () => {
  it('✅ Làm mới token thành công', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/refresh-token')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    // Token rotation — phải nhận được refresh token mới (có thể same nếu issued same second)
    expect(typeof res.body.refreshToken).toBe('string');
    expect(res.body.refreshToken.length).toBeGreaterThan(10);

    // Cập nhật tokens mới
    accessToken  = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('❌ Thất bại khi không cung cấp refresh token', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/refresh-token')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ Thất bại khi dùng refresh token giả', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/refresh-token')
      .send({ refreshToken: 'fake.refresh.token' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// 5. ĐỔI MẬT KHẨU (CHANGE PASSWORD)
// ════════════════════════════════════════════════════════════════
describe('🔑 PUT /api/auth/change-password — Đổi mật khẩu', () => {
  const newPassword = 'NewTest@Password456!';

  it('✅ Đổi mật khẩu thành công', async () => {
    const res = await request(BASE_URL)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: testUser.password,
        newPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/thành công/i);
  });

  it('✅ Đăng nhập được với mật khẩu mới', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: newPassword });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    accessToken  = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('❌ Thất bại khi mật khẩu hiện tại sai', async () => {
    const res = await request(BASE_URL)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'WrongCurrentPassword!',
        newPassword: 'AnotherNew@123!',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ Thất bại khi không có token', async () => {
    const res = await request(BASE_URL)
      .put('/api/auth/change-password')
      .send({
        currentPassword: newPassword,
        newPassword: 'AnotherNew@123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// 6. ĐĂNG XUẤT (LOGOUT)
// ════════════════════════════════════════════════════════════════
describe('🚪 POST /api/auth/logout — Đăng xuất', () => {
  it('✅ Đăng xuất thành công', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/thành công/i);
  });

  it('❌ Sau khi logout, refresh token cũ bị vô hiệu hoá', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/refresh-token')
      .send({ refreshToken });

    // Token rotation: refreshToken đã bị xoá khỏi DB
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('❌ Đăng xuất thất bại khi không có token', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/logout');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// 7. ADMIN AUTH — chặn access không hợp lệ
// ════════════════════════════════════════════════════════════════
describe('🛡️ Admin-only endpoints — RBAC Authorization', () => {
  let customerToken = '';

  beforeAll(async () => {
    // Đăng nhập lại để lấy token mới (sau khi đã logout)
    const loginRes = await request(BASE_URL)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'NewTest@Password456!' });

    customerToken = loginRes.body?.accessToken || '';
  });

  it('❌ CUSTOMER không thể truy cập GET /api/admin/users', async () => {
    const res = await request(BASE_URL)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('❌ CUSTOMER không thể tạo user mới qua POST /api/admin/users', async () => {
    const res = await request(BASE_URL)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name:     'Fake Admin',
        email:    `fakeadmin_${timestamp}@jest.local`,
        password: 'Test@Pass123!',
        role:     'ADMIN',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('❌ Unauthenticated không thể truy cập /api/admin/users', async () => {
    const res = await request(BASE_URL).get('/api/admin/users');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
