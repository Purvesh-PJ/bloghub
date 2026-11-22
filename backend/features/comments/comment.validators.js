const { body } = require('express-validator');

const MAX_COMMENT = 5_000;

const commentRules = [
  body('message')
    .isString()
    .withMessage('Comment is required')
    .trim()
    .isLength({ min: 1, max: MAX_COMMENT })
    .withMessage(`Comment must be between 1 and ${MAX_COMMENT} characters`),
];

module.exports = {
  commentRules,
  MAX_COMMENT,
};
