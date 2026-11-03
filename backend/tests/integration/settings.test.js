const request = require('supertest');
const app = require('../../index');
const UserProfile = require('../../models/user-profile.model');

const userAccount = {
  username: 'settings_user',
  email: 'settings_user@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!',
};

const otherAccount = {
  username: 'settings_other',
  email: 'settings_other@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!',
};

const signedInAs = async (account) => {
  await request(app).post('/api/auth/signup').send(account);
  const { body } = await request(app)
    .post('/api/auth/signin')
    .send({ credential: account.email, password: account.password });
  return body.data.accessToken;
};

describe('Settings API (/api/settings)', () => {
  let token;
  let otherToken;

  beforeEach(async () => {
    token = await signedInAs(userAccount);
    otherToken = await signedInAs(otherAccount);
  });

  describe('GET & PUT /api/settings/user', () => {
    it('creates and returns default user settings on first read', async () => {
      const response = await request(app)
        .get('/api/settings/user')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.theme).toBeDefined();
    });

    it('updates user settings with partial values', async () => {
      const updatePayload = {
        theme: 'dark',
        emailNotifications: false,
      };

      const response = await request(app)
        .put('/api/settings/user')
        .set('Authorization', `Bearer ${token}`)
        .send(updatePayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.theme).toBe('dark');
      expect(response.body.data.emailNotifications).toBe(false);
    });
  });

  describe('Profile Settings', () => {
    it('returns 404 when profile record does not exist for user', async () => {
      // Remove profile created during signup to test the 404 branch
      await UserProfile.deleteMany({});

      const response = await request(app)
        .get('/api/settings/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('ProfileNotFound');
    });

    it('upserts and retrieves user profile details', async () => {
      const profileData = {
        fullName: 'Jane Doe',
        bio: 'Tech lead and full-stack engineer',
        location: 'San Francisco, CA',
        website: 'https://janedoe.dev',
      };

      const putRes = await request(app)
        .put('/api/settings/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(profileData);

      expect(putRes.status).toBe(200);
      expect(putRes.body.data.fullName).toBe(profileData.fullName);
      expect(putRes.body.data.website).toBe(profileData.website);

      const getRes = await request(app)
        .get('/api/settings/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.fullName).toBe('Jane Doe');
      expect(getRes.body.data.user.email).toBe(userAccount.email);
    });
  });

  describe('PUT /api/settings/security', () => {
    it('returns 501 NotImplemented for 2FA stub', async () => {
      const response = await request(app)
        .put('/api/settings/security')
        .set('Authorization', `Bearer ${token}`)
        .send({ twoFactorEnabled: true });

      expect(response.status).toBe(501);
      expect(response.body.error).toBe('NotImplemented');
    });
  });

  describe('PUT /api/settings/privacy', () => {
    it('updates privacy preferences', async () => {
      const response = await request(app)
        .put('/api/settings/privacy')
        .set('Authorization', `Bearer ${token}`)
        .send({
          privacySettings: {
            showEmail: true,
            showActivity: false,
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.privacySettings.showEmail).toBe(true);
      expect(response.body.data.privacySettings.showActivity).toBe(false);
    });
  });

  describe('PUT /api/settings/appearance', () => {
    it('updates appearance settings such as theme and font size', async () => {
      const response = await request(app)
        .put('/api/settings/appearance')
        .set('Authorization', `Bearer ${token}`)
        .send({
          theme: 'system',
          fontSize: 'lg',
          colorScheme: 'indigo',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.theme).toBe('system');
      expect(response.body.data.appearance.fontSize).toBe('lg');
      expect(response.body.data.appearance.colorScheme).toBe('indigo');
    });
  });
});
