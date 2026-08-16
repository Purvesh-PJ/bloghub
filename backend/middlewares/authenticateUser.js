const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Reads and verifies a bearer token, then confirms it against the account behind it.
 *
 * The signature check alone is not enough. Roles used to be taken straight from the payload,
 * so demoting an administrator changed nothing until their token expired — and since refresh
 * tokens live for days and could be exchanged indefinitely, "until it expires" meant "never".
 * The account lookup here is what makes revocation and demotion take effect immediately; it
 * costs one indexed read per request.
 *
 * @returns {{id: string, roles: string[]} | null} identity, or null when the token is unusable
 */
const identify = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Refresh tokens are signed with a different secret, but reject an explicit non-access
  // type as well so the intent is enforced in both places.
  if (decoded.type && decoded.type !== 'access') return null;

  const userId =
    typeof decoded.user === 'object' ? decoded.user.id || decoded.user._id : decoded.user;
  if (!userId) return null;

  const account = await User.findById(userId).select('roles tokenVersion').lean();
  if (!account) return null; // deleted account, token still within its lifetime

  if ((decoded.tokenVersion ?? 0) !== (account.tokenVersion ?? 0)) return null; // revoked

  return {
    id: userId,
    _id: userId,
    roles: Array.isArray(account.roles) ? account.roles : ['user'],
  };
};

const readBearer = (req) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim() || null;
};

exports.authenticateUser = async (req, res, next) => {
  const token = readBearer(req);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  try {
    const user = await identify(token);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Session is no longer valid, please sign in again' });
    }
    req.user = user;
    return next();
  } catch (error) {
    // An invalid or expired token is an expected condition. A database failure is not, and
    // must not be reported as an authentication problem.
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    return next(error);
  }
};

// Populates req.user when a valid token is present, but never rejects the request.
// Use on public routes whose response varies for a signed-in viewer (for example, an
// author being allowed to read their own unpublished post).
exports.attachUserIfPresent = async (req, res, next) => {
  const token = readBearer(req);
  if (!token) return next();

  try {
    const user = await identify(token);
    if (user) req.user = user;
  } catch {
    // An invalid token on a public route is simply treated as an anonymous visitor.
  }

  return next();
};

// Middleware to check if user is an admin
exports.authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const userRoles = req.user.roles || [];
  if (!userRoles.includes('admin')) {
    return res
      .status(403)
      .json({ success: false, message: 'Access denied. Admin privileges required' });
  }

  next();
};
