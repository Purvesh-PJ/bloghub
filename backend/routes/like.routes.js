const express = require('express');
const router = express.Router();
const LikeControllers = require('../controllers/like.controllers');
const AuthUser = require('../middlewares/authenticateUser');
const { validateObjectId } = require('../middlewares/validate');

// Like a post (requires authentication)
router.post(
  '/',
  AuthUser.authenticateUser,
  validateObjectId('postId', 'body'),
  LikeControllers.createLike,
);

/*
  The two reads below are public, but a like is only as public as the post it sits on — so
  they still need to know who is asking in order to let an author see the likes on their own
  unpublished story. attachUserIfPresent supplies that without rejecting anonymous callers.
*/
router.get(
  '/post/:postId',
  validateObjectId('postId'),
  AuthUser.attachUserIfPresent,
  LikeControllers.getPostLikes,
);

// Unlike a post (requires authentication)
router.delete(
  '/post/:postId',
  AuthUser.authenticateUser,
  validateObjectId('postId'),
  LikeControllers.deleteLike,
);

module.exports = router;
