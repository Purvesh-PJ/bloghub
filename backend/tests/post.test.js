const request = require('supertest');
const app = require('../index'); // Import the Express app

describe('POST /posts', () => {
  it('should create a new post', async () => {
    const response = await request(app).post('/posts').send({
      title: 'Test Post',
      content: 'This is a test post.',
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
