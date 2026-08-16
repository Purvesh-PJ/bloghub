const { body, query } = require('express-validator');

// Mirrors the schema-level maxlength. Rejecting at the edge gives a clear 400 instead of a
// Mongoose validation error surfacing further in.
const MAX_TITLE = 200;
const MAX_CONTENT = 100_000;
const MAX_COMMENT = 5_000;
const MAX_BIO = 500;

const optionalUrl = (field, message) =>
  body(field)
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 2048 })
    .withMessage(`${message} is too long`)
    // Only http(s). Without this a `javascript:` URL stored as a cover image or website link
    // becomes a script sink the moment something renders it as a link.
    .matches(/^https?:\/\//i)
    .withMessage(`${message} must start with http:// or https://`);

/**
 * Built per call rather than shared between the create and update routes.
 *
 * An express-validator chain is mutable and `.optional()` returns the same object it
 * modified, so deriving the update rules from the create rules by mapping over them would
 * have quietly made the create rules optional as well.
 *
 * @param {boolean} partial when true, a field absent from the body is accepted
 */
const postRules = (partial) => {
  const required = (chain) => (partial ? chain.optional() : chain);

  return [
    required(
      body('title')
        .isString()
        .withMessage('Title is required')
        .trim()
        .isLength({ min: 1, max: MAX_TITLE })
        .withMessage(`Title must be between 1 and ${MAX_TITLE} characters`),
    ),

    required(
      body('content')
        .isString()
        .withMessage('Content is required')
        .isLength({ min: 1, max: MAX_CONTENT })
        .withMessage(`Content must be between 1 and ${MAX_CONTENT} characters`),
    ),

    body('visibility')
      .optional()
      .isIn(['draft', 'private', 'public'])
      .withMessage('Visibility must be draft, private or public'),

    optionalUrl('imageURL', 'Cover image URL'),

    body('slug')
      .optional({ values: 'falsy' })
      .isString()
      .trim()
      .isLength({ max: MAX_TITLE })
      .matches(/^[a-z0-9-]+$/i)
      .withMessage('Slug may only contain letters, numbers and hyphens'),

    body('tags').optional().isArray({ max: 5 }).withMessage('A story can carry up to 5 tags'),
    body('tags.*')
      .isString()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage('Each tag must be 1–30 characters')
      .matches(/^[a-z0-9][a-z0-9 -]*$/i)
      .withMessage('Tags may only contain letters, numbers, spaces and hyphens'),
  ];
};

const createPostRules = postRules(false);
const updatePostRules = postRules(true);

const commentRules = [
  body('message')
    .isString()
    .withMessage('Comment is required')
    .trim()
    .isLength({ min: 1, max: MAX_COMMENT })
    .withMessage(`Comment must be between 1 and ${MAX_COMMENT} characters`),
];

const profileRules = [
  body('fullName').optional().isString().trim().isLength({ max: 100 }),
  body('bio').optional().isString().trim().isLength({ max: MAX_BIO }),
  body('location').optional().isString().trim().isLength({ max: 100 }),
  optionalUrl('website', 'Website'),
  body('socialLinks.twitter').optional().isString().trim().isLength({ max: 100 }),
  body('socialLinks.github').optional().isString().trim().isLength({ max: 100 }),
  body('socialLinks.linkedin').optional().isString().trim().isLength({ max: 100 }),
];

// Bounded so one request cannot be used to sweep the collection, and so the action can only
// be one of the four the handler knows about.
const bulkPostRules = [
  body('ids').isArray({ min: 1, max: 100 }).withMessage('Select between 1 and 100 stories'),
  body('ids.*')
    .isString()
    .matches(/^[a-f\d]{24}$/i)
    .withMessage('Every id must be a valid story id'),
  body('action')
    .isIn(['delete', 'public', 'draft', 'private'])
    .withMessage('Action must be delete, public, draft or private'),
];

// Shared by every paginated listing, so one endpoint cannot be asked for the whole table.
const paginationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be 1 or greater').toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be between 1 and 50')
    .toInt(),
];

// Listing controls for the author's own posts.
const myPostsRules = [
  ...paginationRules,
  query('visibility').optional().isIn(['draft', 'private', 'public']),
  query('sort').optional().isIn(['newest', 'oldest', 'title', 'updated']),
  query('q').optional().isString().trim().isLength({ max: 200 }),
];

module.exports = {
  createPostRules,
  updatePostRules,
  bulkPostRules,
  commentRules,
  profileRules,
  paginationRules,
  myPostsRules,
  MAX_TITLE,
  MAX_CONTENT,
  MAX_COMMENT,
  MAX_BIO,
};
