const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const View = require('../models/view.model');
const Read = require('../models/read.model');
const Like = require('../models/like.model');

const author = {
  username: 'trend_author',
  email: 'trend@example.com',
  password: 'correct-horse-battery',
  confirmPassword: 'correct-horse-battery',
};

const signIn = async () => {
  await request(app).post('/api/auth/signup').send(author);
  const { body } = await request(app)
    .post('/api/auth/signin')
    .send({ credential: author.email, password: author.password });
  return body.data.accessToken;
};

const makePost = async (token, title) => {
  const { body } = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({ title, content: 'Body text.', visibility: 'public' });
  return body.postId;
};

/** Writes engagement rows directly, so a scenario can be set up exactly. */
const engage = async (postId, { views = 0, reads = 0, likes = 0, daysAgo = 0 } = {}) => {
  const at = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const rows = (Model, n) =>
    Model.insertMany(
      Array.from({ length: n }, (_, i) => ({
        post: postId,
        visitorKey: `a:${postId}-${i}`,
        createdAt: at,
      })),
    );

  if (views) await rows(View, views);
  if (reads) await rows(Read, reads);
  if (likes) {
    // Likes are unique per (post, user), so each needs its own account.
    const users = await User.insertMany(
      Array.from({ length: likes }, (_, i) => ({
        username: `liker_${postId}_${i}`,
        email: `liker_${postId}_${i}@example.com`,
        password: 'x',
      })),
    );
    await Like.insertMany(users.map((u) => ({ post: postId, user: u._id, createdAt: at })));
  }
};

const titlesOf = (body) => body.data.map((p) => p.title);

describe('GET /api/posts/trending', () => {
  it('ranks by engagement, not by how recently something was published', async () => {
    const token = await signIn();

    const quiet = await makePost(token, 'Published last, barely read');
    const busy = await makePost(token, 'Published first, widely read');

    // `busy` was created earlier in real terms, but has the engagement.
    await engage(busy, { views: 40, reads: 20, likes: 5 });
    await engage(quiet, { views: 4, reads: 0, likes: 0 });

    const response = await request(app).get('/api/posts/trending');

    expect(response.status).toBe(200);
    expect(response.body.trendedBy).toBe('engagement');
    // Newest-first ordering would have put `quiet` on top; the score does not.
    expect(titlesOf(response.body)[0]).toBe('Published first, widely read');
  });

  it('weights a finished read above a bare view', async () => {
    const token = await signIn();

    const skimmed = await makePost(token, 'Opened a lot, finished by nobody');
    const finished = await makePost(token, 'Opened less, finished by most');

    await engage(skimmed, { views: 20, reads: 0 });
    // 10 views + 8 reads = 10 + 40 = 50, beating 20 views alone.
    await engage(finished, { views: 10, reads: 8 });

    const response = await request(app).get('/api/posts/trending');
    expect(titlesOf(response.body)[0]).toBe('Opened less, finished by most');
  });

  it('ignores engagement older than the window', async () => {
    const token = await signIn();

    const stale = await makePost(token, 'Popular a year ago');
    const current = await makePost(token, 'Popular this week');

    await engage(stale, { views: 500, reads: 300, daysAgo: 400 });
    await engage(current, { views: 10, reads: 4 });

    const response = await request(app).get('/api/posts/trending');
    // The old post has no activity inside the window, so it cannot clear the view floor.
    expect(titlesOf(response.body)).toEqual(['Popular this week']);
  });

  it('does not let a single view and read outrank a genuinely read story', async () => {
    const token = await signIn();

    const noise = await makePost(token, 'One view, one finish, 100 per cent');
    const real = await makePost(token, 'Fifty views, ten finishes');

    await engage(noise, { views: 1, reads: 1 });
    await engage(real, { views: 50, reads: 10 });

    const response = await request(app).get('/api/posts/trending');
    // Below the floor, so it does not appear at all.
    expect(titlesOf(response.body)).toEqual(['Fifty views, ten finishes']);
  });

  it('says so, rather than pretending, when nothing can be ranked', async () => {
    const token = await signIn();
    await makePost(token, 'Nobody has read this');

    const response = await request(app).get('/api/posts/trending');

    expect(response.status).toBe(200);
    expect(response.body.trendedBy).toBe('latest');
    expect(titlesOf(response.body)).toEqual(['Nobody has read this']);
  });

  it('never includes drafts or private stories', async () => {
    const token = await signIn();

    const hidden = await makePost(token, 'Public for now');
    await engage(hidden, { views: 50, reads: 30 });
    await Post.updateOne({ _id: hidden }, { $set: { visibility: 'draft' } });

    const shown = await makePost(token, 'Actually public');
    await engage(shown, { views: 10, reads: 2 });

    const response = await request(app).get('/api/posts/trending');
    expect(titlesOf(response.body)).toEqual(['Actually public']);
  });

  it('reports the read rate behind each ranking', async () => {
    const token = await signIn();
    const id = await makePost(token, 'Measured');
    await engage(id, { views: 20, reads: 5 });

    const response = await request(app).get('/api/posts/trending');
    const [post] = response.body.data;

    expect(post.trending.readRate).toBe(25);
    // 20 views + (5 reads x 5) = 45
    expect(post.trending.score).toBe(45);
  });
});
