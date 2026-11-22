const commentRoutes = require('./routes/comment.routes');
const CommentController = require('./controllers/comment.controllers');
const CommentService = require('./services/comment.service');
const Comment = require('./models/comment.model');
const commentValidators = require('./validators/comment.validators');

module.exports = {
  commentRoutes,
  CommentController,
  CommentService,
  Comment,
  commentValidators,
};
