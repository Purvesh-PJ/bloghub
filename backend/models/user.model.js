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
      enum: ['user', 'admin'],
      default: ['user'],
    },

    // Bumped whenever every existing session for this account must stop working: sign-out,
    // password change, or an administrator revoking access. Both token types carry the value
    // they were minted with, and authentication rejects any token whose copy is stale.
    //
    // Without it there is no way to revoke anything — a refresh token stays valid for its
    // full lifetime no matter what happens to the account behind it.
    tokenVersion: {
      type: Number,
      default: 0,
    },

    // A suspended account keeps all its content but cannot sign in or act. Suspending bumps
    // tokenVersion too, so existing sessions stop working immediately rather than lasting
    // until their access token happens to expire.
    suspended: {
      type: Boolean,
      default: false,
    },

    suspendedAt: {
      type: Date,
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
