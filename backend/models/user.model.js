const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    roles: {
      type: [String],
      default: ['user'],
    },

    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
    },

    settings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserSetting',
    },

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Uniqueness must be enforced by the database: the application-level findOne check in
// signUp can be passed by two concurrent registrations before either writes.
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
