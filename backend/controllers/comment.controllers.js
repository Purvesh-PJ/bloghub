const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const asyncHandler = require('../middlewares/asyncHandler');
const { createComment } = require('../services/commentServices');
const { notFound, forbidden } = require('../utils/AppError');

const MAX_PAGE_SIZE = 50;

/** True when the viewer may read the post — and therefore its comments. */
const canViewPost = (post, user) => {
  if (post.visibility === 'public') return true;
  if (!user) return false;
  return post.user?.toString() === user.id.toString() || (user.roles ?? []).includes('admin');
};

/**
 * Comments on one post, paginated.
 *
 * Replaces a handler that ran `Comment.find()` with no filter, no pagination and no
 * authentication, returning the entire collection to anonymous callers — every comment on
 * every draft and private post included.
 */
exports.getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const page = Math.max(req.query.page || 1, 1);
  const limit = Math.min(Math.max(req.query.limit || 20, 1), MAX_PAGE_SIZE);

  const post = await Post.findById(postId).select('visibility user').lean();
  if (!post) throw notFound('Post not found');

  // 404 rather than 403, matching getSinglePost: the response must not confirm that an
  // unpublished post exists.
  if (!canViewPost(post, req.user)) throw notFound('Post not found');

  const [comments, total] = await Promise.all([
    Comment.find({ post: postId })
      .populate('user', 'username')
      .populate({ path: 'replies', populate: { path: 'user', select: 'username' } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Comment.countDocuments({ post: postId }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Comments found successfully',
    data: comments,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
});

exports.postComments = asyncHandler(async (req, res) => {
  const { postId, message } = req.body;

  const post = await Post.findById(postId).select('visibility user').lean();
  if (!post) throw notFound('Post not found');
  if (!canViewPost(post, req.user)) throw notFound('Post not found');

  const createdComment = await createComment({ userId: req.user.id, postId, message });

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    comment: createdComment,
  });
});

exports.postUserReplyComments = asyncHandler(async (req, res) => {
  const { repliedCommentId, message } = req.body;

  const parent = await Comment.findById(repliedCommentId);
  if (!parent) throw notFound('Comment not found');

  const post = await Post.findById(parent.post).select('visibility user').lean();
  if (!post || !canViewPost(post, req.user)) throw notFound('Comment not found');

  // Carry the parent's post onto the reply, otherwise every post-scoped query misses it.
  const comment = await Comment.create({
    user: req.user.id,
    post: parent.post,
    message,
  });

  await Comment.updateOne(
    { _id: repliedCommentId },
    { $addToSet: { replies: comment._id }, $inc: { replyCount: 1 } },
  );

  res.status(201).json({
    success: true,
    message: 'Replied successfully',
    comment,
  });
});

/**
 * Removes a comment.
 *
 * Permitted for the comment's author, the author of the post it sits on (so a writer can
 * moderate their own thread), and administrators.
 */
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw notFound('Comment not found');

  const post = await Post.findById(comment.post).select('user').lean();

  const viewerId = req.user.id.toString();
  const isCommentAuthor = comment.user?.toString() === viewerId;
  const isPostAuthor = post?.user?.toString() === viewerId;
  const isAdmin = (req.user.roles ?? []).includes('admin');

  if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
    throw forbidden('You cannot delete this comment');
  }

  // Replies are separate documents referenced by the parent; deleting only the parent would
  // strand them as rows nothing points at.
  if (comment.replies?.length) {
    await Comment.deleteMany({ _id: { $in: comment.replies } });
  }

  await Comment.deleteOne({ _id: comment._id });
  await Comment.updateOne(
    { replies: comment._id },
    { $pull: { replies: comment._id }, $inc: { replyCount: -1 } },
  );
  await Post.updateOne({ _id: comment.post }, { $pull: { comments: comment._id } });

  res.status(200).json({ success: true, message: 'Comment deleted successfully' });
});
