const request = require('supertest');
const app = require('../src/server');

describe('Health Check', () => {
  test('GET /api/health should return OK status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
  });
});