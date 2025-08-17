const express = require('express');
const router = express.Router();
const PageViewControllers = require('../controllers/page-view.controllers');

// Record a page view
router.post('/', PageViewControllers.createPageView);

// Get all page views for a specific post
router.get('/post/:postId', PageViewControllers.getPostPageViews);

// Get page view count for a specific post
router.get('/post/:postId/count', PageViewControllers.getPostPageViewCount);

// Get a specific page view by ID
router.get('/:id', PageViewControllers.getPageView);

module.exports = router;
