const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  },

  {
    timestamps: true,
  },
);

// One like per user per post, enforced by the database rather than by a racy findOne.
LikeSchema.index({ post: 1, user: 1 }, { unique: true });
LikeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Like', LikeSchema);
