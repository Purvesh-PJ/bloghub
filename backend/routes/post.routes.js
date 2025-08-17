const express = require('express');
const router = express.Router();
const PostControllers = require('../controllers/post.controller');
const AuthUser = require('../middlewares/authenticateUser');

router.get('/', PostControllers.getBlogs);
router.get('/:id', PostControllers.getSinglePost);
router.post('/', AuthUser.authenticateUser, PostControllers.postBlogs);
router.put('/:_id', AuthUser.authenticateUser, PostControllers.putBlogs);
router.delete('/:_id', AuthUser.authenticateUser, PostControllers.deletePost);

module.exports = router;