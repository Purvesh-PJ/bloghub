const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const View = require('../models/view.model');
const User = require('../models/user.model');

// Get all user activity for admin
exports.getAllUserActivity = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get recent posts
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('author', 'username email')
      .select('title createdAt updatedAt');

    // Get recent comments
    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'username email')
      .populate('post', 'title')
      .select('content createdAt');

    // Get recent likes
    const recentLikes = await Like.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'username email')
      .populate('post', 'title');

    // Get recent views
    const recentViews = await View.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'username email')
      .populate('post', 'title');

    // Get total counts for pagination
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalLikes = await Like.countDocuments();
    const totalViews = await View.countDocuments();

    // Get active users count
    const activeUsers = await User.countDocuments({
      lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.json({
      posts: {
        data: recentPosts,
        total: totalPosts,
        page,
        totalPages: Math.ceil(totalPosts / limit),
      },
      comments: {
        data: recentComments,
        total: totalComments,
        page,
        totalPages: Math.ceil(totalComments / limit),
      },
      likes: {
        data: recentLikes,
        total: totalLikes,
        page,
        totalPages: Math.ceil(totalLikes / limit),
      },
      views: {
        data: recentViews,
        total: totalViews,
        page,
        totalPages: Math.ceil(totalViews / limit),
      },
      activeUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user activity' });
  }
};

// Get activity for a specific user
exports.getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get user's posts
    const userPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('title createdAt updatedAt');

    // Get user's comments
    const userComments = await Comment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('post', 'title')
      .select('content createdAt');

    // Get user's likes
    const userLikes = await Like.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('post', 'title');

    // Get user's views
    const userViews = await View.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('post', 'title');

    // Get total counts for pagination
    const totalPosts = await Post.countDocuments({ author: userId });
    const totalComments = await Comment.countDocuments({ user: userId });
    const totalLikes = await Like.countDocuments({ user: userId });
    const totalViews = await View.countDocuments({ user: userId });

    // Get user details
    const userDetails = await User.findById(userId).select('username email createdAt lastActive');

    res.json({
      user: userDetails,
      posts: {
        data: userPosts,
        total: totalPosts,
        page,
        totalPages: Math.ceil(totalPosts / limit),
      },
      comments: {
        data: userComments,
        total: totalComments,
        page,
        totalPages: Math.ceil(totalComments / limit),
      },
      likes: {
        data: userLikes,
        total: totalLikes,
        page,
        totalPages: Math.ceil(totalLikes / limit),
      },
      views: {
        data: userViews,
        total: totalViews,
        page,
        totalPages: Math.ceil(totalViews / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user activity' });
  }
};

// Get recent activity timeline for a user
exports.getUserTimeline = async (req, res) => {
  try {
    const { userId } = req.params;

    // Combine all user activity into a single timeline
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title createdAt')
      .lean()
      .then((posts) =>
        posts.map((post) => ({
          ...post,
          type: 'post',
          action: 'created a post',
        })),
      );

    const comments = await Comment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('post', 'title')
      .select('content createdAt')
      .lean()
      .then((comments) =>
        comments.map((comment) => ({
          ...comment,
          type: 'comment',
          action: 'commented on',
        })),
      );

    const likes = await Like.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('post', 'title')
      .lean()
      .then((likes) =>
        likes.map((like) => ({
          ...like,
          type: 'like',
          action: 'liked',
        })),
      );

    // Combine and sort all activities by date
    const timeline = [...posts, ...comments, ...likes]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);

    res.json(timeline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user timeline' });
  }
};

// Get moderation log (admin only)
exports.getModerationLog = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // This would typically come from a separate moderation log collection
    // For now, we'll simulate it with post updates and deletions
    const postUpdates = await Post.find({ updatedAt: { $ne: null } })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('author', 'username email')
      .select('title createdAt updatedAt')
      .lean()
      .then((posts) =>
        posts.map((post) => ({
          ...post,
          type: 'post_update',
          action: 'updated',
          timestamp: post.updatedAt,
        })),
      );

    // In a real application, you would have a dedicated moderation log collection
    // that tracks all moderation actions

    res.json({
      data: postUpdates,
      page,
      limit,
      total: await Post.countDocuments({ updatedAt: { $ne: null } }),
      totalPages: Math.ceil((await Post.countDocuments({ updatedAt: { $ne: null } })) / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching moderation log' });
  }
};
