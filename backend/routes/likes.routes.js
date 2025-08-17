const express = require('express');
const router = express.Router();
const LikeControllers = require('../controllers/like.controllers');
const AuthUser = require('../middlewares/authenticateUser');

// Like a post (requires authentication)
router.post('/', AuthUser.authenticateUser, LikeControllers.createLike);

// Get all likes for a specific post
router.get('/post/:postId', LikeControllers.getPostLikes);

// Unlike a post (requires authentication)
router.delete('/post/:postId', AuthUser.authenticateUser, LikeControllers.deleteLike);

// Get a specific like by ID
router.get('/:id', LikeControllers.getLike);

module.exports = router;
