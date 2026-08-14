const Like = require('../models/like.model');
const Post = require('../models/post.model');

// Create a like
exports.createLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user ? req.user.id || req.user._id || req.user : null;

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
    });

    await newLike.save();

    // Keep the denormalised array on the post in step, so a reader's like state can be
    // restored on reload without a second query.
    await Post.updateOne({ _id: postId }, { $addToSet: { likes: newLike._id } });

    res.status(201).json({
      success: true,
      message: 'Post liked successfully',
      data: newLike,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while liking the post' });
  }
};

// Get like by ID
exports.getLike = async (req, res) => {
  try {
    const { id } = req.params;

    const like = await Like.findById(id).populate('user', 'username').populate('post', 'title');

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
      .populate('user', 'username')
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
    const userId = req.user ? req.user.id || req.user._id || req.user : null;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Find and delete the like
    const deletedLike = await Like.findOneAndDelete({ post: postId, user: userId });

    if (!deletedLike) {
      return res.status(404).json({ error: 'Like not found' });
    }

    await Post.updateOne({ _id: postId }, { $pull: { likes: deletedLike._id } });

    res.json({ success: true, message: 'Post unliked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while unliking the post' });
  }
};
