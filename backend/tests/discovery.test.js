const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');
const View = require('../models/view.model');
const Read = require('../models/read.model');

/*
  Search, tracking and the analytics endpoints.

  Search had always matched `title` and nothing else, while the box above it offered
  "stories, tags, or authors". Tracking is open to anonymous callers and so has to be
  de-duplicated per visitor. The analytics endpoints answered in three different shapes.
*/

const author = {
  username: 'discovery_author',
  email: 'discovery-author@example.com',
  password: 'correct-horse-battery',
  confirmPassword: 'correct-horse-battery',
};

const reader = { ...author, username: 'discovery_reader', email: 'discovery-reader@example.com' };

const admin = { ...author, username: 'discovery_admin', email: 'discovery-admin@example.com' };

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

describe('GET /api/search/:query', () => {
  it('matches the body of a story, not only its title', async () => {
    const token = await signedInAs(author);
    await createPost(token, {
      title: 'An unrelated heading',
      content: 'This paragraph is about hydroponics in detail.',
    });

    const response = await request(app).get('/api/search/hydroponics');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('An unrelated heading');
  });

  it('matches a tag name', async () => {
    const token = await signedInAs(author);
    await createPost(token, { title: 'Tagged story', tags: ['kubernetes'] });

    const response = await request(app).get('/api/search/kubernetes');

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('Tagged story');
  });

  it('matches an author’s username', async () => {
    const token = await signedInAs(author);
    await createPost(token, { title: 'Something they wrote' });

    const response = await request(app).get(`/api/search/${author.username}`);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].user.username).toBe(author.username);
  });

  it('ranks a title match above a body-only match', async () => {
    const token = await signedInAs(author);
    await createPost(token, { title: 'Nothing to see', content: 'A mention of postgres here.' });
    await createPost(token, { title: 'Postgres tuning', content: 'Unrelated body.' });

    const response = await request(app).get('/api/search/postgres');

    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].title).toBe('Postgres tuning');
  });

  it('never reaches a draft or a private story', async () => {
    const token = await signedInAs(author);
    await createPost(token, { title: 'Secret hydroponics', visibility: 'draft' });
    await createPost(token, { title: 'Private hydroponics', visibility: 'private' });

    const response = await request(app).get('/api/search/hydroponics');

    expect(response.body.data).toHaveLength(0);
  });

  it('treats the query as text rather than as a regular expression', async () => {
    const token = await signedInAs(author);
    await createPost(token, { title: 'Plain heading' });

    // `.*` would match every story if the query were interpolated into a regex unescaped.
    const response = await request(app).get('/api/search/.*');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
  });

  it('returns enough of each story for a result card to render', async () => {
    const token = await signedInAs(author);
    await createPost(token, { title: 'Renderable', content: '<p>Some **markdown** body.</p>' });

    const { body } = await request(app).get('/api/search/Renderable');
    const [result] = body.data;

    expect(result.user.username).toBe(author.username);
    expect(result.createdAt).toBeDefined();
    // Reading time is estimated from the length of the whole body, which a 200-character
    // excerpt cannot supply.
    expect(result.contentLength).toBeGreaterThan(0);
    // Markup and markdown noise are stripped so the excerpt reads as prose.
    expect(result.truncatedContent).not.toMatch(/[<>*]/);
  });

  it('rejects a blank query rather than searching for nothing', async () => {
    const response = await request(app).get('/api/search/%20');
    expect(response.status).toBe(400);
  });
});

describe('view and read tracking', () => {
  it('counts a view once per visitor inside the de-duplication window', async () => {
    const token = await signedInAs(author);
    const postId = await createPost(token);

    const first = await request(app).post(`/api/analytics/view/${postId}`);
    const second = await request(app).post(`/api/analytics/view/${postId}`);

    expect(first.status).toBe(201);
    expect(first.body.counted).toBe(true);
    expect(second.status).toBe(200);
    expect(second.body.counted).toBe(false);

    expect(await View.countDocuments({ post: postId })).toBe(1);
  });

  it('attributes a view to the reader when a token is present', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const postId = await createPost(authorToken);

    await request(app)
      .post(`/api/analytics/view/${postId}`)
      .set('Authorization', `Bearer ${readerToken}`);

    const view = await View.findOne({ post: postId }).lean();
    const readerId = (await User.findOne({ username: reader.username }).select('_id').lean())._id;
    expect(String(view.user)).toBe(String(readerId));
  });

  it('refuses to accumulate rows against a story the caller cannot read', async () => {
    const token = await signedInAs(author);
    const draftId = await createPost(token, { visibility: 'draft' });

    const response = await request(app).post(`/api/analytics/view/${draftId}`);

    expect(response.status).toBe(404);
    expect(await View.countDocuments({ post: draftId })).toBe(0);
  });

  it('records a finished read separately from a view', async () => {
    const token = await signedInAs(author);
    const postId = await createPost(token);

    await request(app).post(`/api/analytics/read/${postId}`);

    expect(await Read.countDocuments({ post: postId })).toBe(1);
  });
});

describe('GET /api/analytics/post/:id', () => {
  it('computes the figures from the events, for the author', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const postId = await createPost(authorToken);

    await request(app)
      .post(`/api/analytics/view/${postId}`)
      .set('Authorization', `Bearer ${readerToken}`);
    await request(app)
      .post(`/api/analytics/read/${postId}`)
      .set('Authorization', `Bearer ${readerToken}`);
    await request(app)
      .post('/api/likes')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ postId });

    const response = await request(app)
      .get(`/api/analytics/post/${postId}`)
      .set('Authorization', `Bearer ${authorToken}`);

    /*
      This used to read a pre-aggregated `Analytics` document that only the seed script ever
      wrote, so on a real database it answered 404 for every post.
    */
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({ views: 1, reads: 1, likes: 1, readRate: 100 });
  });

  it('refuses another author’s post', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const postId = await createPost(authorToken);

    const response = await request(app)
      .get(`/api/analytics/post/${postId}`)
      .set('Authorization', `Bearer ${readerToken}`);

    expect(response.status).toBe(403);
  });

  it('requires a session', async () => {
    const token = await signedInAs(author);
    const postId = await createPost(token);

    const response = await request(app).get(`/api/analytics/post/${postId}`);
    expect(response.status).toBe(401);
  });
});

describe('GET /api/analytics/admin', () => {
  it('answers in the same envelope as the rest of the API', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);
    const postId = await createPost(authorToken);
    await request(app).post(`/api/analytics/view/${postId}`);

    const response = await request(app)
      .get('/api/analytics/admin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    // It used to return a bare object, making the console the one screen reading a different
    // shape from every other.
    expect(response.body.success).toBe(true);
    expect(response.body.data.totalPosts).toBe(1);
    expect(response.body.data.totalViews).toBe(1);
    expect(response.body.data.totalUsers).toBe(2);
  });

  it('refuses a non-administrator', async () => {
    const token = await signedInAs(author);

    const response = await request(app)
      .get('/api/analytics/admin')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});

describe('GET /api/user-activity/all', () => {
  it('reports active users from what people actually did', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);
    const postId = await createPost(authorToken);

    await request(app)
      .post(`/api/analytics/view/${postId}`)
      .set('Authorization', `Bearer ${authorToken}`);

    const response = await request(app)
      .get('/api/user-activity/all')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    /*
      The query this replaces counted `User.lastActive`, a field no schema declares and
      nothing ever wrote, so the console reported zero active users on every site.
    */
    expect(response.body.data.activeUsers).toBe(1);
    expect(response.body.data.posts.total).toBe(1);
  });

  it('refuses a non-administrator', async () => {
    const token = await signedInAs(author);

    const response = await request(app)
      .get('/api/user-activity/all')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});

describe('GET /api/user-activity/moderation-log', () => {
  it('lists only stories that were actually edited after being written', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);

    const untouched = await createPost(authorToken, { title: 'Never edited' });
    const edited = await createPost(authorToken, { title: 'Edited later' });

    await request(app)
      .put(`/api/posts/${edited}`)
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ title: 'Edited later, revised' });

    const response = await request(app)
      .get('/api/user-activity/moderation-log')
      .set('Authorization', `Bearer ${adminToken}`);

    // The original filter, `{ updatedAt: { $ne: null } }`, is true of every post ever
    // created, so the log listed the whole collection as though all of it had been moderated.
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('Edited later, revised');
    expect(String(response.body.data[0]._id)).toBe(String(edited));
    expect(String(untouched)).not.toBe(String(response.body.data[0]._id));
  });

  it('does not count engagement on a story as an edit to it', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);

    const postId = await createPost(authorToken, { title: 'Popular, never revised' });

    /*
      Each of these writes to the post document — a comment, a like and a view all push an id
      onto an array on it — so Mongoose bumps `updatedAt` and the story satisfies
      `updatedAt > createdAt` without a word of it having changed. That is why the log keys
      off `editedAt`, which only postService.updatePost sets.
    */
    await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ postId, message: 'Enjoyed this' });

    await request(app)
      .post('/api/likes')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ postId });

    await request(app)
      .post(`/api/analytics/view/${postId}`)
      .set('Authorization', `Bearer ${readerToken}`);

    const response = await request(app)
      .get('/api/user-activity/moderation-log')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.data).toHaveLength(0);
  });

  it('orders by when the story was edited, and reports that time', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);

    const first = await createPost(authorToken, { title: 'Edited first' });
    const second = await createPost(authorToken, { title: 'Edited second' });

    await request(app)
      .put(`/api/posts/${first}`)
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ title: 'Edited first, revised' });

    await request(app)
      .put(`/api/posts/${second}`)
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ title: 'Edited second, revised' });

    const response = await request(app)
      .get('/api/user-activity/moderation-log')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.data.map((row) => row.title)).toEqual([
      'Edited second, revised',
      'Edited first, revised',
    ]);
    expect(response.body.data[0].timestamp).toBe(response.body.data[0].editedAt);
  });
});

describe('DELETE /api/tags/:id', () => {
  it('removes a tag nothing is filed under', async () => {
    const adminToken = await signedInAsAdmin(admin);

    const created = await request(app)
      .post('/api/tags')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'ephemeral' });

    const removed = await request(app)
      .delete(`/api/tags/${created.body.data._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(removed.status).toBe(200);

    const listing = await request(app).get('/api/tags');
    expect(listing.body.data.map((tag) => tag.name)).not.toContain('ephemeral');
  });

  it('refuses while stories still carry the tag', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const authorToken = await signedInAs(author);
    await createPost(authorToken, { tags: ['inuse'] });

    const listing = await request(app).get('/api/tags');
    const tag = listing.body.data.find((row) => row.name === 'inuse');

    const response = await request(app)
      .delete(`/api/tags/${tag._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/still filed/i);
  });

  it('refuses a non-administrator', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const token = await signedInAs(author);

    const created = await request(app)
      .post('/api/tags')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'protected' });

    const response = await request(app)
      .delete(`/api/tags/${created.body.data._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});
