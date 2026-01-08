const Post = require('../models/post.model');
const Tag = require('../models/tag.model');

exports.getTags = async (req, res) => {
  try {
    const tags = Tag.find();
    if (tags) {
      return res.status(202).json({
        success: 'true',
        message: 'tags found succesfully',
        data: tags,
      });
    } else {
      return res.status(404).json({
        success: 'false',
        message: 'tags not found',
        data: tags,
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Error : ',
      error,
    });
  }
};

exports.postTags = async (req, res) => {
  try {
  } catch (error) {}
};
