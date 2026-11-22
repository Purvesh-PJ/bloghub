const authRoutes = require('./auth.routes');
const AuthController = require('./auth.controllers');
const authValidators = require('./auth.validators');

module.exports = {
  authRoutes,
  AuthController,
  authValidators,
};
