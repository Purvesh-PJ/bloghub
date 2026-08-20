import api from '../config/api';

export const settingsService = {
  getUserSettings: async () => {
    const response = await api.get('/settings/user');
    return response.data;
  },

  updateUserSettings: async (settings) => {
    const response = await api.put('/settings/user', settings);
    return response.data;
  },

  getUserProfile: async (userId) => {
    const url = userId ? `/settings/profile/${userId}` : '/settings/profile';
    const response = await api.get(url);
    return response.data;
  },

  updateUserProfile: async (profileData) => {
    const response = await api.put('/settings/profile', profileData);
    return response.data;
  },

  /*
    There is deliberately no updateSecuritySettings here. `PUT /settings/security` answers 501
    — two-factor authentication is not implemented — and a wrapper for it only invites a
    screen to be built against something that cannot work.
  */

  updatePrivacySettings: async (privacyData) => {
    const response = await api.put('/settings/privacy', privacyData);
    return response.data;
  },

  updateAppearanceSettings: async (appearanceData) => {
    const response = await api.put('/settings/appearance', appearanceData);
    return response.data;
  },
};
