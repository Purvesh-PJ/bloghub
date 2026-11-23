const authRoutes = require('./routes/auth.routes');
const AuthController = require('./controllers/auth.controllers');
const authValidators = require('./validators/auth.validators');
const authMiddlewares = require('./middlewares');

module.exports = {
  authRoutes,
  AuthController,
  authValidators,
  ...authMiddlewares,
};
