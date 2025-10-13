const express = require('express');
const router = express.Router();
const PageViewController = require('../controllers/page-view.controllers');

// Record a page view
router.post('/', PageViewController.createPageView);

// Get all page views for a specific post
router.get('/post/:postId', PageViewController.getPostPageViews);

// Get page view count for a specific post
router.get('/post/:postId/count', PageViewController.getPostPageViewCount);

// Get a specific page view by ID
router.get('/:id', PageViewController.getPageView);

module.exports = router;
