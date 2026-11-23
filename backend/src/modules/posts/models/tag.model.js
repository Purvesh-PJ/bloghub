const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // Stored lowercase so "React", "react" and "REACT" are one tag rather than three
      // competing for the same unique index.
      lowercase: true,
      maxlength: 30,
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

TagSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Tag', TagSchema);
