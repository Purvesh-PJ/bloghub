import { API_BASE_URL } from './config';
import { createApiInstance } from './axiosInstance';

const api = createApiInstance(API_BASE_URL);

// Get user settings
export const getUserSettings = async () => {
  const response = await api.get(`${API_BASE_URL}/settings/user`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};

// Update user settings
export const updateUserSettings = async (settingsData) => {
  const response = await api.put(`${API_BASE_URL}/settings/user`, settingsData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};

// Get user profile
export const getUserProfile = async (userId) => {
  const url = userId
    ? `${API_BASE_URL}/settings/profile/${userId}`
    : `${API_BASE_URL}/settings/profile`;

  const response = await api.get(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const response = await api.put(`${API_BASE_URL}/settings/profile`, profileData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};

// Update security settings
export const updateSecuritySettings = async (securityData) => {
  const response = await api.put(`${API_BASE_URL}/settings/security`, securityData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};

// Update privacy settings
export const updatePrivacySettings = async (privacyData) => {
  const response = await api.put(`${API_BASE_URL}/settings/privacy`, privacyData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};

// Update appearance settings
export const updateAppearanceSettings = async (appearanceData) => {
  const response = await api.put(`${API_BASE_URL}/settings/appearance`, appearanceData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};
