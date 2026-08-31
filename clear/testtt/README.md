# 🧪 TLaundry — Logging & Testing Module

> **Thư mục:** `testtt/`  
> **Mục đích:** Logging (Winston + Morgan) và Integration/Unit Tests (Jest + Supertest)

---

## 📁 Cấu trúc thư mục

```
testtt/
├── logger/
│   ├── logger.js              # Winston logger (console + file + daily rotate)
│   └── morganMiddleware.js    # Morgan → Winston stream
├── tests/
│   ├── health.test.js         # Health check & server sanity
│   ├── auth.test.js           # Auth APIs (register, login, logout, refresh...)
│   ├── booking.test.js        # Booking APIs (tạo đơn, track, admin)
│   └── logger.test.js         # Unit test cho logger
├── setup/
│   └── testApp.js             # Express test app helper
├── logs/                      # Auto-tạo khi chạy (gitignore)
├── .env.test                  # Biến môi trường cho test
├── package.json
└── README.md
```

---

## 🚀 Cài đặt & Chạy

### Bước 1: Cài dependencies

```bash
cd testtt
npm install
```

### Bước 2: Đảm bảo backend đang chạy

```bash
# Terminal khác:
cd ../backend
npm run dev
```

### Bước 3: Chạy tests

```bash
# Chạy TẤT CẢ tests
npm test

# Chỉ test Auth APIs
npm run test:auth

# Chỉ test Booking APIs
npm run test:booking

# Chỉ test Health Check
npm run test:health

# Chạy với coverage report
npm run test:coverage
```

---

## 📋 Tích hợp Logger vào Backend

### 1. Copy logger vào backend

```bash
# Copy từ testtt/logger/ vào backend/logger/
cp -r testtt/logger/ backend/logger/
```

### 2. Cài thêm dependencies vào backend

```bash
cd backend
npm install morgan winston winston-daily-rotate-file
```

### 3. Cập nhật `backend/server.js`

```js
// Thêm vào đầu file (sau các imports hiện tại):
import logger from './logger/logger.js';
import morganMiddleware from './logger/morganMiddleware.js';

// Thêm sau helmet() (dòng ~56):
app.use(morganMiddleware);  // Log mọi HTTP request

// Thay console.log bằng logger.*:
// console.log('...') → logger.info('...')
// console.error('...') → logger.error('...')
```

### 4. Cập nhật `backend/middleware/errorHandler.js`

```js
import logger from '../logger/logger.js';

export default (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  logger.error(`${status} — ${err.message}`, {
    method: req.method,
    url:    req.originalUrl,
    ip:     req.ip,
    stack:  process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(status).json({
    success: false,
    message: err.message || 'Lỗi server nội bộ!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

---

## 📊 Logs Output

Sau khi tích hợp, logs sẽ được ghi vào:

| File | Nội dung |
|------|----------|
| `backend/logs/error.log` | Chỉ errors (500, unhandled exceptions) |
| `backend/logs/combined.log` | Tất cả levels |
| `backend/logs/YYYY-MM-DD.log` | Daily rotate, tự xoá sau 14 ngày |
| `backend/logs/exceptions.log` | Uncaught exceptions |
| Console | Colorized output (chỉ khi dev) |

**Ví dụ log output:**
```
[2026-08-22 12:00:01] info: 🚀 TLaundry Backend API running at http://localhost:5001
[2026-08-22 12:00:05] http: POST /api/auth/login 200 234 - 87.123 ms | ::1
[2026-08-22 12:00:10] error: 500 — Cannot read property of undefined
  {
    "method": "POST",
    "url": "/api/bookings",
    "ip": "::1"
  }
```

---

## 🧩 Các APIs được test

### Auth Tests (`auth.test.js`) — 20 test cases

| Test | Mô tả |
|------|-------|
| ✅ Register thành công | Tạo tài khoản, nhận access + refresh token |
| ❌ Register email trùng | 409 Conflict |
| ❌ Register thiếu fields | 400 Validation |
| ❌ NoSQL injection | Bị chặn bởi mongo-sanitize |
| ✅ Login thành công | JWT tokens được cấp |
| ❌ Login sai password | 401 Unauthorized |
| ✅ GET /me với token | Profile trả về, không có password |
| ❌ GET /me không token | 401 Unauthorized |
| ✅ Refresh token | Token rotation hoạt động |
| ✅ Change password | Đổi mật khẩu & đăng nhập lại thành công |
| ✅ Logout | Refresh token bị vô hiệu hoá |
| ❌ RBAC: Customer → Admin routes | 403 Forbidden |

### Booking Tests (`booking.test.js`) — 18 test cases

| Test | Mô tả |
|------|-------|
| ✅ Guest tạo đơn | Đơn hàng tạo thành công, orderCode TL-XXXXXX |
| ✅ Authenticated tạo đơn | userId được liên kết tự động |
| ❌ Thiếu fields bắt buộc | 400 Validation |
| ✅ Track theo orderCode | Trả về thông tin không nhạy cảm |
| ❌ Track mã không tồn tại | 404 Not Found |
| ✅ My orders (customer) | Chỉ thấy đơn của mình |
| ✅ Phân trang | page, limit hoạt động |
| ✅ Filter status | Chỉ trả về đúng status |
| ✅ Admin xem tất cả | Full list với pagination |
| ❌ Customer xem all bookings | 403 Forbidden |
| ✅ Admin cập nhật status | PENDING → CONFIRMED |
| ❌ Status không hợp lệ | 400 Bad Request |

---

## ⚠️ Lưu ý quan trọng

> **Tests chạy trực tiếp trên database thật (dev DB)**  
> Mỗi lần chạy sẽ tạo user/booking mới với `timestamp` unique.  
> Xem xét dùng MongoDB test instance riêng cho CI/CD.

> **Demo accounts** phải tồn tại trong DB (đã được seed tự động khi backend khởi động qua `seedDemoUsers()`).  
> Credentials mặc định: `admin@demo.com / Demo@123456` và `customer@demo.com / Demo@123456`
