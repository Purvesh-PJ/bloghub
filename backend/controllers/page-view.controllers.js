const View = require('../models/view.model');
const Post = require('../models/post.model');
const asyncHandler = require('../middlewares/asyncHandler');
const { notFound, forbidden } = require('../utils/AppError');

/*
  Recording a view lives in analytics.controllers.js. What remains here is the read side:
  a public count, and the per-view detail restricted to people entitled to see it.
*/

// Get page views for a post — author or administrator only, since the rows carry reader ids.
exports.getPostPageViews = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).select('user').lean();
  if (!post) throw notFound('Post not found');

  const isOwner = post.user?.toString() === req.user.id.toString();
  if (!isOwner && !req.user.roles?.includes('admin')) {
    throw forbidden('You cannot read this post’s visitor detail');
  }

  const views = await View.find({ post: postId })
    .populate('user', 'username')
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  res.status(200).json({ success: true, data: views });
});

// Get page view count for a post
exports.getPostPageViewCount = asyncHandler(async (req, res) => {
  const count = await View.countDocuments({ post: req.params.postId });
  res.status(200).json({ success: true, count });
});
