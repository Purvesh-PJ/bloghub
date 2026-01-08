const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controllers');
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

const upload = multer({ storage: storage });

// User Routes
router.get('/getUser', AuthUser.authenticateUser, UserController.getUser);
router.put('/setUser', AuthUser.authenticateUser, upload.single('image'), UserController.setUser);
router.get('/getUserPosts', AuthUser.authenticateUser, UserController.getUserSelfPosts);
router.post(
  '/postUserProfile',
  AuthUser.authenticateUser,
  upload.single('image'),
  UserController.postUserProfile,
);
router.get('/getUserProfile', AuthUser.authenticateUser, UserController.getUserProfile);
router.post('/followUser', AuthUser.authenticateUser, UserController.followUser);
router.post('/unfollowUser', AuthUser.authenticateUser, UserController.unfollowUser);
router.get('/isFollowing/:id', AuthUser.authenticateUser, UserController.isFollowing);
// router.get('/:id', UserController.getSingleUser);

// Add more routes as needed

module.exports = router;
