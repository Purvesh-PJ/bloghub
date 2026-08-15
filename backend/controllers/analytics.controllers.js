const mongoose = require('mongoose');
const Analytics = require('../models/analytics.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const View = require('../models/view.model');
const Read = require('../models/read.model');

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

// Get analytics by blog post ID
exports.getAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const analytics = await Analytics.findOne({ blogPost: id });
    if (!analytics) {
      return res.status(404).json({ error: 'Analytics not found' });
    }
    res.json(analytics);
  } catch (error) {
    console.error('[getAnalytics]', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

// Get user analytics (for a specific user)
exports.getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;

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
      totalPosts: userPosts.length,
      totalViews,
      totalReads,
      readRate: rate(totalReads, totalViews),
      postsAnalytics,
      topPosts,
    });
  } catch (error) {
    console.error('[getUserAnalytics]', error);
    res.status(500).json({ error: 'An error occurred while fetching user analytics' });
  }
};

// What the signed-in reader has been reading. Powers the reader half of the dashboard,
// which is otherwise empty for an account that only reads: every other panel there is
// built from posts the account wrote.
exports.getReadingActivity = async (req, res) => {
  try {
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
      .select('title imageURL createdAt categories')
      .populate('user', 'username')
      .populate('categories', 'name')
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

    res.json({
      unfinished: activity.filter((item) => !item.finished).slice(0, 12),
      finished: activity.filter((item) => item.finished).slice(0, 12),
      totalOpened: activity.length,
      totalFinished: activity.filter((item) => item.finished).length,
    });
  } catch (error) {
    console.error('[getReadingActivity]', error);
    res.status(500).json({ error: 'An error occurred while fetching reading activity' });
  }
};

// Get admin analytics (overall site analytics)
exports.getAdminAnalytics = async (req, res) => {
  try {
    // Get total posts, users, views, and reads
    const totalPosts = await Post.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalViews = await View.countDocuments();
    const totalReads = await Read.countDocuments();

    // Get top posts by views
    const topPosts = await Post.aggregate([
      {
        $lookup: {
          from: 'views',
          localField: '_id',
          foreignField: 'post',
          as: 'views',
        },
      },
      {
        $addFields: {
          viewCount: { $size: '$views' },
        },
      },
      {
        $sort: { viewCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 1,
          title: 1,
          viewCount: 1,
        },
      },
    ]);

    // Get top users by post count
    const topUsers = await User.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user',
          as: 'posts',
        },
      },
      {
        $addFields: {
          postCount: { $size: '$posts' },
        },
      },
      {
        $sort: { postCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          postCount: 1,
        },
      },
    ]);

    // Get recent activity
    const recentViews = await View.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'username')
      .populate('post', 'title');

    res.json({
      totalPosts,
      totalUsers,
      totalViews,
      totalReads,
      readRate: totalViews > 0 ? (totalReads / totalViews) * 100 : 0,
      topPosts,
      topUsers,
      recentViews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching admin analytics' });
  }
};

// Track a new page view
exports.trackPageView = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user ? req.user.id || req.user._id || req.user : null;

    const newView = new View({
      post: postId,
      user: userId,
      timestamp: new Date(),
    });

    await newView.save();
    res.status(201).json({ message: 'View tracked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while tracking view' });
  }
};

// Track a post read (user spent enough time on the page)
exports.trackPostRead = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user ? req.user.id || req.user._id || req.user : null;

    const newRead = new Read({
      post: postId,
      user: userId,
      timestamp: new Date(),
    });

    await newRead.save();
    res.status(201).json({ message: 'Read tracked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while tracking read' });
  }
};
