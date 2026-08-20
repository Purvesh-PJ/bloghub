const Post = require('../models/post.model');
const Tag = require('../models/tag.model');
const User = require('../models/user.model');
const asyncHandler = require('../middlewares/asyncHandler');
const { badRequest } = require('../utils/AppError');
const { escapeRegex } = require('../utils/regex');

const MAX_RESULTS = 50;
const EXCERPT_LENGTH = 200;

/** Strips markup and markdown noise so an excerpt reads as prose rather than as source. */
const toExcerpt = (content) =>
  String(content || '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/[#*_`>[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, EXCERPT_LENGTH);

/**
 * Full search across published stories.
 *
 * The search box has always offered "stories, tags, or authors" and the query behind it only
 * ever matched `title`, so searching for a topic you could see on the page, or for a writer
 * whose name was in front of you, returned nothing. It now matches the title, the body, the
 * tag names and the author's username, and returns enough of each post for the result card to
 * render an author and a date instead of a bare heading.
 */
exports.getSearchQueries = asyncHandler(async (req, res) => {
  const { query } = req.params;

  if (!query || typeof query !== 'string' || !query.trim()) {
    throw badRequest('Search query required', 'MissingQuery');
  }

  const pattern = escapeRegex(query.trim());
  const rx = { $regex: pattern, $options: 'i' };
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), MAX_RESULTS);

  // Resolved first so the post query can match on ids rather than joining twice.
  const [tags, authors] = await Promise.all([
    Tag.find({ name: rx }).select('_id').lean(),
    User.find({ username: rx }).select('_id').lean(),
  ]);

  const results = await Post.find({
    visibility: 'public',
    $or: [
      { title: rx },
      { content: rx },
      ...(tags.length ? [{ tags: { $in: tags.map((tag) => tag._id) } }] : []),
      ...(authors.length ? [{ user: { $in: authors.map((author) => author._id) } }] : []),
    ],
  })
    // A title match is what somebody usually means; recency breaks the tie among the rest.
    .select('title content imageURL createdAt user tags')
    .populate('user', 'username')
    .populate('tags', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const titleMatches = new RegExp(pattern, 'i');

  const data = results
    .map((post) => ({
      _id: post._id,
      title: post.title,
      imageURL: post.imageURL,
      createdAt: post.createdAt,
      user: post.user,
      tags: post.tags,
      // Reading time is estimated from the full body, so the caller is given its length
      // rather than being left to guess from a 200-character excerpt.
      contentLength: (post.content || '').length,
      truncatedContent: `${toExcerpt(post.content)}…`,
      matchedTitle: titleMatches.test(post.title || ''),
    }))
    .sort((a, b) => Number(b.matchedTitle) - Number(a.matchedTitle));

  res.status(200).json({
    success: true,
    message: 'Search successful',
    data,
    count: data.length,
  });
});
