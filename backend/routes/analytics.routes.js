const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analytics.controllers');
const AuthUser = require('../middlewares/authenticateUser');
const authorizeSelfOrAdmin = require('../middlewares/authorizeSelfOrAdmin');

// Get analytics for a specific blog post
router.get('/post/:id', AnalyticsController.getAnalytics);

// Get analytics for a specific user — readable only by that user or an administrator
router.get(
  '/user/:userId',
  AuthUser.authenticateUser,
  authorizeSelfOrAdmin('userId'),
  AnalyticsController.getUserAnalytics,
);

// What the caller has been reading. Scoped to the token, so it takes no user parameter
// and cannot be pointed at somebody else's reading history.
router.get('/me/reading', AuthUser.authenticateUser, AnalyticsController.getReadingActivity);

// Get admin analytics (overall site analytics)
router.get(
  '/admin',
  AuthUser.authenticateUser,
  AuthUser.authorizeAdmin,
  AnalyticsController.getAdminAnalytics,
);

// Tracking stays open to anonymous readers — a view from a signed-out visitor still counts.
// attachUserIfPresent associates it with the reader when a token is present without
// rejecting the request when one is not. Without it req.user was never set on these routes,
// so every view and read was stored with a null user and nothing could be attributed to
// anybody: "continue reading" had no rows to find.
router.post('/view/:postId', AuthUser.attachUserIfPresent, AnalyticsController.trackPageView);
router.post('/read/:postId', AuthUser.attachUserIfPresent, AnalyticsController.trackPostRead);

module.exports = router;
