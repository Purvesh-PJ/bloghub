const Post = require('../models/post.model');

/*
  Trending — what people are actually engaging with lately.

  The landing page called a list of the twelve newest posts "Trending Across All Categories".
  It was not trending by any measure: publish anything and it went straight to the top, which
  is exactly what a reader notices and stops trusting.

  The scoring here is deliberately simple, because it has to be explainable and it has to be
  checkable by hand:

      score = views + (likes × 3) + (comments × 5) + (finished reads × 5)

  A view is someone opening the story. A like or a comment costs the reader something, so it
  counts for more. A *finished* read counts the same as a comment, because on a platform whose
  whole angle is read-through, somebody reaching the end is the strongest signal that the piece
  was worth their time.

  Two rules keep it honest:

    WINDOW      only activity from the last 14 days counts, so a post from a year ago with
                great lifetime numbers does not sit at the top forever, and a genuinely
                popular new post can overtake it.

    MIN_VIEWS   a story needs a floor of views in the window before it can rank at all.
                Without it, one view and one finished read scores 6 and beats a story with
                fifty views — noise would win.

  When too little has happened to rank anything, this returns nothing rather than guessing,
  and the caller says "Latest" instead of pretending to have found a trend.
*/

const WINDOW_DAYS = 14;
const MIN_VIEWS = 3;

const WEIGHTS = { view: 1, like: 3, comment: 5, read: 5 };

/** Counts documents in `collection` that point at each post and fall inside the window. */
const countsInWindow = (collection, since, as) => ({
  $lookup: {
    from: collection,
    let: { postId: '$_id' },
    pipeline: [
      { $match: { $expr: { $eq: ['$post', '$$postId'] }, createdAt: { $gte: since } } },
      { $count: 'n' },
    ],
    as,
  },
});

const firstOrZero = (field) => ({ $ifNull: [{ $arrayElemAt: [`$${field}.n`, 0] }, 0] });

/**
 * Ranks public posts by recent engagement.
 *
 * @param {object} [options]
 * @param {number} [options.limit] how many to return
 * @param {number} [options.windowDays]
 * @returns {Promise<{posts: object[], window: number}>} empty posts when nothing qualifies
 */
exports.getTrendingPosts = async ({ limit = 10, windowDays = WINDOW_DAYS } = {}) => {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

  const ranked = await Post.aggregate([
    { $match: { visibility: 'public' } },

    countsInWindow('views', since, 'windowViews'),
    countsInWindow('reads', since, 'windowReads'),
    countsInWindow('likes', since, 'windowLikes'),
    countsInWindow('comments', since, 'windowComments'),

    {
      $addFields: {
        views: firstOrZero('windowViews'),
        reads: firstOrZero('windowReads'),
        likes: firstOrZero('windowLikes'),
        comments: firstOrZero('windowComments'),
      },
    },

    // The floor. Applied before scoring so a story that nobody opened cannot rank on a
    // single like.
    { $match: { views: { $gte: MIN_VIEWS } } },

    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ['$views', WEIGHTS.view] },
            { $multiply: ['$likes', WEIGHTS.like] },
            { $multiply: ['$comments', WEIGHTS.comment] },
            { $multiply: ['$reads', WEIGHTS.read] },
          ],
        },
        // Reported alongside so the ranking can be shown rather than just asserted.
        readRate: {
          $cond: [
            { $gt: ['$views', 0] },
            { $round: [{ $multiply: [{ $divide: ['$reads', '$views'] }, 100] }, 0] },
            0,
          ],
        },
      },
    },

    { $sort: { score: -1, createdAt: -1 } },
    { $limit: limit },
    { $project: { _id: 1, score: 1, readRate: 1, views: 1, reads: 1 } },
  ]);

  if (ranked.length === 0) return { posts: [], window: windowDays };

  // Hydrated through the model rather than rebuilt in the pipeline, so the shape matches
  // every other post response and the populate config lives in one place.
  const byId = new Map(ranked.map((row) => [String(row._id), row]));

  const posts = await Post.find({ _id: { $in: ranked.map((row) => row._id) } })
    .populate('user', 'username')
    .populate('categories', 'name')
    .populate('tags', 'name')
    .lean();

  // $in does not preserve order, so restore the ranking and attach the figures behind it.
  const ordered = posts
    .map((post) => ({ ...post, trending: byId.get(String(post._id)) }))
    .sort((a, b) => b.trending.score - a.trending.score);

  return { posts: ordered, window: windowDays };
};

exports.TRENDING_WEIGHTS = WEIGHTS;
exports.TRENDING_MIN_VIEWS = MIN_VIEWS;
