const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controllers');
const Signupvalidator = require('../middlewares/SignupValidation');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/signin', authLimiter, AuthController.signIn);
router.post('/signup', authLimiter, Signupvalidator.SignupValidation, AuthController.signUp);
router.post('/refreshToken', AuthController.refreshToken);

module.exports = router;