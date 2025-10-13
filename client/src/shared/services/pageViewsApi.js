import { API_BASE_URL } from './config';
import { createApiInstance } from './axiosInstance';

const api = createApiInstance(API_BASE_URL);

// Record a page view
export const recordPageView = async (postId) => {
  const response = await api.post(
    `${API_BASE_URL}/page-views`,
    { postId },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    },
  );
  return response;
};

// Get page views for a post
export const getPostPageViews = async (postId) => {
  const response = await api.get(`${API_BASE_URL}/page-views/post/${postId}`);
  return response;
};

// Get page view count for a post
export const getPostPageViewCount = async (postId) => {
  const response = await api.get(`${API_BASE_URL}/page-views/post/${postId}/count`);
  return response;
};
