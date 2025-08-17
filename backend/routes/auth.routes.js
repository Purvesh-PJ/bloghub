const express = require('express');
const router = express.Router();
const AuthControllers = require('../controllers/auth.controllers');
const Signupvalidator = require('../middlewares/SignupValidation');

router.post('/signin', AuthControllers.signIn);
router.post('/signup', Signupvalidator.SignupValidation, AuthControllers.signUp);
router.post('/refreshToken', AuthControllers.refreshToken);


module.exports = router;    