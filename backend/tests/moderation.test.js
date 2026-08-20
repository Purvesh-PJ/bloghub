const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');

/*
  The moderation listing.

  `GET /posts?all=true` returned an unfiltered page and nothing else, so the console asked for
  a flat fifty posts and did the filtering, the searching and the counting in the browser —
  which meant a site with more than fifty stories offered no way to reach the rest of them,
  and the numbers on the filter chips described the fifty that happened to load.

  The filters are gated on the caller actually being an administrator, which is the part most
  worth pinning: `visibility` reaching the public feed would turn it into a way to list
  everybody's drafts.
*/

const admin = {
  username: 'moderation_admin',
  email: 'moderation-admin@example.com',
  password: 'correct-horse-battery',
  confirmPassword: 'correct-horse-battery',
};

const author = { ...admin, username: 'moderation_author', email: 'moderation-author@example.com' };

const signedInAs = async (account) => {
  await request(app).post('/api/auth/signup').send(account);
  const { body } = await request(app)
    .post('/api/auth/signin')
    .send({ credential: account.email, password: account.password });
  return body.data.accessToken;
};

const signedInAsAdmin = async (account) => {
  await request(app).post('/api/auth/signup').send(account);
  await User.updateOne({ email: account.email }, { $set: { roles: ['user', 'admin'] } });
  const { body } = await request(app)
    .post('/api/auth/signin')
    .send({ credential: account.email, password: account.password });
  return body.data.accessToken;
};

const createPost = async (token, overrides = {}) => {
  const { body } = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'A story', content: 'Body text.', visibility: 'public', ...overrides });
  return body.postId;
};

/** One of each visibility, plus a second published story, written by `author`. */
const seedLibrary = async (token) => {
  await createPost(token, { title: 'Published one' });
  await createPost(token, { title: 'Published two' });
  await createPost(token, { title: 'A draft', visibility: 'draft' });
  await createPost(token, { title: 'Something private', visibility: 'private' });
};

describe('GET /api/posts?all=true', () => {
  it('breaks the whole collection down by visibility, not the page on screen', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);
    await seedLibrary(authorToken);

    const response = await request(app)
      .get('/api/posts?all=true&limit=1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    // One row returned, but the counts describe all four stories.
    expect(response.body.data).toHaveLength(1);
    expect(response.body.counts).toEqual({ all: 4, public: 2, draft: 1, private: 1 });
    expect(response.body.pagination.total).toBe(4);
  });

  it('filters by visibility for an administrator', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);
    await seedLibrary(authorToken);

    const response = await request(app)
      .get('/api/posts?all=true&visibility=draft')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('A draft');
  });

  it('searches by title, on the server', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);
    await seedLibrary(authorToken);

    const response = await request(app)
      .get('/api/posts?all=true&q=private')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('Something private');
  });

  it('reaches a story past the first page instead of capping the listing', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);

    await createPost(authorToken, { title: 'The oldest story' });
    for (let i = 0; i < 24; i += 1) {
      await createPost(authorToken, { title: `Filler ${i}` });
    }

    const response = await request(app)
      .get('/api/posts?all=true&limit=25&page=2')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.pagination.total).toBe(25);
    expect(response.body.data).toHaveLength(0);

    const lastPage = await request(app)
      .get('/api/posts?all=true&limit=24&page=2')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(lastPage.body.data).toHaveLength(1);
    expect(lastPage.body.data[0].title).toBe('The oldest story');
  });

  it('ignores ?visibility for a non-administrator rather than exposing drafts', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAsAdmin({
      ...author,
      username: 'moderation_reader',
      email: 'moderation-reader@example.com',
    });
    await seedLibrary(authorToken);

    // A signed-out visitor.
    const anonymous = await request(app).get('/api/posts?visibility=draft');
    expect(anonymous.body.data).toHaveLength(2);
    anonymous.body.data.forEach((post) => expect(post.visibility).toBe('public'));

    // A signed-in non-administrator, asking without the all flag.
    const signedIn = await request(app)
      .get('/api/posts?visibility=draft')
      .set(
        'Authorization',
        `Bearer ${await signedInAs({
          ...author,
          username: 'moderation_other',
          email: 'moderation-other@example.com',
        })}`,
      );

    expect(signedIn.body.data).toHaveLength(2);
    signedIn.body.data.forEach((post) => expect(post.visibility).toBe('public'));

    expect(readerToken).toEqual(expect.any(String));
  });

  it('omits the counts block for a listing that has nothing to break down', async () => {
    const authorToken = await signedInAs(author);
    await seedLibrary(authorToken);

    const response = await request(app).get('/api/posts');
    expect(response.body.counts).toBeUndefined();
  });

  it('rejects an unknown visibility rather than ignoring it silently', async () => {
    const adminToken = await signedInAsAdmin(admin);

    const response = await request(app)
      .get('/api/posts?all=true&visibility=deleted')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
  });

  it('treats a search term as text rather than as a regular expression', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);
    await seedLibrary(authorToken);

    const response = await request(app)
      .get('/api/posts?all=true&q=.%2A')
      .set('Authorization', `Bearer ${adminToken}`);

    // `.*` would match every title if it reached the regex unescaped.
    expect(response.body.data).toHaveLength(0);
  });

  it('applies a bulk action across authors for an administrator', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);

    const first = await createPost(authorToken, { title: 'One' });
    const second = await createPost(authorToken, { title: 'Two' });

    const response = await request(app)
      .post('/api/posts/bulk')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ids: [first, second], action: 'draft' });

    expect(response.status).toBe(200);
    expect(response.body.affected).toBe(2);

    const listing = await request(app)
      .get('/api/posts?all=true&visibility=draft')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(listing.body.data).toHaveLength(2);
  });
});
