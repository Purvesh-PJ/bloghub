const express = require('express');
const router = express.Router();
const PostControllers = require('../controllers/post.controllers');
const AuthUser = require('../middlewares/authenticateUser');
const { validate, validateObjectId } = require('../middlewares/validate');
const {
  createPostRules,
  updatePostRules,
  bulkPostRules,
  paginationRules,
} = require('../validators/content.validators');

// Optional auth on both reads: an author (or admin) may see their own unpublished posts.
router.get('/', paginationRules, validate, AuthUser.attachUserIfPresent, PostControllers.getBlogs);
// Declared before '/:id' so the literal path is never read as an id.
router.get('/trending', paginationRules, validate, PostControllers.getTrendingPosts);

router.get(
  '/:id',
  validateObjectId('id'),
  AuthUser.attachUserIfPresent,
  PostControllers.getSinglePost,
);

router.post('/', AuthUser.authenticateUser, createPostRules, validate, PostControllers.postBlogs);

// Bulk publish / unpublish / delete from the dashboard. Declared before the `/:id` routes so
// the literal path is never read as an id.
router.post(
  '/bulk',
  AuthUser.authenticateUser,
  bulkPostRules,
  validate,
  PostControllers.bulkUpdatePosts,
);

// The parameter is named `:id` on every route now. It used to be `:_id` here and `:id` on
// the read, so each handler had to accept either spelling.
router.put(
  '/:id',
  AuthUser.authenticateUser,
  validateObjectId('id'),
  updatePostRules,
  validate,
  PostControllers.putBlogs,
);

router.delete(
  '/:id',
  AuthUser.authenticateUser,
  validateObjectId('id'),
  PostControllers.deletePost,
);

module.exports = router;
