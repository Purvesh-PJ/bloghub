const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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

module.exports = mongoose.model('Tag', TagSchema);
