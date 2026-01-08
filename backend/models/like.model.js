const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  },

  {
    timeStamps: true,
  },
);

module.exports = mongoose.model('Like', LikeSchema);
