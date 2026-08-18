const Tag = require('../models/tag.model');

/**
 * Returns all tags, augmented with the number of public posts filed under each.
 *
 * Sorts by postCount descending so the most popular / active community topics
 * naturally rise to the top for discovery.
 */
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: 'posts',
          foreignField: '_id',
          as: 'postDocs',
          pipeline: [{ $match: { visibility: 'public' } }],
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          postCount: { $size: '$postDocs' },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { postCount: -1, name: 1 } },
    ]);

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
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Tag name required' });
    }
    const cleanName = String(name).trim().toLowerCase();
    const existing = await Tag.findOne({ name: cleanName });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Tag already exists', data: existing });
    }
    const tag = await Tag.create({ name: cleanName, posts: [] });
    return res.status(201).json({ success: true, message: 'Tag created', data: tag });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error creating tag', error: error.message });
  }
};
