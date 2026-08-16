const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    message: {
      type: String,
      required: true,
      trim: true,
      // Unbounded before this, so a single request could store up to the 1 MB body limit and
      // repeat it indefinitely.
      maxlength: [5000, 'Comment cannot exceed 5000 characters'],
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    replyCount: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  },
);

CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
