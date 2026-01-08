const express = require('express');
const router = express.Router();
const UserActivityController = require('../controllers/user-activity.controllers');
const AuthUser = require('../middlewares/authenticateUser');

// Get all user activity (admin only)
router.get(
  '/all',
  AuthUser.authenticateUser,
  AuthUser.authorizeAdmin,
  UserActivityController.getAllUserActivity,
);

// Get activity for a specific user
router.get('/user/:userId', AuthUser.authenticateUser, UserActivityController.getUserActivity);

// Get timeline for a specific user
router.get('/timeline/:userId', AuthUser.authenticateUser, UserActivityController.getUserTimeline);

// Get moderation log (admin only)
router.get(
  '/moderation-log',
  AuthUser.authenticateUser,
  AuthUser.authorizeAdmin,
  UserActivityController.getModerationLog,
);

module.exports = router;
