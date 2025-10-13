import { API_POST_URL } from './config';
import { createApiInstance } from './axiosInstance';

const api = createApiInstance(API_POST_URL);

export const getPosts = async () => {
  const response = await api.get(`${API_POST_URL}`);
  return response;
};

export const getSinglePost = async (id) => {
  const response = await api.get(`${API_POST_URL}/${id}`);
  return response;
};

export const addPost = async (dataToBePost) => {
  const response = await api.post(`${API_POST_URL}`, dataToBePost, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};

export const updatePost = async (dataToUpdate, postId) => {
  const response = await api.put(`${API_POST_URL}/${postId}`, dataToUpdate, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`${API_POST_URL}/${postId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};
