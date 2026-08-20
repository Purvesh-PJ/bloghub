const mongoose = require('mongoose');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const View = require('../models/view.model');
const Read = require('../models/read.model');
const Like = require('../models/like.model');
const Comment = require('../models/comment.model');
const asyncHandler = require('../middlewares/asyncHandler');
const { notFound, forbidden } = require('../utils/AppError');
const { visitorKey, DEDUPE_WINDOW_MS } = require('../utils/visitor');

// Counts documents per post in one grouped query. The alternative — countDocuments()
// inside a map over the posts — costs two round trips per post, so a writer with fifty
// posts paid for a hundred queries on every dashboard load.
const countByPost = async (Model, postIds) => {
  const rows = await Model.aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: '$post', count: { $sum: 1 } } },
  ]);
  return new Map(rows.map((row) => [String(row._id), row.count]));
};

const rate = (part, whole) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0);

/**
 * Figures for one post, computed from the events themselves.
 *
 * This used to read an `Analytics` document holding pre-aggregated totals. Nothing in the
 * running application ever wrote one — only the seed script did — so on any real database the
 * endpoint answered 404 for every post, and where a seeded document did exist its counters
 * were frozen at whatever the seed wrote. The collection is gone; these numbers are derived
 * from View, Read, Like and Comment, which are the rows that actually accumulate.
 *
 * Restricted to the post's author and administrators: per-post analytics are the author's
 * business, and the public count lives at GET /page-views/post/:postId/count.
 */
exports.getAnalytics = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id).select('title visibility user createdAt').lean();
  if (!post) throw notFound('Post not found');

  const isOwner = post.user?.toString() === req.user.id.toString();
  if (!isOwner && !req.user.roles?.includes('admin')) {
    throw forbidden('You cannot read this post’s analytics');
  }

  const [views, reads, likes, comments] = await Promise.all([
    View.countDocuments({ post: id }),
    Read.countDocuments({ post: id }),
    Like.countDocuments({ post: id }),
    Comment.countDocuments({ post: id }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Analytics found',
    data: {
      postId: post._id,
      title: post.title,
      visibility: post.visibility,
      createdAt: post.createdAt,
      views,
      reads,
      likes,
      comments,
      readRate: rate(reads, views),
    },
  });
});

/**
 * Analytics for one author's posts.
 *
 * Serves both `/analytics/user/:userId` and `/analytics/me`. The latter exists because the
 * dashboard only ever wants the caller's own figures, and making it derive its own id in
 * order to ask for them was needless — the token already says who is asking.
 *
 * The payload is wrapped in `{ success, data }` like the rest of the API. It used to be
 * returned bare, which is half of why the dashboard read nothing but zeroes.
 */
exports.getUserAnalytics = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.id;

  const userPosts = await Post.find({ user: userId })
    .select('title visibility createdAt')
    .sort({ createdAt: -1 })
    .lean();
  const postIds = userPosts.map((post) => post._id);

  const [viewsByPost, readsByPost] = await Promise.all([
    countByPost(View, postIds),
    countByPost(Read, postIds),
  ]);

  const postsAnalytics = userPosts.map((post) => {
    const views = viewsByPost.get(String(post._id)) || 0;
    const reads = readsByPost.get(String(post._id)) || 0;
    return {
      postId: post._id,
      title: post.title,
      visibility: post.visibility,
      createdAt: post.createdAt,
      views,
      reads,
      readRate: rate(reads, views),
    };
  });

  const totalViews = postsAnalytics.reduce((sum, post) => sum + post.views, 0);
  const totalReads = postsAnalytics.reduce((sum, post) => sum + post.reads, 0);

  // Ranked by reads rather than views: the point of the platform is who finished,
  // and a post with 900 openers and 20 finishers is not a top performer.
  const topPosts = [...postsAnalytics].sort((a, b) => b.reads - a.reads).slice(0, 5);

  res.json({
    success: true,
    data: {
      totalPosts: userPosts.length,
      totalViews,
      totalReads,
      readRate: rate(totalReads, totalViews),
      postsAnalytics,
      topPosts,
    },
  });
});

// What the signed-in reader has been reading. Powers the reader half of the dashboard,
// which is otherwise empty for an account that only reads: every other panel there is
// built from posts the account wrote.
exports.getReadingActivity = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  // One row per post, carrying the most recent time this reader opened it.
  const opened = await View.aggregate([
    { $match: { user: userId } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: '$post', lastOpenedAt: { $first: '$createdAt' } } },
    { $sort: { lastOpenedAt: -1 } },
    { $limit: 40 },
  ]);

  const openedIds = opened.map((row) => row._id);

  const finishedIds = new Set(
    (await Read.find({ user: userId, post: { $in: openedIds } }).distinct('post')).map(String),
  );

  const posts = await Post.find({ _id: { $in: openedIds }, visibility: 'public' })
    .select('title imageURL createdAt tags')
    .populate('user', 'username')
    .populate('tags', 'name')
    .lean();

  const postById = new Map(posts.map((post) => [String(post._id), post]));

  // A post deleted or made private since it was read simply drops out.
  const activity = opened
    .map((row) => {
      const post = postById.get(String(row._id));
      if (!post) return null;
      return { post, lastOpenedAt: row.lastOpenedAt, finished: finishedIds.has(String(row._id)) };
    })
    .filter(Boolean);

  // Wrapped in `{ success, data }` to match the rest of the API.
  res.json({
    success: true,
    data: {
      unfinished: activity.filter((item) => !item.finished).slice(0, 12),
      finished: activity.filter((item) => item.finished).slice(0, 12),
      totalOpened: activity.length,
      totalFinished: activity.filter((item) => item.finished).length,
    },
  });
});

/**
 * Site-wide figures for the administration console.
 *
 * Wrapped in `{ success, data }` like every other endpoint. It used to answer with a bare
 * object, so the console was the one screen reading a different shape from the rest of the
 * application — and the four separate sequential countDocuments() calls below are now issued
 * together, since none of them depends on another.
 */
exports.getAdminAnalytics = asyncHandler(async (req, res) => {
  const [totalPosts, totalUsers, totalViews, totalReads, publishedPosts] = await Promise.all([
    Post.countDocuments(),
    User.countDocuments(),
    View.countDocuments(),
    Read.countDocuments(),
    Post.countDocuments({ visibility: 'public' }),
  ]);

  // Top posts by views, and top users by post count.
  const [topPosts, topUsers, recentViews] = await Promise.all([
    Post.aggregate([
      {
        $lookup: { from: 'views', localField: '_id', foreignField: 'post', as: 'views' },
      },
      { $addFields: { viewCount: { $size: '$views' } } },
      { $sort: { viewCount: -1 } },
      { $limit: 5 },
      { $project: { _id: 1, title: 1, viewCount: 1, visibility: 1 } },
    ]),

    User.aggregate([
      {
        $lookup: { from: 'posts', localField: '_id', foreignField: 'user', as: 'posts' },
      },
      { $addFields: { postCount: { $size: '$posts' } } },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
      { $project: { _id: 1, username: 1, email: 1, postCount: 1 } },
    ]),

    View.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'username')
      .populate('post', 'title')
      .lean(),
  ]);

  res.status(200).json({
    success: true,
    message: 'Site analytics found',
    data: {
      totalPosts,
      publishedPosts,
      totalUsers,
      totalViews,
      totalReads,
      readRate: rate(totalReads, totalViews),
      topPosts,
      topUsers,
      recentViews,
    },
  });
});

// Track a new page view
/**
 * Records one tracking event, at most once per visitor per window.
 *
 * These endpoints are open to anonymous readers by design, and previously wrote a row for
 * every request — so holding down refresh inflated any post's numbers without limit, which
 * made every figure on the analytics dashboard meaningless.
 *
 * @param {import('mongoose').Model} Model View or Read
 * @param {string} label word used in the response message
 */
const track = (Model, label) =>
  asyncHandler(async (req, res) => {
    const { postId } = req.params;

    // Do not accumulate rows against posts that no longer exist, or that the caller could
    // not have been reading in the first place.
    const post = await Post.findById(postId).select('visibility user').lean();
    if (!post) throw notFound('Post not found');

    const isOwner = req.user && post.user?.toString() === req.user.id.toString();
    if (post.visibility !== 'public' && !isOwner) {
      throw notFound('Post not found');
    }

    const key = visitorKey(req);
    const since = new Date(Date.now() - DEDUPE_WINDOW_MS);

    const alreadyCounted = await Model.exists({
      post: postId,
      visitorKey: key,
      createdAt: { $gte: since },
    });

    if (alreadyCounted) {
      return res
        .status(200)
        .json({ success: true, message: `${label} already recorded`, counted: false });
    }

    await Model.create({
      post: postId,
      user: req.user?.id ?? null,
      visitorKey: key,
    });

    return res
      .status(201)
      .json({ success: true, message: `${label} tracked successfully`, counted: true });
  });

exports.trackPageView = track(View, 'View');

// Track a post read (user spent enough time on the page)
exports.trackPostRead = track(Read, 'Read');
