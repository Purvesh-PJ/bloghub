const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const View = require('../models/view.model');
const User = require('../models/user.model');
const asyncHandler = require('../middlewares/asyncHandler');
const { notFound } = require('../utils/AppError');

/*
  Activity feeds for the administration console.

  Every handler here used to catch its own errors and answer with a bare `{ error: '…' }`,
  outside the `{ success, data }` envelope the rest of the API uses. They also issued their
  counts one await at a time when none of them depends on another.
*/

const MAX_PAGE_SIZE = 50;

/** Page and limit, bounded so one request cannot ask for the whole table. */
const paging = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), MAX_PAGE_SIZE);
  return { page, limit, skip: (page - 1) * limit };
};

const section = (data, total, page, limit) => ({
  data,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

/** How many distinct accounts have opened anything in the last `days` days. */
const activeUserCount = async (days = 30) => {
  /*
    Derived from View rows rather than from a `lastActive` field on User.

    Nothing declares `lastActive` on the schema and nothing ever wrote it, so the query this
    replaces — `User.countDocuments({ lastActive: { $gte: … } })` — matched no documents and
    the console reported zero active users on every site, however busy.
  */
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const rows = await View.aggregate([
    { $match: { createdAt: { $gte: since }, user: { $ne: null } } },
    { $group: { _id: '$user' } },
    { $count: 'n' },
  ]);

  return rows[0]?.n ?? 0;
};

// Recent activity across the whole site.
exports.getAllUserActivity = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req);

  const [
    recentPosts,
    recentComments,
    recentLikes,
    recentViews,
    totalPosts,
    totalComments,
    totalLikes,
    totalViews,
    activeUsers,
  ] = await Promise.all([
    Post.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'username email')
      .select('title visibility createdAt updatedAt')
      .lean(),

    Comment.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'username email')
      .populate('post', 'title')
      .select('message parent createdAt')
      .lean(),

    Like.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'username email')
      .populate('post', 'title')
      .lean(),

    View.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'username email')
      .populate('post', 'title')
      .lean(),

    Post.countDocuments(),
    Comment.countDocuments(),
    Like.countDocuments(),
    View.countDocuments(),
    activeUserCount(),
  ]);

  res.status(200).json({
    success: true,
    message: 'Activity found',
    data: {
      posts: section(recentPosts, totalPosts, page, limit),
      comments: section(recentComments, totalComments, page, limit),
      likes: section(recentLikes, totalLikes, page, limit),
      views: section(recentViews, totalViews, page, limit),
      activeUsers,
    },
  });
});

// Everything one account has done. Scoped to that account or an administrator by the route.
exports.getUserActivity = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page, limit, skip } = paging(req);

  const userDetails = await User.findById(userId).select('username email createdAt').lean();
  if (!userDetails) throw notFound('User not found');

  const [
    userPosts,
    userComments,
    userLikes,
    userViews,
    totalPosts,
    totalComments,
    totalLikes,
    totalViews,
  ] = await Promise.all([
    Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('title visibility createdAt updatedAt')
      .lean(),

    Comment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('post', 'title')
      .select('message parent createdAt')
      .lean(),

    Like.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('post', 'title')
      .lean(),

    View.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('post', 'title')
      .lean(),

    Post.countDocuments({ user: userId }),
    Comment.countDocuments({ user: userId }),
    Like.countDocuments({ user: userId }),
    View.countDocuments({ user: userId }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Activity found',
    data: {
      user: userDetails,
      posts: section(userPosts, totalPosts, page, limit),
      comments: section(userComments, totalComments, page, limit),
      likes: section(userLikes, totalLikes, page, limit),
      views: section(userViews, totalViews, page, limit),
    },
  });
});

// One merged, time-ordered stream of what an account has done.
exports.getUserTimeline = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), MAX_PAGE_SIZE);

  // Each source contributes at most `limit` rows, so the merge below can never be starved of
  // one kind of event by a flood of another.
  const [posts, comments, likes] = await Promise.all([
    Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title visibility createdAt')
      .lean(),

    Comment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('post', 'title')
      .select('message parent post createdAt')
      .lean(),

    Like.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('post', 'title')
      .lean(),
  ]);

  const timeline = [
    ...posts.map((post) => ({ ...post, type: 'post', action: 'created a post' })),
    ...comments.map((comment) => ({
      ...comment,
      type: comment.parent ? 'reply' : 'comment',
      action: comment.parent ? 'replied on' : 'commented on',
    })),
    ...likes.map((like) => ({ ...like, type: 'like', action: 'liked' })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

  res.status(200).json({ success: true, message: 'Timeline found', data: timeline });
});

/**
 * Stories the author has edited since writing them, most recently edited first.
 *
 * There is no dedicated moderation-log collection, so this reports what can actually be
 * observed. Two filters were wrong before this one:
 *
 *   `{ updatedAt: { $ne: null } }` is true of every post ever created, so the log listed the
 *   whole collection as though all of it had been moderated.
 *
 *   `updatedAt > createdAt` looks right and is not: Mongoose bumps `updatedAt` on any write
 *   to the document, and recording a comment, a like or a view pushes an id onto an array on
 *   the post. A story nobody had edited but several people had replied to therefore appeared
 *   here as an edit.
 *
 * `editedAt` is stamped only by postService.updatePost, so it carries the intended meaning.
 * Posts edited before the field existed have none and will appear the next time they change.
 */
exports.getModerationLog = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req);

  const edited = { editedAt: { $ne: null } };

  const [posts, total] = await Promise.all([
    Post.find(edited)
      .sort({ editedAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'username email')
      .select('title visibility createdAt updatedAt editedAt')
      .lean(),
    Post.countDocuments(edited),
  ]);

  const data = posts.map((post) => ({
    ...post,
    type: 'post_update',
    action: 'updated',
    timestamp: post.editedAt,
  }));

  res.status(200).json({
    success: true,
    message: 'Moderation log found',
    data,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
});
