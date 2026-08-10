const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controllers');

const AuthUser = require('../middlewares/authenticateUser');

// Comment Routes
router.get('/', CommentController.getComments);
router.post('/', AuthUser.authenticateUser, CommentController.postComments);
router.post('/replies', AuthUser.authenticateUser, CommentController.postUserReplyComments);
// Add more routes as needed

module.exports = router;
