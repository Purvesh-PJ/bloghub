import { API_BASE_URL } from './config';
import { createApiInstance } from './axiosInstance';

const api = createApiInstance(API_BASE_URL);

// Like a post
export const likePost = async (postId) => {
  const response = await api.post(
    `${API_BASE_URL}/likes`,
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

// Unlike a post
export const unlikePost = async (postId) => {
  const response = await api.delete(`${API_BASE_URL}/likes/post/${postId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response;
};

// Get all likes for a post
export const getPostLikes = async (postId) => {
  const response = await api.get(`${API_BASE_URL}/likes/post/${postId}`);
  return response;
};

// Check if user has liked a post
export const checkUserLiked = async (postId) => {
  try {
    const response = await api.get(`${API_BASE_URL}/likes/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    // Check if user's ID is in the likes list
    const userId = JSON.parse(localStorage.getItem('userData'))?._id;
    if (!userId) return { data: { userLiked: false } };

    const userLiked = response.data.some((like) => like.user._id === userId);
    return { data: { userLiked } };
  } catch (error) {
    console.error('Error checking if user liked post:', error);
    return { data: { userLiked: false } };
  }
};
