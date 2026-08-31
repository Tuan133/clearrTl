/**
 * ─────────────────────────────────────────────────────────────
 *  generate-secrets.js
 *  Tạo JWT secrets mạnh (64 bytes = 512-bit entropy)
 *
 *  Chạy: node generate-secrets.js
 *  Copy output vào .env
 * ─────────────────────────────────────────────────────────────
 */

import { randomBytes } from 'crypto';

const jwtSecret        = randomBytes(64).toString('hex');
const jwtRefreshSecret = randomBytes(64).toString('hex');
const mongoPassword    = randomBytes(16).toString('base64url'); // URL-safe

console.log('\n' + '═'.repeat(70));
console.log('  🔐 TLaundry — Generated Secrets');
console.log('  Generated at:', new Date().toISOString());
console.log('═'.repeat(70));
console.log(`\nJWT_SECRET=${jwtSecret}`);
console.log(`\nJWT_REFRESH_SECRET=${jwtRefreshSecret}`);
console.log(`\n# MongoDB password suggestion (đặt vào Atlas DB User):`);
console.log(`# MONGO_PASSWORD=${mongoPassword}`);
console.log('\n' + '─'.repeat(70));
console.log('⚠️  Hướng dẫn:');
console.log('  1. Copy JWT_SECRET và JWT_REFRESH_SECRET vào backend/.env');
console.log('  2. KHÔNG commit file .env lên Git');
console.log('  3. Rotate lại sau mỗi 90 ngày hoặc khi phát hiện lộ');
console.log('  4. JWT_SECRET và JWT_REFRESH_SECRET phải KHÁC NHAU');
console.log('─'.repeat(70) + '\n');
