const request = require('supertest');
const app = require('../index');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');

/*
  Likes, replies and following — the three things a reader can do to somebody else's story.

  None of them had a test before, and each carried a defect that only shows up with two
  actors or two concurrent requests: a duplicate like reported as a 500, a reply returned
  twice by the listing that renders it, and a follow that could be counted twice.
*/

const author = {
  username: 'social_author',
  email: 'social-author@example.com',
  password: 'correct-horse-battery',
  confirmPassword: 'correct-horse-battery',
};

const reader = { ...author, username: 'social_reader', email: 'social-reader@example.com' };
const other = { ...author, username: 'social_other', email: 'social-other@example.com' };

const signedInAs = async (account) => {
  await request(app).post('/api/auth/signup').send(account);
  const { body } = await request(app)
    .post('/api/auth/signin')
    .send({ credential: account.email, password: account.password });
  return body.data.accessToken;
};

const createPost = async (token, visibility = 'public') => {
  const { body } = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'A social story', content: 'Body text.', visibility });
  return body.postId;
};

const idOf = async (username) => (await User.findOne({ username }).select('_id').lean())._id;

describe('likes', () => {
  it('records a like and reports it in the post’s like list', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const postId = await createPost(authorToken);

    const liked = await request(app)
      .post('/api/likes')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ postId });

    expect(liked.status).toBe(201);
    expect(liked.body.success).toBe(true);

    const list = await request(app).get(`/api/likes/post/${postId}`);
    expect(list.status).toBe(200);
    // Wrapped in the same envelope as everything else; it used to answer with a bare array.
    expect(list.body.success).toBe(true);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.data[0].user.username).toBe(reader.username);
  });

  it('answers 409, not 500, when the same reader likes twice', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const postId = await createPost(authorToken);

    await request(app)
      .post('/api/likes')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ postId });

    const again = await request(app)
      .post('/api/likes')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ postId });

    expect(again.status).toBe(409);
    expect(again.body.success).toBe(false);
    // The message must reach the client where it looks for it, not as a bare `{ error }`.
    expect(again.body.message).toMatch(/already liked/i);
  });

  it('survives two simultaneous likes without a duplicate row', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const postId = await createPost(authorToken);

    // The findOne-then-create this replaced could be passed by both requests before either
    // wrote, leaving two rows or a 500. The unique index decides it now.
    const results = await Promise.all([
      request(app)
        .post('/api/likes')
        .set('Authorization', `Bearer ${readerToken}`)
        .send({ postId }),
      request(app)
        .post('/api/likes')
        .set('Authorization', `Bearer ${readerToken}`)
        .send({ postId }),
    ]);

    const statuses = results.map((r) => r.status).sort();
    expect(statuses).toEqual([201, 409]);

    const list = await request(app).get(`/api/likes/post/${postId}`);
    expect(list.body.data).toHaveLength(1);
  });

  it('unlikes, and reports 404 when there was nothing to unlike', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const postId = await createPost(authorToken);

    await request(app)
      .post('/api/likes')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ postId });

    const removed = await request(app)
      .delete(`/api/likes/post/${postId}`)
      .set('Authorization', `Bearer ${readerToken}`);
    expect(removed.status).toBe(200);

    const again = await request(app)
      .delete(`/api/likes/post/${postId}`)
      .set('Authorization', `Bearer ${readerToken}`);
    expect(again.status).toBe(404);
  });

  it('hides the likes on a draft from everyone but its author', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const draftId = await createPost(authorToken, 'draft');

    const anonymous = await request(app).get(`/api/likes/post/${draftId}`);
    expect(anonymous.status).toBe(404);

    const stranger = await request(app)
      .get(`/api/likes/post/${draftId}`)
      .set('Authorization', `Bearer ${readerToken}`);
    expect(stranger.status).toBe(404);

    const owner = await request(app)
      .get(`/api/likes/post/${draftId}`)
      .set('Authorization', `Bearer ${authorToken}`);
    expect(owner.status).toBe(200);
  });

  it('refuses to like a story the caller cannot read', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const draftId = await createPost(authorToken, 'draft');

    const response = await request(app)
      .post('/api/likes')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ postId: draftId });

    expect(response.status).toBe(404);
  });
});

describe('replies', () => {
  const commentOn = async (token, postId, message) => {
    const { body } = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId, message });
    return body.comment._id;
  };

  it('returns a reply nested under its parent and not also as a top-level comment', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const postId = await createPost(authorToken);

    const parentId = await commentOn(readerToken, postId, 'The original comment');

    const replied = await request(app)
      .post('/api/comments/replies')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ repliedCommentId: parentId, message: 'The reply' });
    expect(replied.status).toBe(201);

    const listing = await request(app).get(`/api/comments/post/${postId}`);

    // One thread, not two. A reply carries its parent's `post`, so before `parent` existed
    // the same reply came back nested *and* as a top-level comment of its own.
    expect(listing.body.data).toHaveLength(1);
    expect(listing.body.pagination.total).toBe(1);
    expect(listing.body.data[0].message).toBe('The original comment');
    expect(listing.body.data[0].replies).toHaveLength(1);
    expect(listing.body.data[0].replies[0].message).toBe('The reply');
  });

  it('records the parent on the reply itself', async () => {
    const authorToken = await signedInAs(author);
    const postId = await createPost(authorToken);
    const parentId = await commentOn(authorToken, postId, 'Parent');

    await request(app)
      .post('/api/comments/replies')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ repliedCommentId: parentId, message: 'Child' });

    const reply = await Comment.findOne({ message: 'Child' }).lean();
    expect(String(reply.parent)).toBe(String(parentId));
    // It still carries the post, which is what makes post-scoped queries reach it at all.
    expect(String(reply.post)).toBe(String(postId));
  });

  it('deletes a parent’s replies along with it', async () => {
    const authorToken = await signedInAs(author);
    const postId = await createPost(authorToken);
    const parentId = await commentOn(authorToken, postId, 'Parent');

    await request(app)
      .post('/api/comments/replies')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ repliedCommentId: parentId, message: 'Child' });

    await request(app)
      .delete(`/api/comments/${parentId}`)
      .set('Authorization', `Bearer ${authorToken}`);

    expect(await Comment.countDocuments({ post: postId })).toBe(0);
  });

  it('detaches a deleted reply from its parent’s count', async () => {
    const authorToken = await signedInAs(author);
    const postId = await createPost(authorToken);
    const parentId = await commentOn(authorToken, postId, 'Parent');

    const { body } = await request(app)
      .post('/api/comments/replies')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ repliedCommentId: parentId, message: 'Child' });

    await request(app)
      .delete(`/api/comments/${body.comment._id}`)
      .set('Authorization', `Bearer ${authorToken}`);

    const parent = await Comment.findById(parentId).lean();
    expect(parent.replies).toHaveLength(0);
    expect(parent.replyCount).toBe(0);
  });
});

describe('following', () => {
  it('follows, reports the state back, and unfollows', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const authorId = await idOf(author.username);

    const followed = await request(app)
      .post('/api/users/followUser')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ toFollowId: String(authorId) });
    expect(followed.status).toBe(200);

    const state = await request(app)
      .get(`/api/users/isFollowing/${authorId}`)
      .set('Authorization', `Bearer ${readerToken}`);
    expect(state.body.isFollowing).toBe(true);

    await request(app)
      .post('/api/users/unfollowUser')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ toUnfollowId: String(authorId) });

    const after = await request(app)
      .get(`/api/users/isFollowing/${authorId}`)
      .set('Authorization', `Bearer ${readerToken}`);
    expect(after.body.isFollowing).toBe(false);

    // The author's own token is unused beyond registering the account.
    expect(authorToken).toEqual(expect.any(String));
  });

  it('counts a repeated follow once', async () => {
    await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const authorId = await idOf(author.username);

    await request(app)
      .post('/api/users/followUser')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ toFollowId: String(authorId) });

    await request(app)
      .post('/api/users/followUser')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ toFollowId: String(authorId) });

    const profile = await request(app).get(`/api/users/${authorId}/profile`);
    expect(profile.body.data.counts.followers).toBe(1);
  });

  it('refuses to let somebody follow themselves', async () => {
    const readerToken = await signedInAs(reader);
    const readerId = await idOf(reader.username);

    const response = await request(app)
      .post('/api/users/followUser')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ toFollowId: String(readerId) });

    expect(response.status).toBe(400);
  });

  it('does not drive the follower count below zero on a repeated unfollow', async () => {
    await signedInAs(author);
    const readerToken = await signedInAs(reader);
    const otherToken = await signedInAs(other);
    const authorId = await idOf(author.username);

    await request(app)
      .post('/api/users/followUser')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ toFollowId: String(authorId) });

    await request(app)
      .post('/api/users/unfollowUser')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ toUnfollowId: String(authorId) });

    // Somebody who never followed in the first place.
    await request(app)
      .post('/api/users/unfollowUser')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ toUnfollowId: String(authorId) });

    const profile = await request(app).get(`/api/users/${authorId}/profile`);
    expect(profile.body.data.counts.followers).toBe(0);
  });
});
