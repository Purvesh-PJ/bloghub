const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controllers');

const AuthUser = require('../middlewares/authenticateUser');
const { validate, validateObjectId } = require('../middlewares/validate');
const { commentRules, paginationRules } = require('../validators/content.validators');

// Scoped to a single post. This used to be a bare `GET /comments` that returned every comment
// in the database to anonymous callers, including comments on drafts and private posts.
router.get(
  '/post/:postId',
  validateObjectId('postId'),
  paginationRules,
  validate,
  AuthUser.attachUserIfPresent,
  CommentController.getPostComments,
);

router.post(
  '/',
  AuthUser.authenticateUser,
  validateObjectId('postId', 'body'),
  commentRules,
  validate,
  CommentController.postComments,
);

router.post(
  '/replies',
  AuthUser.authenticateUser,
  validateObjectId('repliedCommentId', 'body'),
  commentRules,
  validate,
  CommentController.postUserReplyComments,
);

// Authors may remove their own comments; administrators may remove any.
router.delete(
  '/:id',
  AuthUser.authenticateUser,
  validateObjectId('id'),
  CommentController.deleteComment,
);

module.exports = router;
