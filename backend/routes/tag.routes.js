const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag.controllers');
const AuthUser = require('../middlewares/authenticateUser');
const { validateObjectId } = require('../middlewares/validate');

// Public read
router.get('/', tagController.getTags);

// Taxonomy management is an administrative action
router.post('/', AuthUser.authenticateUser, AuthUser.authorizeAdmin, tagController.postTags);

// Removing one is too. Refuses while stories still carry it; see the controller.
router.delete(
  '/:id',
  AuthUser.authenticateUser,
  AuthUser.authorizeAdmin,
  validateObjectId('id'),
  tagController.deleteTag,
);

module.exports = router;
