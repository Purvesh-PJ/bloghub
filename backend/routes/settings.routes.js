const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settings.controllers');
const AuthUser = require('../middlewares/authenticateUser');

// All routes require authentication
router.use(AuthUser.authenticateUser);

// User settings routes
router.get('/user', SettingsController.getUserSettings);
router.put('/user', SettingsController.updateUserSettings);

// User profile routes
router.get('/profile/:userId?', SettingsController.getUserProfile);
router.put('/profile', SettingsController.updateUserProfile);

// Security settings
router.put('/security', SettingsController.updateSecuritySettings);

// Privacy settings
router.put('/privacy', SettingsController.updatePrivacySettings);

// Appearance settings
router.put('/appearance', SettingsController.updateAppearanceSettings);

module.exports = router;
