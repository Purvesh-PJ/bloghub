import api from '../config/api';

export const analyticsService = {
  getPostAnalytics: async (postId) => {
    const response = await api.get(`/analytics/post/${postId}`);
    return response.data;
  },

  getUserAnalytics: async (userId) => {
    const response = await api.get(`/analytics/user/${userId}`);
    return response.data;
  },

  getAdminAnalytics: async () => {
    const response = await api.get('/analytics/admin');
    return response.data;
  },

  trackPageView: async (postId) => {
    const response = await api.post(`/analytics/view/${postId}`);
    return response.data;
  },

  trackPostRead: async (postId) => {
    const response = await api.post(`/analytics/read/${postId}`);
    return response.data;
  },

  getPageViewCount: async (postId) => {
    const response = await api.get(`/page-views/post/${postId}/count`);
    return response.data;
  },
};
