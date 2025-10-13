const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controllers');

// Comment Routes
router.get('/', CommentController.getComments);
router.post('/', CommentController.postComments);
router.post('/replies', CommentController.postUserReplyComments);
// Add more routes as needed

module.exports = router;
