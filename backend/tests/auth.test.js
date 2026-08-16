const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index');
const User = require('../models/user.model');

const credentials = {
  username: 'ada_lovelace',
  email: 'ada@example.com',
  password: 'correct-horse-battery',
  confirmPassword: 'correct-horse-battery',
};

const register = () => request(app).post('/api/auth/signup').send(credentials);

const signIn = () =>
  request(app)
    .post('/api/auth/signin')
    .send({ credential: credentials.email, password: credentials.password });

describe('POST /api/auth/signup', () => {
  it('registers a user and stores the password hashed', async () => {
    const response = await register();

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    const stored = await User.findOne({ email: credentials.email });
    expect(stored).not.toBeNull();
    expect(stored.password).not.toBe(credentials.password);
    expect(stored.roles).toEqual(['user']);
  });

  it('rejects a password below the minimum length', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ ...credentials, password: 'short', confirmPassword: 'short' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('ValidationError');
  });

  it('rejects a duplicate email with 409 rather than 500', async () => {
    await register();
    const response = await register();

    expect(response.status).toBe(409);
  });
});

describe('POST /api/auth/signin', () => {
  it('returns a token pair for valid credentials', async () => {
    await register();
    const response = await signIn();

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toEqual(expect.any(String));
    expect(response.body.data.refreshToken).toEqual(expect.any(String));
  });

  it('answers 400, not 500, when credential is not a string', async () => {
    // This shape used to reach `credential.toLowerCase()` and throw.
    const response = await request(app)
      .post('/api/auth/signin')
      .send({ credential: { $ne: null }, password: 'whatever-you-like' });

    expect(response.status).toBe(400);
  });

  it('does not reveal whether an account exists', async () => {
    await register();

    const wrongPassword = await request(app)
      .post('/api/auth/signin')
      .send({ credential: credentials.email, password: 'not-the-password' });
    const noSuchUser = await request(app)
      .post('/api/auth/signin')
      .send({ credential: 'nobody@example.com', password: 'not-the-password' });

    expect(wrongPassword.status).toBe(401);
    expect(noSuchUser.status).toBe(401);
    expect(wrongPassword.body.message).toBe(noSuchUser.body.message);
  });
});

describe('token revocation', () => {
  it('rejects an access token after the account signs out', async () => {
    await register();
    const { body } = await signIn();
    const { accessToken } = body.data;

    const before = await request(app)
      .get('/api/users/getUser')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(before.status).toBe(200);

    await request(app)
      .post('/api/auth/signout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const after = await request(app)
      .get('/api/users/getUser')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(after.status).toBe(401);
  });

  it('takes roles from the account, not the presented refresh token', async () => {
    await register();
    const user = await User.findOne({ email: credentials.email });

    // A token whose payload claims admin. Roles used to be copied straight out of it.
    const forged = jwt.sign(
      { user: user.id, roles: ['admin'], tokenVersion: 0, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    const refreshed = await request(app)
      .post('/api/auth/refreshToken')
      .send({ refreshToken: forged });
    expect(refreshed.status).toBe(200);

    // The minted access token must not carry the privileges the payload asked for.
    const adminOnly = await request(app)
      .get('/api/analytics/admin')
      .set('Authorization', `Bearer ${refreshed.body.data.accessToken}`);
    expect(adminOnly.status).toBe(403);
  });

  it('refuses an access token presented as a refresh token', async () => {
    await register();
    const { body } = await signIn();

    const response = await request(app)
      .post('/api/auth/refreshToken')
      .send({ refreshToken: body.data.accessToken });

    expect(response.status).toBe(401);
  });
});
