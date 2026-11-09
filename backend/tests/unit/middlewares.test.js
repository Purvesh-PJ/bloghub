const multer = require('multer');
const errorHandler = require('../../middlewares/errorHandler');
const authorizeSelfOrAdmin = require('../../middlewares/authorizeSelfOrAdmin');
const { AppError } = require('../../utils/AppError');
const logger = require('../../utils/logger');

describe('middlewares/errorHandler', () => {
  let req;
  let res;
  let next;
  let loggerErrorSpy;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    loggerErrorSpy.mockRestore();
  });

  it('handles AppError with expected = true', () => {
    const error = new AppError(404, 'Post not found', 'NotFound');
    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Post not found',
      error: 'NotFound',
    });
    expect(loggerErrorSpy).not.toHaveBeenCalled();
  });

  it('masks unexpected 500 errors with generic message in production', () => {
    const error = new Error('Database connection failed');
    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'An internal server error occurred',
    });
    expect(loggerErrorSpy).toHaveBeenCalled();
  });

  it('translates Mongoose CastError to 400 InvalidValue', () => {
    const error = {
      name: 'CastError',
      path: 'postId',
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid value for 'postId'",
      error: 'InvalidValue',
    });
  });

  it('translates Mongoose ValidationError to 400 ValidationError', () => {
    const error = {
      name: 'ValidationError',
      errors: {
        title: { message: 'Title is required' },
        slug: { message: 'Slug must be unique' },
      },
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Title is required; Slug must be unique',
      error: 'ValidationError',
    });
  });

  it('translates Mongo duplicate key error (code 11000) to 409 DuplicateKey', () => {
    const error = {
      code: 11000,
      keyPattern: { email: 1 },
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'That email is already taken',
      error: 'DuplicateKey',
    });
  });

  it('handles duplicate key error with fallback field name when keyPattern is empty', () => {
    const error = {
      code: 11000,
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'That value is already taken',
      error: 'DuplicateKey',
    });
  });

  it('translates Multer LIMIT_FILE_SIZE error', () => {
    const error = new multer.MulterError('LIMIT_FILE_SIZE');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'File is too large',
      error: 'LIMIT_FILE_SIZE',
    });
  });

  it('translates generic Multer error', () => {
    const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'avatar');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: `Upload rejected: ${error.message}`,
      error: 'LIMIT_UNEXPECTED_FILE',
    });
  });
});

describe('middlewares/authorizeSelfOrAdmin', () => {
  let res;
  let next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('returns 401 when req.user is missing', () => {
    const middleware = authorizeSelfOrAdmin('userId');
    const req = { params: { userId: '123' } };

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authentication required',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('passes next() when target route parameter is absent', () => {
    const middleware = authorizeSelfOrAdmin('userId');
    const req = { user: { id: '123' }, params: {} };

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('passes next() when user accesses their own resource', () => {
    const middleware = authorizeSelfOrAdmin('userId');
    const req = { user: { id: '123' }, params: { userId: '123' } };

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('passes next() when admin accesses another user resource', () => {
    const middleware = authorizeSelfOrAdmin('userId');
    const req = {
      user: { id: 'admin1', roles: ['admin'] },
      params: { userId: 'user999' },
    };

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('returns 403 when non-admin accesses another user resource', () => {
    const middleware = authorizeSelfOrAdmin('userId');
    const req = {
      user: { id: 'user1', roles: ['user'] },
      params: { userId: 'user2' },
    };

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Forbidden',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
