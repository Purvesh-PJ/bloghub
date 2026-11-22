const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },

    image: {
      data: {
        type: Buffer,
      },
      contentType: {
        type: String,
      },
    },

    bio: {
      type: String,
    },

    // Extended profile fields written by settings.controllers.js. They must be declared
    // here or Mongoose strict mode discards them on save.
    fullName: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    socialLinks: {
      twitter: { type: String, trim: true },
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
    },

    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    postCount: {
      type: Number,
      default: 0,
    },

    followersCount: {
      type: Number,
      default: 0,
    },

    followingsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Looked up on nearly every authenticated request.
UserProfileSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);
