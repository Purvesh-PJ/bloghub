const request = require('supertest');
const app = require('../index');
const Post = require('../models/post.model');
const Tag = require('../models/tag.model');
const User = require('../models/user.model');

const owner = {
  username: 'workspace_owner',
  email: 'owner@example.com',
  password: 'correct-horse-battery',
  confirmPassword: 'correct-horse-battery',
};

const stranger = { ...owner, username: 'workspace_other', email: 'other@example.com' };

const signedInAs = async (account) => {
  await request(app).post('/api/auth/signup').send(account);
  const { body } = await request(app)
    .post('/api/auth/signin')
    .send({ credential: account.email, password: account.password });
  return body.data.accessToken;
};

const createPost = async (token, overrides = {}) => {
  const { body } = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'A story', content: 'Body text.', ...overrides });
  return body.postId;
};

describe('GET /api/users/getUserPosts', () => {
  it('paginates and reports counts across every page', async () => {
    const token = await signedInAs(owner);
    for (let i = 0; i < 5; i += 1) {
      await createPost(token, { title: `Story ${i}`, visibility: i < 2 ? 'public' : 'draft' });
    }

    const response = await request(app)
      .get('/api/users/getUserPosts?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.pagination).toMatchObject({ total: 5, page: 1, limit: 2, pages: 3 });
    // Counts describe the whole collection, not the page.
    expect(response.body.counts).toMatchObject({ all: 5, public: 2, draft: 3, private: 0 });
  });

  it('filters by visibility and searches by title', async () => {
    const token = await signedInAs(owner);
    await createPost(token, { title: 'Published thing', visibility: 'public' });
    await createPost(token, { title: 'Draft thing', visibility: 'draft' });

    const filtered = await request(app)
      .get('/api/users/getUserPosts?visibility=public')
      .set('Authorization', `Bearer ${token}`);
    expect(filtered.body.data).toHaveLength(1);
    expect(filtered.body.data[0].title).toBe('Published thing');

    const searched = await request(app)
      .get('/api/users/getUserPosts?q=draft')
      .set('Authorization', `Bearer ${token}`);
    expect(searched.body.data).toHaveLength(1);
    expect(searched.body.data[0].title).toBe('Draft thing');
  });

  it('rejects an unknown sort key', async () => {
    const token = await signedInAs(owner);
    const response = await request(app)
      .get('/api/users/getUserPosts?sort=; drop table')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });
});

describe('POST /api/posts/bulk', () => {
  it('publishes several drafts at once', async () => {
    const token = await signedInAs(owner);
    const ids = [await createPost(token), await createPost(token)];

    const response = await request(app)
      .post('/api/posts/bulk')
      .set('Authorization', `Bearer ${token}`)
      .send({ ids, action: 'public' });

    expect(response.status).toBe(200);
    expect(response.body.affected).toBe(2);
    const posts = await Post.find({ _id: { $in: ids } });
    expect(posts.every((post) => post.visibility === 'public')).toBe(true);
  });

  it('silently skips posts belonging to somebody else', async () => {
    const ownerToken = await signedInAs(owner);
    const mine = await createPost(ownerToken);

    const strangerToken = await signedInAs(stranger);
    const theirs = await createPost(strangerToken);

    const response = await request(app)
      .post('/api/posts/bulk')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ ids: [mine, theirs], action: 'delete' });

    expect(response.body.affected).toBe(1);
    expect(await Post.findById(mine)).toBeNull();
    expect(await Post.findById(theirs)).not.toBeNull();
  });

  it('rejects an action it does not know', async () => {
    const token = await signedInAs(owner);
    const response = await request(app)
      .post('/api/posts/bulk')
      .set('Authorization', `Bearer ${token}`)
      .send({ ids: [await createPost(token)], action: 'archive' });

    expect(response.status).toBe(400);
  });
});

describe('tags', () => {
  it('creates tags on a post and reuses them case-insensitively', async () => {
    const token = await signedInAs(owner);
    await createPost(token, { title: 'First', tags: ['React', 'Testing'] });
    await createPost(token, { title: 'Second', tags: ['react'] });

    // "React" and "react" must be the same tag, not two.
    expect(await Tag.countDocuments()).toBe(2);

    const reactTag = await Tag.findOne({ name: 'react' });
    expect(reactTag.posts).toHaveLength(2);
  });

  it('caps the number of tags a story may carry', async () => {
    const token = await signedInAs(owner);
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Too many', content: 'Body.', tags: ['a', 'b', 'c', 'd', 'e', 'f'] });

    expect(response.status).toBe(400);
  });

  it('leaves tags alone on an update that does not mention them', async () => {
    const token = await signedInAs(owner);
    const id = await createPost(token, { tags: ['keep-me'] });

    await request(app)
      .put(`/api/posts/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Retitled' })
      .expect(200);

    const post = await Post.findById(id).populate('tags', 'name');
    expect(post.tags.map((tag) => tag.name)).toEqual(['keep-me']);
  });
});

describe('PUT /api/auth/password', () => {
  it('changes the password and invalidates existing sessions', async () => {
    const token = await signedInAs(owner);

    const response = await request(app)
      .put('/api/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: owner.password,
        newPassword: 'a-brand-new-passphrase',
        confirmPassword: 'a-brand-new-passphrase',
      });
    expect(response.status).toBe(200);

    // The token that made the change is itself revoked.
    const afterChange = await request(app)
      .get('/api/users/getUser')
      .set('Authorization', `Bearer ${token}`);
    expect(afterChange.status).toBe(401);

    const withNew = await request(app)
      .post('/api/auth/signin')
      .send({ credential: owner.email, password: 'a-brand-new-passphrase' });
    expect(withNew.status).toBe(200);
  });

  it('refuses when the current password is wrong', async () => {
    const token = await signedInAs(owner);

    const response = await request(app)
      .put('/api/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'not-the-password',
        newPassword: 'a-brand-new-passphrase',
        confirmPassword: 'a-brand-new-passphrase',
      });

    expect(response.status).toBe(401);
  });
});

describe('DELETE /api/users/me', () => {
  it('removes the account and the content belonging to it', async () => {
    const token = await signedInAs(owner);
    const postId = await createPost(token, { visibility: 'public' });

    const response = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: owner.password });

    expect(response.status).toBe(200);
    expect(await User.findOne({ email: owner.email })).toBeNull();
    expect(await Post.findById(postId)).toBeNull();
  });

  it('refuses without the correct password', async () => {
    const token = await signedInAs(owner);

    const response = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'wrong' });

    expect(response.status).toBe(401);
    expect(await User.findOne({ email: owner.email })).not.toBeNull();
  });
});

describe('GET /api/analytics/me', () => {
  it('returns the caller’s own figures without being given an id', async () => {
    const token = await signedInAs(owner);
    await createPost(token, { visibility: 'public' });

    const response = await request(app)
      .get('/api/analytics/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    // Shape the dashboard reads: { success, data: { postsAnalytics, ... } }
    expect(response.body.success).toBe(true);
    expect(response.body.data.totalPosts).toBe(1);
    expect(Array.isArray(response.body.data.postsAnalytics)).toBe(true);
  });
});
