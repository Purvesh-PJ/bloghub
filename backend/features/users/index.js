const userRoutes = require('./user.routes');
const settingsRoutes = require('./settings.routes');
const UserController = require('./user.controllers');
const SettingsController = require('./settings.controllers');
const UserService = require('./user.service');
const User = require('./user.model');
const UserProfile = require('./user-profile.model');
const UserSettings = require('./user-settings.model');
const userValidators = require('./user.validators');

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
