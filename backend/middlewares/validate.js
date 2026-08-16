const { validationResult } = require('express-validator');
const { badRequest } = require('../utils/AppError');

// `mongoose.Types.ObjectId.isValid` also accepts any 12-character string, so a value like
// 'aaaaaaaaaaaa' passes it and then casts to an unrelated id. Match the wire format instead.
const OBJECT_ID = /^[a-f\d]{24}$/i;

/**
 * Terminates a validator chain, turning any collected failures into a single 400.
 *
 * Place last in a route's middleware array: `router.post('/', rules, validate, handler)`.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    error: 'ValidationError',
    errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
  });
};

/**
 * Rejects a malformed id before it reaches a query.
 *
 * Passing a non-ObjectId string to Mongoose raises a CastError, which surfaced as a 500 —
 * reporting a caller's typo as a server fault. A value that is not a string is worse: an
 * object such as `{"$ne": null}` is a query fragment, not an id, and Mongoose will happily
 * use it as one.
 *
 * @param {string} name the parameter holding the id
 * @param {'params'|'body'} source where to read it from
 */
const validateObjectId =
  (name, source = 'params') =>
  (req, res, next) => {
    const value = req[source]?.[name];

    if (typeof value !== 'string' || !OBJECT_ID.test(value)) {
      return next(badRequest(`'${name}' must be a valid id`, 'InvalidObjectId'));
    }

    return next();
  };

module.exports = { validate, validateObjectId };
