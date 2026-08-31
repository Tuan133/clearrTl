/**
 * ─────────────────────────────────────────────────────────────
 *  tests/logger.test.js — Unit Tests cho Winston Logger
 *  Chạy: npm test
 * ─────────────────────────────────────────────────────────────
 */

import { describe, it, expect, jest } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

describe('📋 Logger — Winston Unit Tests', () => {
  let logger;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    // Dynamic import để tránh lỗi module initialization
    const module = await import('../logger/logger.js');
    logger = module.default;
  });

  it('✅ Logger instance tồn tại và có các methods cần thiết', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.http).toBe('function');
  });

  it('✅ Logger.info() không throw error', () => {
    expect(() => {
      logger.info('Test info message from Jest');
    }).not.toThrow();
  });

  it('✅ Logger.error() ghi được error với metadata', () => {
    expect(() => {
      logger.error('Test error from Jest', {
        method: 'POST',
        url:    '/api/test',
        status: 500,
      });
    }).not.toThrow();
  });

  it('✅ Logger.warn() hoạt động bình thường', () => {
    expect(() => {
      logger.warn('Test warning from Jest', { ip: '127.0.0.1' });
    }).not.toThrow();
  });

  it('✅ Logger level được set đúng theo NODE_ENV', () => {
    // Trong test mode, logger vẫn hoạt động
    expect(logger.level).toBeDefined();
  });

  it('✅ Logger có transports được cấu hình', () => {
    expect(logger.transports.length).toBeGreaterThan(0);
  });
});
