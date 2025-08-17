const Like = require('../models/like.model');
const Post = require('../models/post.model');

// Create a like
exports.createLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user ? req.user._id : null;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user already liked the post
    const existingLike = await Like.findOne({ post: postId, user: userId });
    if (existingLike) {
      return res.status(400).json({ error: 'You already liked this post' });
    }
    
    // Create new like
    const newLike = new Like({
      post: postId,
      user: userId,
      timestamp: new Date()
    });
    
    await newLike.save();
    
    res.status(201).json({ message: 'Post liked successfully', like: newLike });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while liking the post' });
  }
};

// Get like by ID
exports.getLike = async (req, res) => {
  try {
    const { id } = req.params;
    
    const like = await Like.findById(id)
      .populate('user', 'username email')
      .populate('post', 'title');
      
    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }
    
    res.json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the like' });
  }
};

// Get likes for a post
exports.getPostLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const likes = await Like.find({ post: postId })
      .populate('user', 'username email')
      .sort({ timestamp: -1 });
      
    res.json(likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching post likes' });
  }
};

// Delete a like (unlike)
exports.deleteLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user ? req.user._id : null;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Find and delete the like
    const deletedLike = await Like.findOneAndDelete({ post: postId, user: userId });
    
    if (!deletedLike) {
      return res.status(404).json({ error: 'Like not found' });
    }
    
    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while unliking the post' });
  }
};
