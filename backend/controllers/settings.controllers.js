const User = require('../models/user.model');
const UserSettings = require('../models/user-settings.model');
const UserProfile = require('../models/user-profile.model');

// Get user settings
exports.getUserSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find user settings or create default if not exists
    let userSettings = await UserSettings.findOne({ user: userId });
    
    if (!userSettings) {
      userSettings = new UserSettings({
        user: userId,
        theme: 'light',
        emailNotifications: true,
        privacySettings: {
          showEmail: false,
          showActivity: true
        }
      });
      await userSettings.save();
    }
    
    res.json(userSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user settings' });
  }
};

// Update user settings
exports.updateUserSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { theme, emailNotifications, privacySettings } = req.body;
    
    // Find and update user settings
    const updatedSettings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { 
        theme, 
        emailNotifications, 
        privacySettings,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating user settings' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    // Find user profile
    const userProfile = await UserProfile.findOne({ user: userId })
      .populate('user', 'username email');
    
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user profile' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      fullName, 
      bio, 
      location, 
      website, 
      socialLinks,
      profilePicture
    } = req.body;
    
    // Find and update user profile
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { 
        fullName, 
        bio, 
        location, 
        website, 
        socialLinks,
        profilePicture,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating user profile' });
  }
};

// Update security settings
exports.updateSecuritySettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { twoFactorEnabled, securityQuestions } = req.body;
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update security settings
    user.twoFactorEnabled = twoFactorEnabled;
    
    if (securityQuestions) {
      user.securityQuestions = securityQuestions;
    }
    
    await user.save();
    
    res.json({ message: 'Security settings updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating security settings' });
  }
};

// Update privacy settings
exports.updatePrivacySettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { privacySettings } = req.body;
    
    // Find and update user settings
    const updatedSettings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { 
        'privacySettings': privacySettings,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating privacy settings' });
  }
};

// Update appearance settings
exports.updateAppearanceSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { theme, fontSize, colorScheme } = req.body;
    
    // Find and update user settings
    const updatedSettings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { 
        theme,
        appearance: {
          fontSize,
          colorScheme
        },
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating appearance settings' });
  }
};
