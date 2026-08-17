const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');
const Post = require('../models/post.model');

const account = (n) => ({
  username: `person_${n}`,
  email: `person${n}@example.com`,
  password: 'correct-horse-battery',
  confirmPassword: 'correct-horse-battery',
});

const signedInAs = async (who) => {
  await request(app).post('/api/auth/signup').send(who);
  const { body } = await request(app)
    .post('/api/auth/signin')
    .send({ credential: who.email, password: who.password });
  return body.data.accessToken;
};

/** Registers an account, promotes it directly, and returns a token that carries the role. */
const signedInAsAdmin = async (who) => {
  await request(app).post('/api/auth/signup').send(who);
  await User.updateOne({ email: who.email }, { $set: { roles: ['user', 'admin'] } });
  const { body } = await request(app)
    .post('/api/auth/signin')
    .send({ credential: who.email, password: who.password });
  return body.data.accessToken;
};

const admin = account('admin');
const member = account('member');
const other = account('other');

describe('PATCH /api/users/:id/suspension', () => {
  it('suspends an account and ends its sessions immediately', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const memberToken = await signedInAs(member);
    const target = await User.findOne({ email: member.email });

    // Working before.
    await request(app)
      .get('/api/users/getUser')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(200);

    const response = await request(app)
      .patch(`/api/users/${target._id}/suspension`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ suspended: true });
    expect(response.status).toBe(200);

    // The existing token stops working at once, not when it expires.
    const after = await request(app)
      .get('/api/users/getUser')
      .set('Authorization', `Bearer ${memberToken}`);
    expect(after.status).toBe(401);

    // And signing in again is refused.
    const signIn = await request(app)
      .post('/api/auth/signin')
      .send({ credential: member.email, password: member.password });
    expect(signIn.status).toBe(403);
    expect(signIn.body.error).toBe('AccountSuspended');
  });

  it('restores a suspended account', async () => {
    const adminToken = await signedInAsAdmin(admin);
    await signedInAs(member);
    const target = await User.findOne({ email: member.email });

    await request(app)
      .patch(`/api/users/${target._id}/suspension`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ suspended: true })
      .expect(200);

    await request(app)
      .patch(`/api/users/${target._id}/suspension`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ suspended: false })
      .expect(200);

    const signIn = await request(app)
      .post('/api/auth/signin')
      .send({ credential: member.email, password: member.password });
    expect(signIn.status).toBe(200);
  });

  it('refuses a non-administrator', async () => {
    const memberToken = await signedInAs(member);
    const otherToken = await signedInAs(other);
    expect(otherToken).toEqual(expect.any(String));
    const target = await User.findOne({ email: other.email });

    const response = await request(app)
      .patch(`/api/users/${target._id}/suspension`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ suspended: true });

    expect(response.status).toBe(403);
  });

  it('refuses to let an administrator suspend themselves', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const self = await User.findOne({ email: admin.email });

    const response = await request(app)
      .patch(`/api/users/${self._id}/suspension`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ suspended: true });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('CannotActOnSelf');
  });
});

describe('PATCH /api/users/:id/role', () => {
  it('promotes without requiring the promoted account to sign in again', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const memberToken = await signedInAs(member);
    const target = await User.findOne({ email: member.email });

    // Admin-only before.
    await request(app)
      .get('/api/analytics/admin')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(403);

    await request(app)
      .patch(`/api/users/${target._id}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ admin: true })
      .expect(200);

    // The same token now works: roles are read from the account on every request rather than
    // taken from the token payload, so a promotion applies at once.
    await request(app)
      .get('/api/analytics/admin')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(200);
  });

  it('demotes, and the demoted session stops being an administrator at once', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const secondToken = await signedInAsAdmin(account('second'));
    const second = await User.findOne({ email: 'personsecond@example.com' });

    await request(app)
      .get('/api/analytics/admin')
      .set('Authorization', `Bearer ${secondToken}`)
      .expect(200);

    await request(app)
      .patch(`/api/users/${second._id}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ admin: false })
      .expect(200);

    // Demotion bumps tokenVersion, so the session is rejected outright rather than merely
    // losing the role.
    const after = await request(app)
      .get('/api/analytics/admin')
      .set('Authorization', `Bearer ${secondToken}`);
    expect(after.status).toBe(401);
  });
});

describe('the last administrator', () => {
  it('cannot delete their own account from settings', async () => {
    const adminToken = await signedInAsAdmin(admin);

    const response = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ password: admin.password });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('LastAdmin');
    expect(await User.findOne({ email: admin.email })).not.toBeNull();
  });

  it('can delete their own account once somebody else administers', async () => {
    const adminToken = await signedInAsAdmin(admin);
    await signedInAs(member);
    const target = await User.findOne({ email: member.email });

    await request(app)
      .patch(`/api/users/${target._id}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ admin: true })
      .expect(200);

    await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ password: admin.password })
      .expect(200);

    expect(await User.findOne({ email: admin.email })).toBeNull();
  });
});

describe('DELETE /api/users/:id', () => {
  it('deletes the account and its stories, with the administrator’s password', async () => {
    const adminToken = await signedInAsAdmin(admin);
    const memberToken = await signedInAs(member);

    await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ title: 'Doomed', content: 'Body.', visibility: 'public' })
      .expect(201);

    const target = await User.findOne({ email: member.email });

    const response = await request(app)
      .delete(`/api/users/${target._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ password: admin.password });

    expect(response.status).toBe(200);
    expect(await User.findById(target._id)).toBeNull();
    expect(await Post.countDocuments({ user: target._id })).toBe(0);
  });

  it('refuses without the administrator’s own password', async () => {
    const adminToken = await signedInAsAdmin(admin);
    await signedInAs(member);
    const target = await User.findOne({ email: member.email });

    const response = await request(app)
      .delete(`/api/users/${target._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ password: 'not-my-password' });

    expect(response.status).toBe(401);
    expect(await User.findById(target._id)).not.toBeNull();
  });
});
