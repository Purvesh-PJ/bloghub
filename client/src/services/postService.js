import api from '../config/api';

export const postService = {
  // Returns the envelope { success, message, data, pagination }.
  getPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Moderation view: includes drafts and private posts. Requires an admin token; the
  // server ignores the flag for anyone else.
  getAllPosts: async (params = {}) => {
    const response = await api.get('/posts', { params: { ...params, all: 'true' } });
    return response.data;
  },

  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};
