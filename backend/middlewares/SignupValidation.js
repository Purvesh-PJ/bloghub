const { check } = require('express-validator');

exports.SignupValidation = [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('confirmPassword', 'Passwords do not match').custom((value, { req }) => {
    return value === req.body.password;
  }),
];
