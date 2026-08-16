const { body } = require('express-validator');

// Long enough that an offline crack is expensive, short enough that people will comply.
// Length beats character-class rules: a passphrase is both stronger and easier to remember
// than eight characters of punctuation soup.
const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 128;

const password = (field = 'password') =>
  body(field)
    .isString()
    .withMessage('Password is required')
    .isLength({ min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH })
    .withMessage(
      `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`,
    )
    .custom((value) => !/^\s|\s$/.test(value))
    .withMessage('Password cannot start or end with a space');

const signUpRules = [
  body('username')
    .isString()
    .withMessage('Username is required')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    // Anchored to a safe set so a username cannot impersonate a URL segment or smuggle
    // markup into pages that render it.
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username may only contain letters, numbers, hyphens and underscores'),

  body('email')
    .isString()
    .withMessage('Email is required')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .isLength({ max: 254 })
    .withMessage('Email is too long')
    .normalizeEmail({ gmail_remove_dots: false }),

  password(),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

// Sign-in had no validation at all: a non-string `credential` reached `.toLowerCase()` and
// threw, so malformed input was reported as a server error rather than a bad request.
const signInRules = [
  body('credential')
    .isString()
    .withMessage('Email or username is required')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required')
    .isLength({ max: 254 })
    .withMessage('Email or username is too long'),

  body('password').isString().withMessage('Password is required').notEmpty(),
];

const refreshRules = [
  body('refreshToken').isString().withMessage('Refresh token required').notEmpty(),
];

const changePasswordRules = [
  body('currentPassword').isString().withMessage('Current password is required').notEmpty(),
  password('newPassword'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords do not match'),
];

// Destroying the account requires proving ownership, not merely holding a session.
const deleteAccountRules = [
  body('password').isString().withMessage('Password is required').notEmpty(),
];

module.exports = {
  signUpRules,
  signInRules,
  refreshRules,
  changePasswordRules,
  deleteAccountRules,
  MIN_PASSWORD_LENGTH,
};
