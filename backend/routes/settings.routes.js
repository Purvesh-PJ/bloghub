const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settings.controllers');
const AuthUser = require('../middlewares/authenticateUser');
const authorizeSelfOrAdmin = require('../middlewares/authorizeSelfOrAdmin');

// All routes require authentication
router.use(AuthUser.authenticateUser);

// User settings routes
router.get('/user', SettingsController.getUserSettings);
router.put('/user', SettingsController.updateUserSettings);

// User profile routes — the optional parameter is scoped to the caller
router.get('/profile/:userId?', authorizeSelfOrAdmin('userId'), SettingsController.getUserProfile);
router.put('/profile', SettingsController.updateUserProfile);

// Security settings
router.put('/security', SettingsController.updateSecuritySettings);

// Privacy settings
router.put('/privacy', SettingsController.updatePrivacySettings);

// Appearance settings
router.put('/appearance', SettingsController.updateAppearanceSettings);

module.exports = router;
