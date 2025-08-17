const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/user.controllers');
const AuthUser = require('../middlewares/authenticateUser');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the destination folder for uploaded files
    cb(null, 'uploads/users-profile-avatar/');
  },
  filename: (req, file, cb) => {
    // Define the filename for the uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage});

// User Routes
router.get('/getUser', AuthUser.authenticateUser, UserControllers.getUser);
router.put('/setUser', AuthUser.authenticateUser, upload.single('image'), UserControllers.setUser);
router.get('/getUserPosts', AuthUser.authenticateUser, UserControllers.getUserSelfPosts);
router.post('/postUserProfile', AuthUser.authenticateUser, upload.single('image'), UserControllers.postUserProfile);
router.get('/getUserProfile', AuthUser.authenticateUser, UserControllers.getUserProfile);
router.post('/followUser', AuthUser.authenticateUser, UserControllers.followUser);
router.post('/unfollowUser', AuthUser.authenticateUser, UserControllers.unfollowUser);
router.get('/isFollowing/:id', AuthUser.authenticateUser, UserControllers.isFollowing);
// router.get('/:id', UserControllers.getSingleUser);

// Add more routes as needed

module.exports = router;
