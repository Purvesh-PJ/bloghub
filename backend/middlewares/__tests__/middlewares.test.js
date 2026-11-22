const multer = require('multer');
const errorHandler = require('../errorHandler');
const authorizeSelfOrAdmin = require('../authorizeSelfOrAdmin');
const { validateObjectId, paginationRules } = require('../validate');
const { AppError } = require('../../utils/AppError');
const logger = require('../../utils/logger');
const { validationResult } = require('express-validator');

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

  it('maps Mongoose CastError to 400 Invalid value error', () => {
    const castError = new Error('Cast to ObjectId failed');
    castError.name = 'CastError';
    castError.path = 'id';
    errorHandler(castError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid value for 'id'",
      error: 'InvalidValue',
    });
  });

  it('maps Mongoose ValidationError to 400 with concatenated messages', () => {
    const validationError = new Error('Validation failed');
    validationError.name = 'ValidationError';
    validationError.errors = {
      email: { message: 'Email already in use' },
    };
    errorHandler(validationError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email already in use',
      error: 'ValidationError',
    });
  });

  it('maps Mongo duplicate key error (code 11000) to 409 Conflict', () => {
    const duplicateError = new Error('Duplicate key');
    duplicateError.code = 11000;
    duplicateError.keyPattern = { username: 1 };
    errorHandler(duplicateError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'That username is already taken',
      error: 'DuplicateKey',
    });
  });

  it('handles Multer LIMIT_FILE_SIZE error with 400 Bad Request', () => {
    const multerError = new multer.MulterError('LIMIT_FILE_SIZE');
    errorHandler(multerError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'File is too large',
      error: 'LIMIT_FILE_SIZE',
    });
  });

  it('handles other Multer errors with 400 Bad Request', () => {
    const multerError = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
    multerError.message = 'Unexpected field';
    errorHandler(multerError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Upload rejected: Unexpected field',
      error: 'LIMIT_UNEXPECTED_FILE',
    });
  });
});

describe('middlewares/authorizeSelfOrAdmin', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('returns 401 if user is not authenticated', () => {
    req = { user: null };
    authorizeSelfOrAdmin('userId')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authentication required',
    });
  });

  it('allows access if user has admin role', () => {
    req = {
      user: { id: 'admin-id-123', roles: ['admin'] },
      params: { id: 'target-user-456' },
    };
    authorizeSelfOrAdmin('id')(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('allows access if authenticated user matches target params.id', () => {
    req = {
      user: { id: 'user-id-123', roles: [] },
      params: { id: 'user-id-123' },
    };
    authorizeSelfOrAdmin('id')(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('allows access if authenticated user matches target params.userId (default param)', () => {
    req = {
      user: { id: 'user-id-123', roles: [] },
      params: { userId: 'user-id-123' },
    };
    authorizeSelfOrAdmin()(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('denies access with 403 Forbidden if user is neither admin nor the owner', () => {
    req = {
      user: { id: 'user-id-123', roles: [] },
      params: { id: 'another-user-999' },
    };
    authorizeSelfOrAdmin('id')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Forbidden',
    });
  });
});

describe('middlewares/validateObjectId', () => {
  it('accepts valid 24-character hexadecimal ObjectId', () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = {};
    const next = jest.fn();

    validateObjectId('id', 'params')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('rejects invalid or non-24 hex string with 400 AppError', () => {
    const req = { params: { id: 'invalid-id' } };
    const res = {};
    const next = jest.fn();

    validateObjectId('id', 'params')(req, res, next);
    expect(next).toHaveBeenCalled();
    const passedError = next.mock.calls[0][0];
    expect(passedError.status).toBe(400);
    expect(passedError.code).toBe('InvalidObjectId');
  });

  it('rejects non-string object queries to prevent injection attacks', () => {
    const req = { body: { postId: { $ne: null } } };
    const res = {};
    const next = jest.fn();

    validateObjectId('postId', 'body')(req, res, next);
    expect(next).toHaveBeenCalled();
    const passedError = next.mock.calls[0][0];
    expect(passedError.status).toBe(400);
  });
});

describe('middlewares/paginationRules', () => {
  const runRules = async (rules, req) => {
    for (const rule of rules) {
      await rule.run(req);
    }
    return validationResult(req);
  };

  it('accepts valid positive page and limit parameters', async () => {
    const req = { query: { page: '1', limit: '10' } };
    const errors = await runRules(paginationRules, req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('rejects page less than 1 or invalid numbers', async () => {
    const req = { query: { page: '0', limit: '101' } };
    const errors = await runRules(paginationRules, req);
    expect(errors.isEmpty()).toBe(false);
  });
});
