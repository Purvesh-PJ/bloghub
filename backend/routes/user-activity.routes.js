const express = require('express');
const router = express.Router();
const UserActivityController = require('../controllers/user-activity.controllers');
const AuthUser = require('../middlewares/authenticateUser');
const authorizeSelfOrAdmin = require('../middlewares/authorizeSelfOrAdmin');

// Get all user activity (admin only)
router.get(
  '/all',
  AuthUser.authenticateUser,
  AuthUser.authorizeAdmin,
  UserActivityController.getAllUserActivity,
);

// Get activity for a specific user — readable only by that user or an administrator
router.get(
  '/user/:userId',
  AuthUser.authenticateUser,
  authorizeSelfOrAdmin('userId'),
  UserActivityController.getUserActivity,
);

// Get timeline for a specific user — same scoping
router.get(
  '/timeline/:userId',
  AuthUser.authenticateUser,
  authorizeSelfOrAdmin('userId'),
  UserActivityController.getUserTimeline,
);

// Get moderation log (admin only)
router.get(
  '/moderation-log',
  AuthUser.authenticateUser,
  AuthUser.authorizeAdmin,
  UserActivityController.getModerationLog,
);

module.exports = router;
