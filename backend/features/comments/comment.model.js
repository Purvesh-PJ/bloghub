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

    /*
      The comment this one replies to, or null for a top-level comment.

      Replies carry their parent's `post` so that post-scoped queries reach them at all — but
      that also meant a reply came back from `GET /comments/post/:postId` as a top-level
      comment *and* nested under its parent, so every thread showed each reply twice and the
      response count double-counted them. Listing filters on `parent: null` now.
    */
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
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

// Backs the top-level listing, which filters on `parent` as well as `post`.
CommentSchema.index({ post: 1, parent: 1, createdAt: -1 });
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
