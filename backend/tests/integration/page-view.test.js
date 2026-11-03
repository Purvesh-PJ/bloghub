const request = require('supertest');
const app = require('../../index');
const Post = require('../../models/post.model');
const View = require('../../models/view.model');
const User = require('../../models/user.model');

const authorAccount = {
  username: 'pageview_author',
  email: 'pv_author@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!',
};

const readerAccount = {
  username: 'pageview_reader',
  email: 'pv_reader@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!',
};

const adminAccount = {
  username: 'pageview_admin',
  email: 'pv_admin@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!',
};

const signedInAs = async (account) => {
  await request(app).post('/api/auth/signup').send(account);
  const { body } = await request(app)
    .post('/api/auth/signin')
    .send({ credential: account.email, password: account.password });
  return body.data.accessToken;
};

describe('Page Views API', () => {
  let authorToken;
  let readerToken;
  let adminToken;
  let postId;

  beforeEach(async () => {
    authorToken = await signedInAs(authorAccount);
    readerToken = await signedInAs(readerAccount);
    adminToken = await signedInAs(adminAccount);

    // Promote admin account to admin role
    await User.findOneAndUpdate({ email: adminAccount.email }, { roles: ['admin'] });

    // Create a post by author
    const postRes = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({
        title: 'Page View Test Post',
        content: 'Content discussing page views tracking...',
        visibility: 'public',
      });
    postId = postRes.body.postId;
  });

  describe('GET /api/page-views/post/:postId/count', () => {
    it('returns zero views when post has no views', async () => {
      const response = await request(app).get(`/api/page-views/post/${postId}/count`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        count: 0,
      });
    });

    it('returns correct count when views exist', async () => {
      await View.create([
        { post: postId, visitorKey: 'a:visitor1' },
        { post: postId, visitorKey: 'a:visitor2' },
      ]);

      const response = await request(app).get(`/api/page-views/post/${postId}/count`);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
    });

    it('rejects an invalid ObjectId with 400', async () => {
      const response = await request(app).get('/api/page-views/post/not-a-valid-id/count');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/page-views/post/:postId', () => {
    it('requires authentication with 401', async () => {
      const response = await request(app).get(`/api/page-views/post/${postId}`);
      expect(response.status).toBe(401);
    });

    it('returns 404 if post does not exist', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/page-views/post/${fakeId}`)
        .set('Authorization', `Bearer ${authorToken}`);

      expect(response.status).toBe(404);
    });

    it('returns 403 if authenticated user is neither author nor admin', async () => {
      const response = await request(app)
        .get(`/api/page-views/post/${postId}`)
        .set('Authorization', `Bearer ${readerToken}`);

      expect(response.status).toBe(403);
    });

    it('allows author to inspect post visitor details', async () => {
      await View.create({ post: postId, visitorKey: 'a:visitor1' });

      const response = await request(app)
        .get(`/api/page-views/post/${postId}`)
        .set('Authorization', `Bearer ${authorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it('allows administrator to inspect post visitor details', async () => {
      await View.create({ post: postId, visitorKey: 'a:visitor1' });

      const response = await request(app)
        .get(`/api/page-views/post/${postId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });
});

