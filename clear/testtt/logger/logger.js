/**
 * ─────────────────────────────────────────────────────────────
 *  logger.js — Winston Logger cho TLaundry Backend
 *  Dùng cùng thư mục này hoặc copy vào backend/logger/logger.js
 * ─────────────────────────────────────────────────────────────
 *
 *  Levels: error > warn > info > http > debug
 *
 *  Outputs:
 *   • Console    — tất cả levels (màu sắc, dễ đọc khi dev)
 *   • logs/error.log     — chỉ error
 *   • logs/combined.log  — tất cả
 *   • logs/YYYY-MM-DD.log — daily rotate (tự xoá sau 14 ngày)
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Tạo thư mục logs nếu chưa có ──────────────────────────────
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// ── Màu sắc cho console ────────────────────────────────────────
const colors = {
  error:   'red',
  warn:    'yellow',
  info:    'green',
  http:    'magenta',
  debug:   'white',
};
winston.addColors(colors);

// ── Custom format: timestamp + màu + message ──────────────────
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? '\n  ' + JSON.stringify(meta, null, 2)
      : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

// ── File format: JSON để dễ query/grep ────────────────────────
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// ── Xác định level theo môi trường ────────────────────────────
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// ── Transports ─────────────────────────────────────────────────
const transports = [
  // 1. Console
  new winston.transports.Console({
    format: consoleFormat,
  }),

  // 2. Chỉ ghi error vào error.log
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
  }),

  // 3. Ghi tất cả vào combined.log
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: fileFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
  }),

  // 4. Daily rotate — tự xoá log cũ sau 14 ngày
  new DailyRotateFile({
    filename:      path.join(logsDir, '%DATE%.log'),
    datePattern:   'YYYY-MM-DD',
    zippedArchive: true,
    maxSize:       '20m',
    maxFiles:      '14d',
    format:        fileFormat,
  }),
];

// ── Tạo logger instance ────────────────────────────────────────
const logger = winston.createLogger({
  level:      level(),
  levels:     winston.config.npm.levels,
  transports,
  // Bắt uncaught exceptions & unhandled promise rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      format:   fileFormat,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      format:   fileFormat,
    }),
  ],
});

export default logger;

/**
 * ─── HƯỚNG DẪN TÍCH HỢP VÀO BACKEND ─────────────────────────
 *
 * 1. Copy file này vào: backend/logger/logger.js
 *
 * 2. Trong server.js, thêm:
 *      import logger from './logger/logger.js';
 *
 * 3. Thay console.log/error bằng logger.*:
 *      logger.info('Server started');
 *      logger.error('DB connection failed', { error: err.message });
 *      logger.warn('Rate limit exceeded', { ip: req.ip });
 *      logger.debug('Request body', { body: req.body });   // chỉ hiện khi dev
 *
 * 4. Trong errorHandler.js:
 *      import logger from '../logger/logger.js';
 *      export default (err, req, res, next) => {
 *        logger.error(`${err.status || 500} — ${err.message}`, {
 *          method: req.method,
 *          url:    req.originalUrl,
 *          ip:     req.ip,
 *          stack:  err.stack,
 *        });
 *        res.status(err.status || 500).json({ ... });
 *      };
 */
