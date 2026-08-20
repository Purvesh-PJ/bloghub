const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    imageURL: {
      type: String,
      trim: true,
      maxlength: 2048,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    visibility: {
      type: String,
      enum: ['draft', 'private', 'public'],
      default: 'draft',
    },

    content: {
      type: String,
      required: true,
      // Roughly a very long article. Bounded so a single account cannot fill the collection
      // one 1 MB request at a time.
      maxlength: [100000, 'Content cannot exceed 100000 characters'],
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],

    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'View',
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],

    /*
      When the author last changed the story itself.

      Distinct from `updatedAt`, which Mongoose bumps on any write to the document — including
      the denormalised pushes that record a comment, a like or a view. A post that has only
      ever been read and replied to therefore has `updatedAt > createdAt` without anybody
      having edited a word of it, which made "stories edited since publication" report every
      story anyone had engaged with. Set only by services/postService.updatePost.
    */
    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Public feed: filter by visibility, sort by recency.
PostSchema.index({ visibility: 1, createdAt: -1 });
// Author feeds and "my posts".
PostSchema.index({ user: 1, createdAt: -1 });
// The moderation log: edited stories, most recently edited first.
PostSchema.index({ editedAt: -1 });
// Slug lookups. Unique, because a slug that can repeat cannot identify a post — the field
// was previously generated and stored but never constrained, so duplicates accumulated
// silently. `createPost` resolves collisions before insert.
PostSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model('Post', PostSchema);
