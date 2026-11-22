const commentRoutes = require('./comment.routes');
const CommentController = require('./comment.controllers');
const CommentService = require('./comment.service');
const Comment = require('./comment.model');
const commentValidators = require('./comment.validators');

module.exports = {
  commentRoutes,
  CommentController,
  CommentService,
  Comment,
  commentValidators,
};
