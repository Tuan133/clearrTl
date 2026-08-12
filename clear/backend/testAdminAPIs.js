import dotenv from 'dotenv';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_PORT = process.env.PORT || 5001;
const BASE_URL = `http://localhost:${API_PORT}/api`;

const formatLog = (title, status, details) => {
  const icon = status === 'SUCCESS' ? '✅' : '❌';
  console.log(`${icon} [${status}] ${title}`);
  if (details) {
    console.log(`   └─> ${details}`);
  }
};

const runAdminAPITests = async () => {
  console.log('\n==================================================');
  console.log('🛡️  TLaundry Admin Portal APIs Test Suite (Task 4)');
  console.log('==================================================\n');

  let serverProcess = null;

  // 1. Kiểm tra xem Server backend HTTP đã chạy chưa. Nếu chưa -> tự động khởi động server.js
  try {
    const healthCheck = await fetch(`http://localhost:${API_PORT}/api/health`).catch(() => null);
    if (!healthCheck || !healthCheck.ok) {
      console.log(`ℹ️ HTTP Server chưa chạy tại port ${API_PORT}. Đang tự động khởi động backend server...\n`);
      serverProcess = spawn('node', ['server.js'], {
        cwd: __dirname,
        stdio: 'ignore'
      });
      // Đợi 2.5s để server khởi động và kết nối DB
      await new Promise(r => setTimeout(r, 2500));
    } else {
      console.log(`📡 Đã kết nối đến HTTP Server tại ${BASE_URL}\n`);
    }
  } catch (err) {
    console.log('⚠️ Đang khởi tạo kết nối HTTP server...');
  }

  let adminToken = null;
  let customerToken = null;
  let bookingId = null;
  let contactId = null;

  let passedTests = 0;
  let totalTests = 0;

  const testRequest = async (name, endpoint, method = 'GET', body = null, token = null, expectedStatus = 200) => {
    totalTests++;
    const start = Date.now();
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const options = { method, headers };
      if (body) options.body = JSON.stringify(body);

      const res = await fetch(`${BASE_URL}${endpoint}`, options);
      const data = await res.json().catch(() => ({}));
      const duration = Date.now() - start;

      if (res.status === expectedStatus) {
        passedTests++;
        let detailStr = `Status ${res.status} HTTP OK (${duration}ms)`;
        if (data.message) detailStr += ` | ${data.message}`;
        if (data.total !== undefined) detailStr += ` | Total items: ${data.total}`;
        if (data.data && data.data.orders) detailStr += ` | Đơn hàng hôm nay: ${data.data.orders.today}, Doanh thu: ${data.data.revenue.total.toLocaleString()}đ`;
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

  // --- STEP 1: ĐĂNG NHẬP ADMIN ---
  console.log('🔑 1. Đăng nhập tài khoản Admin...');
  const adminLoginRes = await testRequest(
    '1.1 Đăng nhập Admin (admin@tlaundry.com)',
    '/auth/login',
    'POST',
    { email: 'admin@tlaundry.com', password: 'admin123456' },
    null,
    200
  );
  if (adminLoginRes.success) {
    adminToken = adminLoginRes.data.accessToken;
  } else {
    console.error('❌ Không thể đăng nhập Admin. Dừng bài test.');
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }

  // Đăng nhập tài khoản Customer (để test RBAC phân quyền)
  const customerLoginRes = await testRequest(
    '1.2 Đăng nhập Customer (customer@tlaundry.com)',
    '/auth/login',
    'POST',
    { email: 'customer@tlaundry.com', password: 'customer123' },
    null,
    200
  );
  if (customerLoginRes.success) {
    customerToken = customerLoginRes.data.accessToken;
  }

  // --- STEP 2: TEST CÁC API QUẢN LÝ ĐƠN HÀNG ---
  console.log('\n📦 2. Test API Quản lý Đơn hàng...');

  // Tạo 1 đơn mới để test
  const newBookingRes = await testRequest(
    '2.1 Tạo đơn đặt giặt mới (Public POST /api/bookings)',
    '/bookings',
    'POST',
    {
      serviceType: 'Giặt Ủi Gia Đình',
      firstName: 'Nguyễn',
      lastName: 'Văn Admin Test',
      email: 'testadmin@example.com',
      phone: '0988001122',
      address: '456 Lê Lợi',
      suburb: 'Quận 1',
      state: 'VIC',
      pickupDate: '2026-08-15'
    },
    null,
    201
  );
  if (newBookingRes.success) {
    bookingId = newBookingRes.data.data._id;
  }

  // Lấy danh sách đơn hàng (Phân trang & Lọc theo status)
  const orderListRes = await testRequest(
    '2.2 Lấy danh sách đơn hàng (GET /api/bookings?page=1&limit=5)',
    '/bookings?page=1&limit=5',
    'GET',
    null,
    adminToken,
    200
  );
  if (!bookingId && orderListRes.success && orderListRes.data.data.length > 0) {
    bookingId = orderListRes.data.data[0]._id;
  }

  // Lọc theo trạng thái PENDING
  await testRequest(
    '2.3 Lọc danh sách đơn hàng theo trạng thái PENDING (GET /api/bookings?status=PENDING)',
    '/bookings?status=PENDING',
    'GET',
    null,
    adminToken,
    200
  );

  // Cập nhật trạng thái đơn hàng: PENDING -> WASHING -> COMPLETED
  if (bookingId) {
    await testRequest(
      '2.4 Cập nhật trạng thái đơn: -> WASHING (PUT /api/bookings/:id/status)',
      `/bookings/${bookingId}/status`,
      'PUT',
      { status: 'WASHING' },
      adminToken,
      200
    );

    await testRequest(
      '2.5 Cập nhật trạng thái đơn: -> COMPLETED (PUT /api/bookings/:id/status)',
      `/bookings/${bookingId}/status`,
      'PUT',
      { status: 'COMPLETED' },
      adminToken,
      200
    );
  }

  // --- STEP 3: TEST API DASHBOARD & THỐNG KÊ ---
  console.log('\n📊 3. Test API Dashboard & Thống kê...');
  await testRequest(
    '3.1 Lấy dữ liệu Dashboard & Thống kê (GET /api/admin/dashboard)',
    '/admin/dashboard',
    'GET',
    null,
    adminToken,
    200
  );

  // --- STEP 4: TEST API QUẢN LÝ KHÁCH HÀNG & PHẢN HỒI ---
  console.log('\n💬 4. Test API Quản lý Khách hàng & Phản hồi...');

  // Gửi 1 contact tin nhắn mới
  const newContactRes = await testRequest(
    '4.1 Gửi tin nhắn liên hệ mới (POST /api/contact)',
    '/contact',
    'POST',
    {
      name: 'Nguyễn Văn Phản Hồi',
      email: 'phanhoi@example.com',
      phone: '0977112233',
      subject: 'Cần tư vấn dịch vụ',
      message: 'Tôi muốn tư vấn dịch vụ giặt rèm cửa'
    },
    null,
    201
  );
  if (newContactRes.success) {
    contactId = newContactRes.data.data._id;
  }

  // Xem danh sách tin nhắn liên hệ (có phân trang & lọc)
  const contactListRes = await testRequest(
    '4.2 Lấy danh sách tin nhắn liên hệ (GET /api/contact?page=1&limit=10)',
    '/contact?page=1&limit=10',
    'GET',
    null,
    adminToken,
    200
  );
  if (!contactId && contactListRes.success && contactListRes.data.data.length > 0) {
    contactId = contactListRes.data.data[0]._id;
  }

  // Cập nhật đánh dấu đã xử lý
  if (contactId) {
    await testRequest(
      '4.3 Đánh dấu tin nhắn liên hệ là ĐÃ XỬ LÝ (PATCH /api/contact/:id/resolve)',
      `/contact/${contactId}/resolve`,
      'PATCH',
      null,
      adminToken,
      200
    );
  }

  // --- STEP 5: TEST BẢO MẬT & PHÂN QUYỀN RBAC ---
  console.log('\n🔒 5. Test Phân quyền RBAC (Khách hàng không được truy cập Admin APIs)...');
  if (customerToken) {
    await testRequest(
      '5.1 Khách hàng gọi GET /api/admin/dashboard -> Bị từ chối (Expect 403 Forbidden)',
      '/admin/dashboard',
      'GET',
      null,
      customerToken,
      403
    );

    await testRequest(
      '5.2 Khách hàng gọi GET /api/bookings (xem toàn bộ đơn) -> Bị từ chối (Expect 403 Forbidden)',
      '/bookings',
      'GET',
      null,
      customerToken,
      403
    );
  }

  // --- KẾT QUẢ BÁO CÁO ---
  console.log('\n==================================================');
  console.log(`🎉 TỔNG KẾT TEST TASK 4: ${passedTests}/${totalTests} BÀI TEST PASSED!`);
  console.log('==================================================\n');

  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
};

runAdminAPITests();
