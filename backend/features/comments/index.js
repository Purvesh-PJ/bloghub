const commentRoutes = require('./comment.routes');
const CommentController = require('./comment.controllers');
const CommentService = require('./comment.service');
const Comment = require('./comment.model');

module.exports = {
  commentRoutes,
  CommentController,
  CommentService,
  Comment,
};
