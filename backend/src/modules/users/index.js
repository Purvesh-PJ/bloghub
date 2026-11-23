const userRoutes = require('./routes/user.routes');
const settingsRoutes = require('./routes/settings.routes');
const UserController = require('./controllers/user.controllers');
const SettingsController = require('./controllers/settings.controllers');
const UserService = require('./services/user.service');
const User = require('./models/user.model');
const UserProfile = require('./models/user-profile.model');
const UserSettings = require('./models/user-settings.model');
const userValidators = require('./validators/user.validators');

module.exports = {
  userRoutes,
  settingsRoutes,
  UserController,
  SettingsController,
  UserService,
  User,
  UserProfile,
  UserSettings,
  userValidators,
};
