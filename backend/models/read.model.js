const mongoose = require('mongoose');

const ReadSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Read',
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  {
    timeStams: true,
  },
);

module.exports = mongoose.model('Read', ReadSchema);
