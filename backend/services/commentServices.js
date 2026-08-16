const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const { badRequest, notFound } = require('../utils/AppError');

/**
 * Stores a comment and links it to its post.
 *
 * The caller is expected to have already confirmed the post is visible to this user; the
 * existence check here guards against it being deleted in between.
 */
exports.createComment = async ({ userId, postId, message }) => {
  if (!userId || !postId || !message) {
    throw badRequest('userId, postId and message are required');
  }

  const comment = await Comment.create({ message, user: userId, post: postId });

  // Targeted update rather than loading the post and calling save(): that rewrote every
  // field of the document, so two concurrent comments could clobber unrelated edits.
  const linked = await Post.updateOne({ _id: postId }, { $addToSet: { comments: comment._id } });

  if (linked.matchedCount === 0) {
    await Comment.deleteOne({ _id: comment._id });
    throw notFound('Post not found');
  }

  return comment;
};
