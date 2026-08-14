const mongoose = require('mongoose');

// Mongoose runs in strict mode, so every field written by settings.controllers.js must be
// declared here — an undeclared field is silently discarded on save.
const UserSettingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    privacySettings: {
      showEmail: { type: Boolean, default: false },
      showActivity: { type: Boolean, default: true },
    },

    appearance: {
      fontSize: { type: String, enum: ['sm', 'md', 'lg'], default: 'md' },
      colorScheme: { type: String, default: 'default' },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('UserSetting', UserSettingSchema);
