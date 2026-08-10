const Tag = require('../models/tag.model');

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    return res.status(200).json({
      success: true,
      message: 'Tags found successfully',
      data: tags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching tags',
      error: error.message,
    });
  }
};

exports.postTags = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Tag name required' });
    }
    const tag = new Tag({ name });
    await tag.save();
    return res.status(201).json({ success: true, message: 'Tag created', data: tag });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error creating tag', error: error.message });
  }
};
