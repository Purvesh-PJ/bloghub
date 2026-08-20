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

  /**
   * Who liked a post.
   *
   * Not currently rendered anywhere — the action bar counts likes from the post itself. Kept
   * because the endpoint is the only way to answer "who", and it applies the same visibility
   * rule as the post it belongs to.
   */
  getPostLikes: async (postId) => {
    const response = await api.get(`/likes/post/${postId}`);
    return response.data;
  },
};
