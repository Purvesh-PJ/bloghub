const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controllers');
const Signupvalidator = require('../middlewares/SignupValidation');

router.post('/signin', AuthController.signIn);
router.post('/signup', Signupvalidator.SignupValidation, AuthController.signUp);
router.post('/refreshToken', AuthController.refreshToken);

module.exports = router;
