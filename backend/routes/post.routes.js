const express = require('express');
const router = express.Router();
const PostControllers = require('../controllers/post.controllers');
const AuthUser = require('../middlewares/authenticateUser');

// Optional auth on both reads: an author (or admin) may see their own unpublished posts.
router.get('/', AuthUser.attachUserIfPresent, PostControllers.getBlogs);
router.get('/:id', AuthUser.attachUserIfPresent, PostControllers.getSinglePost);
router.post('/', AuthUser.authenticateUser, PostControllers.postBlogs);
router.put('/:_id', AuthUser.authenticateUser, PostControllers.putBlogs);
router.delete('/:_id', AuthUser.authenticateUser, PostControllers.deletePost);

module.exports = router;
