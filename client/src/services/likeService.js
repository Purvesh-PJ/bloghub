import api from '../config/api';

export const likeService = {
  likePost: async (postId) => {
    const response = await api.post('/likes', { postId });
    return response.data;
  },

  unlikePost: async (postId) => {
    const response = await api.delete(`/likes/post/${postId}`);
    return response.data;
  },

  getPostLikes: async (postId) => {
    const response = await api.get(`/likes/post/${postId}`);
    return response.data;
  },

  getLike: async (id) => {
    const response = await api.get(`/likes/${id}`);
    return response.data;
  },
};
