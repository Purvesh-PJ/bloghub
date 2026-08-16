const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controllers');
const AuthUser = require('../middlewares/authenticateUser');
const { uploadAvatar } = require('../middlewares/upload');
const { validate, validateObjectId } = require('../middlewares/validate');
const { paginationRules, myPostsRules } = require('../validators/content.validators');
const { updateAccountRules } = require('../validators/user.validators');
const { deleteAccountRules } = require('../validators/auth.validators');

router.get(
  '/',
  AuthUser.authenticateUser,
  AuthUser.authorizeAdmin,
  paginationRules,
  validate,
  UserController.getAllUsers,
);

router.get('/getUser', AuthUser.authenticateUser, UserController.getUser);

router.put(
  '/setUser',
  AuthUser.authenticateUser,
  uploadAvatar,
  updateAccountRules,
  validate,
  UserController.setUser,
);

router.get(
  '/getUserPosts',
  AuthUser.authenticateUser,
  myPostsRules,
  validate,
  UserController.getUserSelfPosts,
);

router.post(
  '/postUserProfile',
  AuthUser.authenticateUser,
  uploadAvatar,
  UserController.postUserProfile,
);

router.get('/getUserProfile', AuthUser.authenticateUser, UserController.getUserProfile);

// Deletes the caller's own account. Scoped to the token, so it takes no id and cannot be
// pointed at anybody else.
router.delete(
  '/me',
  AuthUser.authenticateUser,
  deleteAccountRules,
  validate,
  UserController.deleteAccount,
);

router.post(
  '/followUser',
  AuthUser.authenticateUser,
  validateObjectId('toFollowId', 'body'),
  UserController.followUser,
);

router.post(
  '/unfollowUser',
  AuthUser.authenticateUser,
  validateObjectId('toUnfollowId', 'body'),
  UserController.unfollowUser,
);

router.get(
  '/isFollowing/:id',
  AuthUser.authenticateUser,
  validateObjectId('id'),
  UserController.isFollowing,
);

module.exports = router;
