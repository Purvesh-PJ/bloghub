/**
 * Guards a route whose path carries a user identifier, ensuring the caller may only read
 * their own records unless they are an administrator.
 *
 * Must run after authenticateUser.
 *
 * @param {string} [param='userId'] name of the route parameter holding the user id
 */
module.exports = (param = 'userId') =>
  function authorizeSelfOrAdmin(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const target = req.params[param];
    // An absent parameter means "me" — nothing to compare against.
    if (!target) return next();

    const isSelf = target.toString() === req.user.id.toString();
    const isAdmin = (req.user.roles || []).includes('admin');

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    return next();
  };
