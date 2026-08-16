const express = require('express');
const router = express.Router();
const PageViewController = require('../controllers/page-view.controllers');
const AuthUser = require('../middlewares/authenticateUser');
const { validateObjectId } = require('../middlewares/validate');

/*
  Read-only. Recording a view lives at POST /analytics/view/:postId, which is the path the
  client uses and the only one that applies per-visitor de-duplication.

  This module used to expose its own unauthenticated POST / that wrote a row for any postId it
  was given, with no de-duplication and no visibility check — a second, weaker way to do the
  same job. Two subsystems writing the same counter also meant the totals depended on which
  one the caller happened to use.
*/

// Get page view count for a specific post
router.get(
  '/post/:postId/count',
  validateObjectId('postId'),
  PageViewController.getPostPageViewCount,
);

// The per-view detail is only meaningful to the post's author or an administrator.
router.get(
  '/post/:postId',
  AuthUser.authenticateUser,
  validateObjectId('postId'),
  PageViewController.getPostPageViews,
);

module.exports = router;
