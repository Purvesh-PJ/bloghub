const Analytics = require('../models/analytics.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const View = require('../models/view.model');
const Read = require('../models/read.model');

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
    res.status(500).json({ error: 'An error occurred' });
  }
};

// Get user analytics (for a specific user)
exports.getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's posts
    const userPosts = await Post.find({ author: userId });
    const postIds = userPosts.map((post) => post._id);

    // Get views, reads, and other analytics for these posts
    const views = await View.find({ post: { $in: postIds } }).countDocuments();
    const reads = await Read.find({ post: { $in: postIds } }).countDocuments();

    // Get analytics for each post
    const postsAnalytics = await Promise.all(
      userPosts.map(async (post) => {
        const postViews = await View.find({ post: post._id }).countDocuments();
        const postReads = await Read.find({ post: post._id }).countDocuments();
        return {
          postId: post._id,
          title: post.title,
          views: postViews,
          reads: postReads,
          readRate: postViews > 0 ? (postReads / postViews) * 100 : 0,
        };
      }),
    );

    // Get top performing posts
    const topPosts = [...postsAnalytics].sort((a, b) => b.views - a.views).slice(0, 5);

    res.json({
      totalPosts: userPosts.length,
      totalViews: views,
      totalReads: reads,
      readRate: views > 0 ? (reads / views) * 100 : 0,
      postsAnalytics,
      topPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user analytics' });
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
          foreignField: 'author',
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
    const userId = req.user ? req.user._id : null;

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
    const userId = req.user ? req.user._id : null;

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
