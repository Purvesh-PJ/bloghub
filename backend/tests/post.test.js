const request = require('supertest');
const app = require('../index');
const Post = require('../models/post.model');

const author = {
  username: 'author_one',
  email: 'author@example.com',
  password: 'correct-horse-battery',
  confirmPassword: 'correct-horse-battery',
};

const otherUser = { ...author, username: 'author_two', email: 'other@example.com' };

/** Registers an account and returns its access token. */
const signedInAs = async (account) => {
  await request(app).post('/api/auth/signup').send(account);
  const { body } = await request(app)
    .post('/api/auth/signin')
    .send({ credential: account.email, password: account.password });
  return body.data.accessToken;
};

const draft = { title: 'Test Post', content: 'This is a test post.' };

describe('POST /api/posts', () => {
  it('creates a post for an authenticated author', async () => {
    const token = await signedInAs(author);

    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(draft);

    expect(response.status).toBe(201);
    expect(response.body.postId).toEqual(expect.any(String));

    const stored = await Post.findById(response.body.postId);
    expect(stored.title).toBe(draft.title);
    // Unpublished unless the author says otherwise.
    expect(stored.visibility).toBe('draft');
    expect(stored.slug).toBe('test-post');
  });

  it('refuses an unauthenticated request', async () => {
    const response = await request(app).post('/api/posts').send(draft);
    expect(response.status).toBe(401);
  });

  it('rejects a title beyond the length limit', async () => {
    const token = await signedInAs(author);

    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...draft, title: 'x'.repeat(201) });

    expect(response.status).toBe(400);
  });

  it('gives a second post with the same title a distinct slug', async () => {
    const token = await signedInAs(author);
    const create = () =>
      request(app).post('/api/posts').set('Authorization', `Bearer ${token}`).send(draft);

    const first = await create();
    const second = await create();

    const [a, b] = await Promise.all([
      Post.findById(first.body.postId),
      Post.findById(second.body.postId),
    ]);
    expect(a.slug).not.toBe(b.slug);
  });
});

describe('GET /api/posts', () => {
  it('omits drafts from the public listing', async () => {
    const token = await signedInAs(author);
    await request(app).post('/api/posts').set('Authorization', `Bearer ${token}`).send(draft);
    await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Published', content: 'Visible.', visibility: 'public' });

    const response = await request(app).get('/api/posts');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('Published');
  });

  it('rejects a limit beyond the cap instead of returning everything', async () => {
    const response = await request(app).get('/api/posts?limit=100000');
    expect(response.status).toBe(400);
  });

  it('ignores ?all=true for a non-administrator', async () => {
    const token = await signedInAs(author);
    await request(app).post('/api/posts').set('Authorization', `Bearer ${token}`).send(draft);

    const response = await request(app)
      .get('/api/posts?all=true')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.data).toHaveLength(0);
  });
});

describe('GET /api/posts/:id', () => {
  it('answers 400 for a malformed id rather than 500', async () => {
    const response = await request(app).get('/api/posts/not-an-object-id');
    expect(response.status).toBe(400);
  });

  it('hides another author’s draft behind a 404', async () => {
    const authorToken = await signedInAs(author);
    const created = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authorToken}`)
      .send(draft);

    const strangerToken = await signedInAs(otherUser);
    const response = await request(app)
      .get(`/api/posts/${created.body.postId}`)
      .set('Authorization', `Bearer ${strangerToken}`);

    expect(response.status).toBe(404);
  });

  it('shows an author their own draft', async () => {
    const token = await signedInAs(author);
    const created = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(draft);

    const response = await request(app)
      .get(`/api/posts/${created.body.postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('refuses to let one author delete another’s post', async () => {
    const authorToken = await signedInAs(author);
    const created = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ ...draft, visibility: 'public' });

    const strangerToken = await signedInAs(otherUser);
    const response = await request(app)
      .delete(`/api/posts/${created.body.postId}`)
      .set('Authorization', `Bearer ${strangerToken}`);

    expect(response.status).toBe(403);
    expect(await Post.findById(created.body.postId)).not.toBeNull();
  });
});
