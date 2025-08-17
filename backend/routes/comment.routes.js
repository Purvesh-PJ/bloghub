const express = require('express');
const router = express.Router();
const CommentControllers = require('../controllers/comment.controllers');

// Comment Routes
router.get('/', CommentControllers.getComments);
router.post('/', CommentControllers.postComments);
router.post('/replies', CommentControllers.postUserReplyComments);
// Add more routes as needed

module.exports = router;
