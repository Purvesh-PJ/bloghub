const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controllers');
const AuthUser = require('../middlewares/authenticateUser');
const { validate } = require('../middlewares/validate');
const {
  signUpRules,
  signInRules,
  refreshRules,
  changePasswordRules,
} = require('../validators/auth.validators');

router.post('/signin', signInRules, validate, AuthController.signIn);
router.post('/signup', signUpRules, validate, AuthController.signUp);
router.post('/refreshToken', refreshRules, validate, AuthController.refreshToken);

// Revokes every token issued to the caller. Requires a valid session, since there is nothing
// to revoke without one.
router.post('/signout', AuthUser.authenticateUser, AuthController.signOut);

// Changing the password revokes every existing session, this one included.
router.put(
  '/password',
  AuthUser.authenticateUser,
  changePasswordRules,
  validate,
  AuthController.changePassword,
);

module.exports = router;
