const UserSettings = require('../models/user-settings.model');
const UserProfile = require('../models/user-profile.model');
const asyncHandler = require('../middlewares/asyncHandler');
const { notFound } = require('../utils/AppError');

/*
  This was the last module still catching in every handler and answering a hand-written 500.

  That pattern loses information twice over: a Mongoose validation failure — a caller sending
  a `theme` outside the enum, say — is a 400, and reporting it as "an error occurred while
  updating settings" tells the client nothing it can act on and tells monitoring that the
  server is failing when it is not. `asyncHandler` forwards the rejection to the error
  middleware, which already knows how to map CastError, ValidationError and duplicate keys to
  the status they deserve.

  Local `try`/`catch` remains correct where an error is being *translated* rather than
  swallowed — see the token verification in auth.controllers and the duplicate-key branch in
  like.controllers.
*/

// Drops keys the caller did not send, so a partial update never overwrites stored values
// with undefined.
const pickDefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

// Every write here upserts: settings are created on first use rather than at registration,
// so an account that has never opened this screen still has somewhere to save to.
const UPSERT = { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true };

exports.getUserSettings = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Schema defaults supply the initial values, so nothing needs restating here.
  let userSettings = await UserSettings.findOne({ user: userId });

  if (!userSettings) {
    userSettings = await UserSettings.create({ user: userId });
  }

  res.status(200).json({ success: true, message: 'Settings found', data: userSettings });
});

exports.updateUserSettings = asyncHandler(async (req, res) => {
  const { theme, emailNotifications, privacySettings } = req.body;

  const updatedSettings = await UserSettings.findOneAndUpdate(
    { user: req.user.id },
    { $set: pickDefined({ theme, emailNotifications, privacySettings }) },
    UPSERT,
  );

  res.status(200).json({ success: true, message: 'Settings updated', data: updatedSettings });
});

exports.getUserProfile = asyncHandler(async (req, res) => {
  // The route guard has already confirmed the caller may read this id.
  const userId = req.params.userId || req.user.id;

  const userProfile = await UserProfile.findOne({ user: userId })
    // Excludes the avatar bytes; they are served by GET /users/:id/avatar.
    .select('-image')
    .populate('user', 'username email');

  if (!userProfile) {
    throw notFound('User profile not found', 'ProfileNotFound');
  }

  res.status(200).json({ success: true, message: 'Profile found', data: userProfile });
});

exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, bio, location, website, socialLinks } = req.body;

  // Only apply the fields that were actually sent, so a partial update cannot blank out
  // the rest of the profile.
  const updatedProfile = await UserProfile.findOneAndUpdate(
    { user: req.user.id },
    { $set: pickDefined({ fullName, bio, location, website, socialLinks }) },
    UPSERT,
  ).select('-image');

  res.status(200).json({ success: true, message: 'Profile updated', data: updatedProfile });
});

/**
 * Two-factor authentication is not implemented.
 *
 * This endpoint previously accepted the payload and wrote fields the User schema does not
 * declare, so Mongoose discarded them and the caller received a success response for work
 * that never happened. Answering 501 is the honest contract until 2FA actually exists; there
 * is deliberately no client wrapper for it.
 */
exports.updateSecuritySettings = (req, res) =>
  res.status(501).json({
    success: false,
    message: 'Two-factor authentication is not implemented yet',
    error: 'NotImplemented',
  });

exports.updatePrivacySettings = asyncHandler(async (req, res) => {
  const { privacySettings } = req.body;

  const updatedSettings = await UserSettings.findOneAndUpdate(
    { user: req.user.id },
    { $set: pickDefined({ privacySettings }) },
    UPSERT,
  );

  res.status(200).json({
    success: true,
    message: 'Privacy settings updated',
    data: updatedSettings,
  });
});

exports.updateAppearanceSettings = asyncHandler(async (req, res) => {
  const { theme, fontSize, colorScheme } = req.body;

  // Dot-notation keeps an unsent sub-field from blanking its sibling.
  const update = pickDefined({
    theme,
    'appearance.fontSize': fontSize,
    'appearance.colorScheme': colorScheme,
  });

  const updatedSettings = await UserSettings.findOneAndUpdate(
    { user: req.user.id },
    { $set: update },
    UPSERT,
  );

  res.status(200).json({
    success: true,
    message: 'Appearance settings updated',
    data: updatedSettings,
  });
});
