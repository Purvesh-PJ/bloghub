const Post = require('../models/post.model');

exports.getSearchQueries = async (req, res) => {
  const { query } = req.params;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, message: 'Search query required' });
  }

  try {
    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const results = await Post.aggregate([
      {
        $match: { title: { $regex: sanitizedQuery, $options: 'i' } },
      },
      {
        $project: { title: 1, truncatedContent: { $substr: ['$content', 0, 200] } },
      },
    ]);

    results.forEach((element) => {
      const rawText = (element.truncatedContent || '').replace(/<[^>]*>?/gm, '');
      element.truncatedContent = rawText + '...';
    });

    return res.status(200).json({
      success: true,
      message: 'Search succesfully',
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in search :',
      error,
    });
  }
};
