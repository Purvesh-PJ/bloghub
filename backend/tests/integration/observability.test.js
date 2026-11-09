const request = require('supertest');
const app = require('../../index');

describe('Production Observability & Request Tracing', () => {
  it('assigns a unique x-request-id header to every response', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.headers['x-request-id']).toBeDefined();
    // UUID v4 format check
    expect(res.headers['x-request-id']).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('preserves an incoming x-request-id header for distributed tracing', async () => {
    const customTraceId = 'trace-client-distributed-12345';
    const res = await request(app).get('/api/health').set('x-request-id', customTraceId);

    expect(res.status).toBe(200);
    expect(res.headers['x-request-id']).toBe(customTraceId);
  });

  it('attaches x-request-id on 404 and error responses', async () => {
    const res = await request(app).get('/api/non-existent-route-for-testing');

    expect(res.status).toBe(404);
    expect(res.headers['x-request-id']).toBeDefined();
  });
});
