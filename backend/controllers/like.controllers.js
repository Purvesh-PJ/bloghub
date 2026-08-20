const Like = require('../models/like.model');
const Post = require('../models/post.model');
const asyncHandler = require('../middlewares/asyncHandler');
const { notFound, conflict } = require('../utils/AppError');

/*
  Every handler here used to catch its own errors and answer with a bare `{ error: '…' }`,
  which is neither the `{ success, message, data }` envelope the rest of the API uses nor a
  shape the client reads — `error.response.data.message` was undefined on every failure, so
  the UI showed its generic fallback no matter what went wrong.
*/

/** True when the viewer may read the post, and therefore act on it. */
const canViewPost = (post, user) => {
  if (post.visibility === 'public') return true;
  if (!user) return false;
  return post.user?.toString() === user.id.toString() || (user.roles ?? []).includes('admin');
};

exports.createLike = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  const post = await Post.findById(postId).select('visibility user').lean();
  if (!post) throw notFound('Post not found');
  // 404 rather than 403, matching getSinglePost: the response must not confirm that an
  // unpublished post exists.
  if (!canViewPost(post, req.user)) throw notFound('Post not found');

  let newLike;
  try {
    newLike = await Like.create({ post: postId, user: userId });
  } catch (error) {
    // The unique index on { post, user } is the real guard. The previous findOne-then-create
    // could be passed by two concurrent requests before either wrote, and the duplicate-key
    // error that followed surfaced as a 500.
    if (error.code === 11000) {
      throw conflict('You have already liked this post', 'AlreadyLiked');
    }
    throw error;
  }

  // Keep the denormalised array on the post in step, so a reader's like state can be
  // restored on reload without a second query.
  await Post.updateOne({ _id: postId }, { $addToSet: { likes: newLike._id } });

  res.status(201).json({
    success: true,
    message: 'Post liked successfully',
    data: newLike,
  });
});

exports.getPostLikes = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).select('visibility user').lean();
  if (!post) throw notFound('Post not found');
  if (!canViewPost(post, req.user)) throw notFound('Post not found');

  const likes = await Like.find({ post: postId })
    // Sorted by createdAt. The old `timestamp` is not a field on the schema, so the sort was
    // a no-op and the order was whatever the storage engine happened to return.
    .sort({ createdAt: -1 })
    .populate('user', 'username')
    .lean();

  res.status(200).json({ success: true, message: 'Likes found', data: likes, count: likes.length });
});

exports.deleteLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const deletedLike = await Like.findOneAndDelete({ post: postId, user: req.user.id });
  if (!deletedLike) throw notFound('You have not liked this post', 'NotLiked');

  await Post.updateOne({ _id: postId }, { $pull: { likes: deletedLike._id } });

  res.status(200).json({ success: true, message: 'Post unliked successfully' });
});
