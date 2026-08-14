const mongoose = require('mongoose');

const ReadSchema = mongoose.Schema(
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

ReadSchema.index({ post: 1, createdAt: -1 });
ReadSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Read', ReadSchema);
