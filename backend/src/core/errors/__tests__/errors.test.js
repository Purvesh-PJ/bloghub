const multer = require('multer');
const { errorHandler, AppError } = require('../index');
const { logger } = require('../../logging');

describe('core/errors/errorHandler', () => {
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
