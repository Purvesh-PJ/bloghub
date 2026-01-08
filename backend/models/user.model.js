const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
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

module.exports = mongoose.model('User', UserSchema);
