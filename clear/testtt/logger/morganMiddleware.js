/**
 * ─────────────────────────────────────────────────────────────
 *  morganMiddleware.js — Morgan HTTP Request Logger
 *  Tích hợp Morgan với Winston để log mọi HTTP request
 * ─────────────────────────────────────────────────────────────
 *
 *  Log format: :method :url :status :res[content-length] - :response-time ms
 *  Ví dụ:  POST /api/auth/login 401 52 - 123.456 ms
 *
 *  CÁCH DÙNG: Import vào server.js, đặt trước tất cả routes:
 *    import morganMiddleware from './logger/morganMiddleware.js';
 *    app.use(morganMiddleware);
 */

import morgan from 'morgan';
import logger from './logger.js';

// Tạo custom stream: redirect Morgan output → Winston 'http' level
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Bỏ qua log trong test environment để giữ output gọn
const skip = () => process.env.NODE_ENV === 'test';

// Format:
//  • 'dev'      — màu sắc, ngắn gọn (chỉ dùng khi dev)
//  • 'combined' — Apache combined format (production)
//  • custom     — đầy đủ thông tin cần thiết
const morganFormat = process.env.NODE_ENV === 'production'
  ? 'combined'
  : ':method :url :status :res[content-length] - :response-time ms | :remote-addr';

const morganMiddleware = morgan(morganFormat, { stream, skip });

export default morganMiddleware;

/**
 * ─── HƯỚNG DẪN TÍCH HỢP VÀO SERVER.JS ───────────────────────
 *
 * import morganMiddleware from './logger/morganMiddleware.js';
 *
 * // Đặt SAU helmet, TRƯỚC các routes:
 * app.use(morganMiddleware);
 *
 * // Sau đó mọi request sẽ tự log:
 * // [2026-08-22 12:00:00] http: POST /api/auth/login 200 234 - 87.123 ms | ::1
 */
