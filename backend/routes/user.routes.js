const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controllers');
const AuthUser = require('../middlewares/authenticateUser');
const { uploadAvatar } = require('../middlewares/upload');
const { validate, validateObjectId } = require('../middlewares/validate');
const { paginationRules, myPostsRules } = require('../validators/content.validators');
const AdminController = require('../controllers/admin.controllers');
const {
  updateAccountRules,
  suspendRules,
  roleRules,
  adminDeleteRules,
} = require('../validators/user.validators');
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

/*
  There is deliberately no POST /postUserProfile.

  It upserted bio and avatar onto the profile — the same write PUT /setUser already performs,
  minus the step that keeps `User.profile` pointing at the document. Two write paths to one
  record, one of which left the back-reference dangling, and nothing on the client had ever
  called it.
*/

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

/*
  Somebody else's public page. Deliberately unauthenticated — a signed-out reader clicking an
  author byline must reach it. Declared after the literal `/getUser*` paths so none of them is
  ever read as an id, and it cannot collide with `/isFollowing/:id` because the second segment
  here is the literal word `profile`.
*/
router.get('/:id/profile', validateObjectId('id'), UserController.getPublicProfile);

// The avatar itself, as an image the browser can cache. Public for the same reason the
// profile is — see the controller.
router.get('/:id/avatar', validateObjectId('id'), UserController.getAvatar);

/* ── Administrator actions on other accounts ─────────────────────────────── */

router.patch(
  '/:id/suspension',
  AuthUser.authenticateUser,
  AuthUser.authorizeAdmin,
  validateObjectId('id'),
  suspendRules,
  validate,
  AdminController.setUserSuspended,
);

router.patch(
  '/:id/role',
  AuthUser.authenticateUser,
  AuthUser.authorizeAdmin,
  validateObjectId('id'),
  roleRules,
  validate,
  AdminController.setUserRole,
);

router.delete(
  '/:id',
  AuthUser.authenticateUser,
  AuthUser.authorizeAdmin,
  validateObjectId('id'),
  adminDeleteRules,
  validate,
  AdminController.deleteUser,
);

module.exports = router;
