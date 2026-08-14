const UserSettings = require('../models/user-settings.model');
const UserProfile = require('../models/user-profile.model');

// Drops keys the caller did not send, so a partial update never overwrites stored values
// with undefined.
const pickDefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

// Get user settings
exports.getUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Schema defaults supply the initial values, so nothing needs restating here.
    let userSettings = await UserSettings.findOne({ user: userId });

    if (!userSettings) {
      userSettings = await UserSettings.create({ user: userId });
    }

    res.json({ success: true, message: 'Settings found', data: userSettings });
  } catch (error) {
    console.error('[getUserSettings]', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching settings' });
  }
};

// Update user settings
exports.updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme, emailNotifications, privacySettings } = req.body;

    const update = pickDefined({ theme, emailNotifications, privacySettings });

    const updatedSettings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { $set: update },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    res.json({ success: true, message: 'Settings updated', data: updatedSettings });
  } catch (error) {
    console.error('[updateUserSettings]', error);
    res.status(500).json({ success: false, message: 'An error occurred while updating settings' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    // The route guard has already confirmed the caller may read this id.
    const userId = req.params.userId || req.user.id;

    const userProfile = await UserProfile.findOne({ user: userId }).populate(
      'user',
      'username email',
    );

    if (!userProfile) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    res.json({ success: true, message: 'Profile found', data: userProfile });
  } catch (error) {
    console.error('[getUserProfile]', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching profile' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, bio, location, website, socialLinks } = req.body;

    // Only apply the fields that were actually sent, so a partial update cannot blank out
    // the rest of the profile.
    const update = pickDefined({ fullName, bio, location, website, socialLinks });

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: update },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    res.json({ success: true, message: 'Profile updated', data: updatedProfile });
  } catch (error) {
    console.error('[updateUserProfile]', error);
    res.status(500).json({ success: false, message: 'An error occurred while updating profile' });
  }
};

// Update security settings
//
// Two-factor authentication is not implemented. This endpoint previously accepted the
// payload and wrote fields that the User schema does not declare, so Mongoose discarded
// them and the caller received a success response for work that never happened. Answering
// 501 is the honest contract until 2FA actually exists.
exports.updateSecuritySettings = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Two-factor authentication is not implemented yet',
    error: 'NotImplemented',
  });
};

// Update privacy settings
exports.updatePrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { privacySettings } = req.body;

    const updatedSettings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { $set: pickDefined({ privacySettings }) },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    res.json({ success: true, message: 'Privacy settings updated', data: updatedSettings });
  } catch (error) {
    console.error('[updatePrivacySettings]', error);
    res
      .status(500)
      .json({ success: false, message: 'An error occurred while updating privacy settings' });
  }
};

// Update appearance settings
exports.updateAppearanceSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme, fontSize, colorScheme } = req.body;

    // Dot-notation keeps an unsent sub-field from blanking its sibling.
    const update = pickDefined({
      theme,
      'appearance.fontSize': fontSize,
      'appearance.colorScheme': colorScheme,
    });

    const updatedSettings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { $set: update },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    res.json({ success: true, message: 'Appearance settings updated', data: updatedSettings });
  } catch (error) {
    console.error('[updateAppearanceSettings]', error);
    res
      .status(500)
      .json({ success: false, message: 'An error occurred while updating appearance settings' });
  }
};
