/**
 * Wraps an async route handler so a rejected promise reaches the error middleware.
 *
 * Express 4 does not catch async throws: an `await` that rejects outside a try/catch becomes
 * an unhandled rejection, which leaves the request hanging and, on modern Node, terminates
 * the process. Wrapping the handler routes the rejection to `next()` instead.
 *
 * @param {Function} fn async (req, res, next) handler
 * @returns {Function} an Express handler that forwards rejections
 */
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
