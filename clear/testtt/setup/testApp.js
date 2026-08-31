/**
 * ─────────────────────────────────────────────────────────────
 *  setup/testApp.js — Express App dành riêng cho Testing
 *  Không gọi app.listen(), không kết nối MongoDB thật
 *  Supertest sẽ tự quản lý port ephemeral
 * ─────────────────────────────────────────────────────────────
 *
 *  Cách hoạt động:
 *   • Import toàn bộ routes/middleware từ backend/server.js
 *   • Mock mongoose.connect để không kết nối DB thật
 *   • Supertest dùng app object trực tiếp
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load test environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });

// ── Override env cho test ──────────────────────────────────────
process.env.NODE_ENV   = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_jest_2026';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_2026';

// ── JWT helpers (copy từ auth.js) ──────────────────────────────
export const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id || user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

export const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user._id || user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

// ── Build express app ──────────────────────────────────────────
const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10kb' }));

export default app;
