const multer = require('multer');

/**
 * Terminal error middleware.
 *
 * Reports the status an error actually carries. Previously everything became a 500, so a
 * caller could not tell a bad request from an outage, and monitoring saw a permanent error
 * rate from ordinary 404s.
 */
const errorHandler = (err, req, res, _next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.expected ? err.message : 'An internal server error occurred';
  let code = err.code;

  // Mongoose and multer raise errors that are really client faults; translating them here
  // keeps every handler from repeating the same checks.
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for '${err.path}'`;
    code = 'InvalidValue';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors ?? {})
      .map((e) => e.message)
      .join('; ');
    code = 'ValidationError';
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'value';
    message = `That ${field} is already taken`;
    code = 'DuplicateKey';
  } else if (err instanceof multer.MulterError) {
    status = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : `Upload rejected: ${err.message}`;
    code = err.code;
  }

  // Only genuine faults are worth a log line; anticipated 4xx would just be noise.
  if (status >= 500) {
    console.error('[Error]', err.stack || err.message);
  }

  return res.status(status).json({
    success: false,
    message,
    ...(code && { error: code }),
    ...(process.env.NODE_ENV === 'development' && status >= 500 && { stack: err.stack }),
  });
};

module.exports = errorHandler;
