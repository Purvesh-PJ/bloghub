import api from '../config/api';

export const searchService = {
  search: async (query) => {
    const response = await api.get(`/search/${encodeURIComponent(query)}`);
    return response.data;
  },
};
