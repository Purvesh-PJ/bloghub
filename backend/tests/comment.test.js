const request = require('supertest');
const app = require('../index');

const author = {
  username: 'comment_author',
  email: 'comment-author@example.com',
  password: 'correct-horse-battery',
  confirmPassword: 'correct-horse-battery',
};

const reader = { ...author, username: 'comment_reader', email: 'reader@example.com' };

const signedInAs = async (account) => {
  await request(app).post('/api/auth/signup').send(account);
  const { body } = await request(app)
    .post('/api/auth/signin')
    .send({ credential: account.email, password: account.password });
  return body.data.accessToken;
};

const createPost = async (token, visibility) => {
  const { body } = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'A post', content: 'Body text.', visibility });
  return body.postId;
};

describe('comment scoping', () => {
  it('no longer exposes an unscoped list of every comment', async () => {
    const response = await request(app).get('/api/comments');
    expect(response.status).toBe(404);
  });

  it('returns only the comments belonging to the requested post', async () => {
    const token = await signedInAs(author);
    const [postA, postB] = [await createPost(token, 'public'), await createPost(token, 'public')];

    await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId: postA, message: 'On post A' });
    await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId: postB, message: 'On post B' });

    const response = await request(app).get(`/api/comments/post/${postA}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].message).toBe('On post A');
  });

  it('hides comments on a draft from everyone but its author', async () => {
    const authorToken = await signedInAs(author);
    const postId = await createPost(authorToken, 'draft');
    await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ postId, message: 'Private note' });

    const anonymous = await request(app).get(`/api/comments/post/${postId}`);
    expect(anonymous.status).toBe(404);

    const owner = await request(app)
      .get(`/api/comments/post/${postId}`)
      .set('Authorization', `Bearer ${authorToken}`);
    expect(owner.status).toBe(200);
    expect(owner.body.data).toHaveLength(1);
  });

  it('rejects a comment longer than the limit', async () => {
    const token = await signedInAs(author);
    const postId = await createPost(token, 'public');

    const response = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId, message: 'x'.repeat(5001) });

    expect(response.status).toBe(400);
  });
});

describe('DELETE /api/comments/:id', () => {
  it('lets the post author remove a comment on their post', async () => {
    const authorToken = await signedInAs(author);
    const postId = await createPost(authorToken, 'public');

    const readerToken = await signedInAs(reader);
    const created = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ postId, message: 'Reader comment' });

    const response = await request(app)
      .delete(`/api/comments/${created.body.comment._id}`)
      .set('Authorization', `Bearer ${authorToken}`);

    expect(response.status).toBe(200);
    const remaining = await request(app).get(`/api/comments/post/${postId}`);
    expect(remaining.body.data).toHaveLength(0);
  });

  it('refuses an unrelated user', async () => {
    const authorToken = await signedInAs(author);
    const postId = await createPost(authorToken, 'public');
    const created = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ postId, message: 'Author comment' });

    const strangerToken = await signedInAs(reader);
    const response = await request(app)
      .delete(`/api/comments/${created.body.comment._id}`)
      .set('Authorization', `Bearer ${strangerToken}`);

    expect(response.status).toBe(403);
  });
});
