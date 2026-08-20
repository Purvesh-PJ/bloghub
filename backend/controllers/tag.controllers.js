const Tag = require('../models/tag.model');
const Post = require('../models/post.model');
const asyncHandler = require('../middlewares/asyncHandler');
const { badRequest, notFound, conflict } = require('../utils/AppError');

const MAX_TAG_LENGTH = 30;

/**
 * Returns all tags, augmented with the number of public posts filed under each.
 *
 * Sorts by postCount descending so the most popular / active community topics
 * naturally rise to the top for discovery.
 */
exports.getTags = asyncHandler(async (req, res) => {
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

  res.status(200).json({
    success: true,
    message: 'Tags found successfully',
    data: tags,
  });
});

exports.postTags = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    throw badRequest('Tag name required', 'MissingName');
  }

  const cleanName = name.trim().toLowerCase();

  if (cleanName.length > MAX_TAG_LENGTH) {
    throw badRequest(`Tag name cannot exceed ${MAX_TAG_LENGTH} characters`, 'NameTooLong');
  }

  const existing = await Tag.findOne({ name: cleanName }).lean();
  if (existing) {
    return res.status(200).json({ success: true, message: 'Tag already exists', data: existing });
  }

  const tag = await Tag.create({ name: cleanName, posts: [] });
  res.status(201).json({ success: true, message: 'Tag created', data: tag });
});

/**
 * Removes a tag from the taxonomy.
 *
 * The admin console could create tags and never remove one, so a typo entered there stayed on
 * the discovery rail for good. Refuses while stories still carry the tag rather than silently
 * leaving those posts pointing at a row that no longer exists — the administrator is told how
 * many, so the decision to retag them is theirs.
 */
exports.deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.findById(id).lean();
  if (!tag) throw notFound('Tag not found');

  const inUse = await Post.countDocuments({ tags: id });
  if (inUse > 0) {
    throw conflict(
      `${inUse} ${inUse === 1 ? 'story is' : 'stories are'} still filed under “${tag.name}”`,
      'TagInUse',
    );
  }

  await Tag.deleteOne({ _id: id });

  res.status(200).json({ success: true, message: `“${tag.name}” removed` });
});
