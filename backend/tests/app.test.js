const request = require('supertest');
const app = require('../app');

describe('App', () => {
  test('should return 404 for unknown route', async () => {
    const response = await request(app).get('/this-route-does-not-exist');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });
});
