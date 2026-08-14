const Comment = require('../models/comment.model');
const { createComment } = require('../services/commentServices');

exports.getComments = async (req, res) => {
  try {
    const Comments = await Comment.find();
    res.send(Comments);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

exports.postComments = async (req, res) => {
  try {
    const userId = req.user ? req.user.id || req.user._id || req.user : null;
    const { postId, message } = req.body;

    const createdComment = await createComment({ userId, postId, message });

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      comment: createdComment,
    });
  } catch (error) {
    console.error('Error while posting comment:', error.message);
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

exports.postUserReplyComments = async (req, res) => {
  try {
    const userId = req.user ? req.user.id || req.user._id || req.user : null;
    const { repliedCommentId, message } = req.body;

    if (!repliedCommentId || !message) {
      return res.status(400).json({
        success: false,
        message: 'repliedCommentId and message are required',
      });
    }

    const parent = await Comment.findById(repliedCommentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Carry the parent's post onto the reply, otherwise every post-scoped query misses it.
    const comment = new Comment({
      user: userId,
      post: parent.post,
      message: message,
    });

    await comment.save();

    await Comment.findByIdAndUpdate(repliedCommentId, {
      $addToSet: { replies: comment._id },
      $inc: { replyCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'replied succesfully',
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};
