const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
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
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
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
