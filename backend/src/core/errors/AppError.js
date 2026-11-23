/**
 * An error that carries the HTTP status it should be reported as.
 *
 * The error handler previously reported every failure as a 500, so a "post not found" and a
 * database outage were indistinguishable to the client. Throwing one of these lets a handler
 * describe the failure once and have it surface correctly.
 */
class AppError extends Error {
  /**
   * @param {number} status HTTP status code
   * @param {string} message message safe to show a caller
   * @param {string} [code] short machine-readable tag, e.g. 'NotFound'
   */
  constructor(status, message, code) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    // Marks this as a failure we anticipated, so the handler can keep it out of error logs.
    this.expected = true;
    Error.captureStackTrace?.(this, AppError);
  }
}

const badRequest = (message, code = 'BadRequest') => new AppError(400, message, code);
const unauthorized = (message = 'Authentication required', code = 'Unauthorized') =>
  new AppError(401, message, code);
const forbidden = (message = 'Forbidden', code = 'Forbidden') => new AppError(403, message, code);
const notFound = (message = 'Not found', code = 'NotFound') => new AppError(404, message, code);
const conflict = (message, code = 'Conflict') => new AppError(409, message, code);

module.exports = { AppError, badRequest, unauthorized, forbidden, notFound, conflict };
