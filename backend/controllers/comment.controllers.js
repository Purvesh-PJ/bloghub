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

    const comment = new Comment({
      user: userId,
      message: message,
    });

    await comment.save();

    await Comment.findByIdAndUpdate(repliedCommentId, {
      $addToSet: { replies: comment._id },
      $inc: { replyCount: 1 },
    });

    res.status(200).json({
      success: true,
      message: 'replied succesfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};
