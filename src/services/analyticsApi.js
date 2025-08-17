import { API_BASE_URL } from './config';
import { createApiInstance } from './axiosInstance';

const api = createApiInstance(API_BASE_URL);

// Get analytics for a specific post
export const getPostAnalytics = async (postId) => {
  const response = await api.get(`${API_BASE_URL}/analytics/post/${postId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  return response;
};

// Get analytics for a specific user
export const getUserAnalytics = async (userId) => {
  const response = await api.get(`${API_BASE_URL}/analytics/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  return response;
};

// Get admin analytics (overall site analytics)
export const getAdminAnalytics = async () => {
  const response = await api.get(`${API_BASE_URL}/analytics/admin`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  return response;
};

// Track a page view
export const trackPageView = async (postId) => {
  const response = await api.post(`${API_BASE_URL}/analytics/view/${postId}`, {}, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  return response;
};

// Track a post read
export const trackPostRead = async (postId) => {
  const response = await api.post(`${API_BASE_URL}/analytics/read/${postId}`, {}, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  return response;
};
