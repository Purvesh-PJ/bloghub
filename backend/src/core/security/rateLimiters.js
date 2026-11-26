const rateLimit = require('express-rate-limit');

const isRateLimitDisabled = () =>
  process.env.DISABLE_RATE_LIMIT === 'true' || process.env.NODE_ENV === 'test';

/** General API burst limiter: 300 requests per 15 minutes per IP. */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
  skip: isRateLimitDisabled,
});

/** Auth brute-force limiter: 10 failed attempts per 15 minutes per IP. */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
  skip: isRateLimitDisabled,
});

module.exports = { generalLimiter, authLimiter };
