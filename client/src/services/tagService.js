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
};
