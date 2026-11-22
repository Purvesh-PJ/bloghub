const { body } = require('express-validator');

/**
 * Account fields editable from the profile screen.
 *
 * Everything is optional — this is a partial update — but a supplied value must be as
 * well-formed as it would be at registration. Previously `setUser` wrote whatever it was
 * given straight onto the record, so an account's email could be replaced with an arbitrary
 * string, and since sign-in accepts an email that is an account-boundary field.
 */
const updateAccountRules = [
  body('username')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username may only contain letters, numbers, hyphens and underscores'),

  body('email')
    .optional()
    .isString()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .isLength({ max: 254 })
    .normalizeEmail({ gmail_remove_dots: false }),

  body('bio').optional().isString().trim().isLength({ max: 500 }),
];

const suspendRules = [
  body('suspended').isBoolean().withMessage('suspended must be true or false').toBoolean(),
];

const roleRules = [
  body('admin').isBoolean().withMessage('admin must be true or false').toBoolean(),
];

// Deleting somebody else's account asks for the administrator's own password, for the same
// reason self-deletion does: a session alone is not authority to destroy an account.
const adminDeleteRules = [
  body('password').isString().withMessage('Your password is required').notEmpty(),
];

module.exports = { updateAccountRules, suspendRules, roleRules, adminDeleteRules };
