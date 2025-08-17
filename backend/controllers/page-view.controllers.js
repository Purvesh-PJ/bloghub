const View = require('../models/view.model');
const Post = require('../models/post.model');

// Create a page view
exports.createPageView = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user ? req.user._id : null;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Create new page view
    const newView = new View({
      post: postId,
      user: userId,
      timestamp: new Date()
    });
    
    await newView.save();
    
    res.status(201).json({ message: 'Page view recorded successfully', view: newView });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while recording page view' });
  }
};

// Get page view by ID
exports.getPageView = async (req, res) => {
  try {
    const { id } = req.params;
    
    const view = await View.findById(id)
      .populate('user', 'username email')
      .populate('post', 'title');
      
    if (!view) {
      return res.status(404).json({ error: 'Page view not found' });
    }
    
    res.json(view);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the page view' });
  }
};

// Get page views for a post
exports.getPostPageViews = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const views = await View.find({ post: postId })
      .populate('user', 'username email')
      .sort({ timestamp: -1 });
      
    res.json(views);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching post page views' });
  }
};

// Get page view count for a post
exports.getPostPageViewCount = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const count = await View.countDocuments({ post: postId });
      
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching page view count' });
  }
};
