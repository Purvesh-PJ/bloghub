const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
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

// Categories are looked up by name, and duplicates are meaningless.
CategorySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);
