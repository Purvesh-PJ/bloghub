import api from '../config/api';

export const commentService = {
  // Comments are scoped to a post. The old `GET /comments` returned every comment in the
  // database and no longer exists.
  getPostComments: async (postId, params = {}) => {
    const response = await api.get(`/comments/post/${postId}`, { params });
    return response.data;
  },

  createComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  replyToComment: async (userId, repliedCommentId, message) => {
    const response = await api.post('/comments/replies', {
      userId,
      repliedCommentId,
      message,
    });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};
