/**
 * ─────────────────────────────────────────────────────────────
 *  tests/health.test.js — Health Check & Server sanity tests
 *  Chạy: npm run test:health
 * ─────────────────────────────────────────────────────────────
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

// Base URL của backend đang chạy (hoặc dùng supertest với app object)
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5001';

describe('🏥 Health Check API', () => {
  it('GET / — server trả về status ok', async () => {
    const res = await request(BASE_URL).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
  });

  it('GET /api/health — API health endpoint hoạt động', async () => {
    const res = await request(BASE_URL).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
    });
  });

  it('GET /api/nonexistent — trả về 404 cho route không tồn tại', async () => {
    const res = await request(BASE_URL).get('/api/nonexistent-route-xyz');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message');
  });

  it('Response headers — có security headers từ Helmet', async () => {
    const res = await request(BASE_URL).get('/api/health');

    // Helmet phải set các header bảo mật này
    expect(res.headers).toHaveProperty('x-content-type-options');
    expect(res.headers).toHaveProperty('x-frame-options');
  });
});
