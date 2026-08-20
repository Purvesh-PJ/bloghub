import api from '../config/api';

export const tagService = {
  getTags: async () => {
    const response = await api.get('/tags');
    return response.data;
  },

  createTag: async (name) => {
    const response = await api.post('/tags', { name });
    return response.data;
  },

  // Administrators only, and refused with a 409 while stories still carry the tag.
  deleteTag: async (id) => {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
  },
};
