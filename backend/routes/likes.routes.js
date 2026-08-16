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

// Get all likes for a specific post
router.get('/post/:postId', validateObjectId('postId'), LikeControllers.getPostLikes);

// Unlike a post (requires authentication)
router.delete(
  '/post/:postId',
  AuthUser.authenticateUser,
  validateObjectId('postId'),
  LikeControllers.deleteLike,
);

// Get a specific like by ID
router.get('/:id', validateObjectId('id'), LikeControllers.getLike);

module.exports = router;
