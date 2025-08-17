const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analytics.controllers');
const AuthUser = require('../middlewares/authenticateUser');

// Get analytics for a specific blog post
router.get('/post/:id', AnalyticsController.getAnalytics);

// Get analytics for a specific user
router.get('/user/:userId', AuthUser.authenticateUser, AnalyticsController.getUserAnalytics);

// Get admin analytics (overall site analytics)
router.get('/admin', AuthUser.authenticateUser, AuthUser.authorizeAdmin, AnalyticsController.getAdminAnalytics);

// Track a page view
router.post('/view/:postId', AnalyticsController.trackPageView);

// Track a post read
router.post('/read/:postId', AnalyticsController.trackPostRead);

module.exports = router;
