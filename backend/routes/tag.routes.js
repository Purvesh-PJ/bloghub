const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag.controllers');
const AuthUser = require('../middlewares/authenticateUser');

// Public read
router.get('/', tagController.getTags);

// Taxonomy management is an administrative action
router.post('/', AuthUser.authenticateUser, AuthUser.authorizeAdmin, tagController.postTags);

module.exports = router;
