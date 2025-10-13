import { API_SEARCH_URL } from './config';
import { createApiInstance } from './axiosInstance';

const api = createApiInstance(API_SEARCH_URL);

export const getSearchResults = async (query) => {
  try {
    const q = encodeURIComponent(query);
    const response = await api.get(`/${q}`);
    return response;
  } catch (error) {
    throw error;
  }
};
