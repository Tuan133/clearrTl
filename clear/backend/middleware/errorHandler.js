import mongoose from 'mongoose';

// ─── Centralized Error Handler Middleware ──────────────────────────────────────
// Phải là middleware cuối cùng (sau tất cả routes)
// Signature bắt buộc là (err, req, res, next) để Express nhận dạng đây là error handler

/**
 * Phân loại và xử lý tập trung mọi lỗi trong ứng dụng.
 * - Không bao giờ leak stack trace ra ngoài trong production
 * - Xử lý đúng các lỗi phổ biến: Mongoose, JWT, CORS, Validation
 */
const errorHandler = (err, req, res, _next) => {
  const isDev = process.env.NODE_ENV !== 'production';

  // Giá trị mặc định
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Lỗi máy chủ nội bộ!';

  // ── Mongoose: Document Not Found ──────────────────────────────────────────
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Không tìm thấy tài nguyên với ID này!';
  }

  // ── Mongoose: Duplicate Key (Unique Constraint) ────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    statusCode = 409;
    message = field
      ? `Giá trị '${field}' đã tồn tại trong hệ thống!`
      : 'Dữ liệu bị trùng lặp!';
  }

  // ── Mongoose: Validation Error ─────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 422;
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    message = errors[0]?.message || 'Dữ liệu không hợp lệ!';
    return res.status(statusCode).json({ success: false, message, errors });
  }

  // ── JWT: Token hết hạn ─────────────────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Access Token đã hết hạn!';
  }

  // ── JWT: Token không hợp lệ ───────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ!';
  }

  // ── CORS Error ─────────────────────────────────────────────────────────────
  if (err.message && err.message.toLowerCase().includes('cors')) {
    statusCode = 403;
    message = 'Tên miền không được cấp quyền truy cập API!';
  }

  // ── Express JSON body parse error (payload quá lớn, JSON sai định dạng) ───
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Body request không đúng định dạng JSON!';
  }
  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Kích thước request quá lớn! Giới hạn tối đa là 10KB.';
  }

  // ── Log lỗi ra console ─────────────────────────────────────────────────────
  if (isDev) {
    console.error(`❌ [${req.method}] ${req.originalUrl} → ${statusCode}: ${message}`);
    if (err.stack) console.error(err.stack);
  } else {
    // Production: chỉ log 5xx để monitoring, không log lỗi business logic 4xx
    if (statusCode >= 500) {
      console.error(`❌ [SERVER ERROR] ${req.method} ${req.originalUrl}: ${message}`);
    }
  }

  // ── Response ───────────────────────────────────────────────────────────────
  const response = {
    success: false,
    message,
  };

  // Chỉ thêm stack trace trong môi trường development
  if (isDev && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
