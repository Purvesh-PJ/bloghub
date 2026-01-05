import api from '../config/api';

export const userService = {
  getUser: async () => {
    const response = await api.get('/users/getUser');
    return response.data;
  },

  updateUser: async (formData) => {
    const response = await api.put('/users/setUser', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getUserPosts: async () => {
    const response = await api.get('/users/getUserPosts');
    return response.data;
  },

  getUserProfile: async () => {
    const response = await api.get('/users/getUserProfile');
    return response.data;
  },

  followUser: async (toFollowId) => {
    const response = await api.post('/users/followUser', { toFollowId });
    return response.data;
  },

  unfollowUser: async (toUnfollowId) => {
    const response = await api.post('/users/unfollowUser', { toUnfollowId });
    return response.data;
  },

  isFollowing: async (userId) => {
    const response = await api.get(`/users/isFollowing/${userId}`);
    return response.data;
  },
};
