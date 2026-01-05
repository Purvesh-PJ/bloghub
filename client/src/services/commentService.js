import api from '../config/api';

export const commentService = {
  getComments: async () => {
    const response = await api.get('/comments');
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
};
