import { API_BASE_URL } from './config';
import { createApiInstance } from './axiosInstance';

const api = createApiInstance(API_BASE_URL);

// Get all user activity (admin only)
export const getAllUserActivity = async (page = 1, limit = 10) => {
  const response = await api.get(`${API_BASE_URL}/user-activity/all?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};

// Get activity for a specific user
export const getUserActivity = async (userId, page = 1, limit = 10) => {
  const response = await api.get(
    `${API_BASE_URL}/user-activity/user/${userId}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    },
  );
  return response;
};

// Get timeline for a specific user
export const getUserTimeline = async (userId) => {
  const response = await api.get(`${API_BASE_URL}/user-activity/timeline/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};

// Get moderation log (admin only)
export const getModerationLog = async (page = 1, limit = 20) => {
  const response = await api.get(
    `${API_BASE_URL}/user-activity/moderation-log?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    },
  );
  return response;
};
