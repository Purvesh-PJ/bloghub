const mongoose = require('mongoose');

const ViewSchema = new mongoose.Schema(
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

ViewSchema.index({ post: 1, createdAt: -1 });
ViewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('View', ViewSchema);
