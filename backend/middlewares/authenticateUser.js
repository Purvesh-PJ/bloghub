const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Refresh tokens are signed with a different secret, but reject an explicit non-access
    // type as well so the intent is enforced in both places.
    if (decodedToken.type && decodedToken.type !== 'access') {
      return res.status(401).json({ success: false, message: 'Invalid token type' });
    }

    const userId =
      typeof decodedToken.user === 'object'
        ? decodedToken.user.id || decodedToken.user._id
        : decodedToken.user;
    req.user = {
      id: userId,
      _id: userId,
      roles: Array.isArray(decodedToken.roles) ? decodedToken.roles : ['user'],
    };
    next();
  } catch {
    // An invalid or expired token is an expected condition, not an error worth logging.
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Populates req.user when a valid token is present, but never rejects the request.
// Use on public routes whose response varies for a signed-in viewer (for example, an
// author being allowed to read their own unpublished post).
exports.attachUserIfPresent = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    if (decodedToken.type && decodedToken.type !== 'access') {
      return next();
    }
    const userId =
      typeof decodedToken.user === 'object'
        ? decodedToken.user.id || decodedToken.user._id
        : decodedToken.user;
    req.user = {
      id: userId,
      _id: userId,
      roles: Array.isArray(decodedToken.roles) ? decodedToken.roles : ['user'],
    };
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
