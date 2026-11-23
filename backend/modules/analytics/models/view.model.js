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

    // Groups repeat requests from the same reader so refreshing a page does not count again.
    // See utils/visitor.js: an account id when signed in, a salted address hash when not.
    visitorKey: {
      type: String,
    },
  },

  {
    timestamps: true,
  },
);

ViewSchema.index({ post: 1, createdAt: -1 });
// Backs the "has this visitor been counted recently?" check on every tracking request.
ViewSchema.index({ post: 1, visitorKey: 1, createdAt: -1 });
ViewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('View', ViewSchema);
