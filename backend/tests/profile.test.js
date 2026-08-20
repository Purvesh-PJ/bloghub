const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');

/*
  The public profile page.

  The client has routed `/user/:userId` from every author byline, the account menu and the
  admin console since the beginning, and nothing served it. The page called the token-scoped
  `GET /users/getUser`, so it rendered the *viewer's* account for every writer on the site and
  answered 401 for a signed-out reader clicking a byline.
*/

const author = {
  username: 'profile_author',
  email: 'profile-author@example.com',
  password: 'correct-horse-battery',
  confirmPassword: 'correct-horse-battery',
};

const reader = { ...author, username: 'profile_reader', email: 'profile-reader@example.com' };

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
    .send({ title: 'A story', content: 'Body text.', visibility: 'public', ...overrides });
  return body.postId;
};

const idOf = async (username) => (await User.findOne({ username }).select('_id').lean())._id;

describe('GET /api/users/:id/profile', () => {
  it('serves a writer’s page to a signed-out reader', async () => {
    await signedInAs(author);
    const authorId = await idOf(author.username);

    const response = await request(app).get(`/api/users/${authorId}/profile`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.username).toBe(author.username);
    expect(response.body.data.counts).toEqual({ posts: 0, followers: 0, following: 0 });
  });

  it('counts only published stories, not drafts and private ones', async () => {
    const token = await signedInAs(author);
    await createPost(token, { title: 'Published' });
    await createPost(token, { title: 'A draft', visibility: 'draft' });
    await createPost(token, { title: 'Private one', visibility: 'private' });

    const authorId = await idOf(author.username);
    const response = await request(app).get(`/api/users/${authorId}/profile`);

    expect(response.body.data.counts.posts).toBe(1);
  });

  it('withholds the email unless the account chose to show it', async () => {
    const token = await signedInAs(author);
    const authorId = await idOf(author.username);

    const hidden = await request(app).get(`/api/users/${authorId}/profile`);
    expect(hidden.body.data.email).toBeUndefined();

    await request(app)
      .put('/api/settings/privacy')
      .set('Authorization', `Bearer ${token}`)
      .send({ privacySettings: { showEmail: true, showActivity: true } });

    const shown = await request(app).get(`/api/users/${authorId}/profile`);
    expect(shown.body.data.email).toBe(author.email);
  });

  it('never returns the password hash', async () => {
    await signedInAs(author);
    const authorId = await idOf(author.username);

    const response = await request(app).get(`/api/users/${authorId}/profile`);

    expect(JSON.stringify(response.body)).not.toMatch(/\$2[aby]\$/);
    expect(response.body.data.password).toBeUndefined();
  });

  it('carries the bio the account saved in settings', async () => {
    const token = await signedInAs(author);
    await request(app)
      .put('/api/settings/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: 'Writes about databases.', location: 'Pune' });

    const authorId = await idOf(author.username);
    const response = await request(app).get(`/api/users/${authorId}/profile`);

    expect(response.body.data.bio).toBe('Writes about databases.');
    expect(response.body.data.location).toBe('Pune');
  });

  it('answers 400 for a malformed id and 404 for an unknown one', async () => {
    const malformed = await request(app).get('/api/users/not-an-id/profile');
    expect(malformed.status).toBe(400);

    const unknown = await request(app).get('/api/users/507f1f77bcf86cd799439011/profile');
    expect(unknown.status).toBe(404);
  });

  it('does not shadow the literal /users/getUser* routes', async () => {
    const token = await signedInAs(author);

    // `/:id/profile` is two segments and these are one, but the ordering is worth pinning:
    // a regression here would send an authenticated request to the public handler.
    const self = await request(app)
      .get('/api/users/getUser')
      .set('Authorization', `Bearer ${token}`);

    expect(self.status).toBe(200);
    expect(self.body.User.username).toBe(author.username);
  });
});

describe('GET /api/users/:id/avatar', () => {
  /*
    A one-pixel PNG. Enough to exercise storage, the content type and the caching contract
    without carrying a fixture file around.
  */
  const PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  );

  const uploadAvatar = async (token) =>
    request(app)
      .put('/api/users/setUser')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', PNG, { filename: 'avatar.png', contentType: 'image/png' });

  it('serves the image to anyone, with its real content type', async () => {
    const token = await signedInAs(author);
    expect((await uploadAvatar(token)).status).toBe(200);

    const authorId = await idOf(author.username);
    const response = await request(app).get(`/api/users/${authorId}/avatar`);

    // Public on purpose: an <img> tag cannot send an Authorization header, and the avatar
    // appears on every byline.
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/image\/png/);
    // Read off the header: supertest only fills `body` for parseable types, and this is bytes.
    expect(Number(response.headers['content-length'])).toBe(PNG.length);
  });

  it('is cacheable, and answers 304 when the browser already has it', async () => {
    const token = await signedInAs(author);
    await uploadAvatar(token);
    const authorId = await idOf(author.username);

    const first = await request(app).get(`/api/users/${authorId}/avatar`);
    expect(first.headers['cache-control']).toMatch(/public/);
    expect(first.headers.etag).toBeDefined();

    const second = await request(app)
      .get(`/api/users/${authorId}/avatar`)
      .set('If-None-Match', first.headers.etag);

    // The point of the whole change: a repeat visit costs a header exchange, not the image.
    expect(second.status).toBe(304);
    expect(second.body).toEqual({});
  });

  it('changes its tag when the picture changes', async () => {
    const token = await signedInAs(author);
    await uploadAvatar(token);
    const authorId = await idOf(author.username);

    const before = (await request(app).get(`/api/users/${authorId}/avatar`)).headers.etag;

    // A second upload writes the profile again, moving its updatedAt.
    await new Promise((resolve) => setTimeout(resolve, 10));
    await uploadAvatar(token);

    const after = (await request(app).get(`/api/users/${authorId}/avatar`)).headers.etag;
    expect(after).not.toBe(before);
  });

  it('answers 404 for an account that has never uploaded one', async () => {
    await signedInAs(author);
    const authorId = await idOf(author.username);

    const response = await request(app).get(`/api/users/${authorId}/avatar`);
    expect(response.status).toBe(404);
  });
});

describe('avatars are no longer embedded in JSON', () => {
  it('getUser reports that one exists without carrying its bytes', async () => {
    const token = await signedInAs(author);
    const PNG = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );
    await request(app)
      .put('/api/users/setUser')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', PNG, { filename: 'avatar.png', contentType: 'image/png' });

    const response = await request(app)
      .get('/api/users/getUser')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.User.profile.hasAvatar).toBe(true);
    expect(response.body.User.profile.avatarUpdatedAt).toBeDefined();
    /*
      The header calls this on every page. Base64 in here meant ~2.7 MB of JSON for a 2 MB
      picture, on every cold load, in a response nothing could cache.
    */
    expect(JSON.stringify(response.body)).not.toMatch(/data:image/);
    expect(response.body.User.profile.image).toBeUndefined();
  });

  it('the public profile does the same', async () => {
    await signedInAs(author);
    const authorId = await idOf(author.username);

    const response = await request(app).get(`/api/users/${authorId}/profile`);

    expect(response.body.data.hasAvatar).toBe(false);
    expect(JSON.stringify(response.body)).not.toMatch(/data:image/);
  });
});

describe('GET /api/posts?author=', () => {
  it('returns one author’s published stories, paginated on the server', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);

    await createPost(authorToken, { title: 'Mine one' });
    await createPost(authorToken, { title: 'Mine two' });
    await createPost(readerToken, { title: 'Somebody else’s' });

    const authorId = await idOf(author.username);
    const response = await request(app).get(`/api/posts?author=${authorId}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.pagination.total).toBe(2);
    response.body.data.forEach((post) => {
      expect(String(post.user._id)).toBe(String(authorId));
    });
  });

  it('reaches an author’s stories beyond the first page of the global feed', async () => {
    const authorToken = await signedInAs(author);
    const readerToken = await signedInAs(reader);

    await createPost(authorToken, { title: 'The one buried underneath' });
    // Enough newer posts from somebody else to push it past a default page of the feed.
    for (let i = 0; i < 25; i += 1) {
      await createPost(readerToken, { title: `Filler ${i}` });
    }

    const authorId = await idOf(author.username);
    const response = await request(app).get(`/api/posts?author=${authorId}`);

    // Filtering in the browser — which is what the profile page used to do — found nothing
    // here, because none of this author's posts fell in the first page of the whole site.
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('The one buried underneath');
  });

  it('does not expose an author’s drafts to a stranger', async () => {
    const authorToken = await signedInAs(author);
    await createPost(authorToken, { title: 'A draft', visibility: 'draft' });

    const authorId = await idOf(author.username);
    const response = await request(app).get(`/api/posts?author=${authorId}`);

    expect(response.body.data).toHaveLength(0);
  });

  it('rejects a malformed author id rather than casting it', async () => {
    const response = await request(app).get('/api/posts?author=%7B%22$ne%22:null%7D');
    expect(response.status).toBe(400);
  });
});
