const Post = require('../models/post.model');
const Tag = require('../models/tag.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Profile = require('../models/user-profile.model');
const asyncHandler = require('../middlewares/asyncHandler');
const { createPost, updatePost } = require('../services/postService');
const { getTrendingPosts } = require('../services/trendingService');
const { notFound, forbidden } = require('../utils/AppError');
const { containsIgnoreCase } = require('../utils/regex');

const MAX_PAGE_SIZE = 50;

exports.getBlogs = asyncHandler(async (req, res) => {
  // The validator has already bounded and coerced these.
  const page = req.query.page || 1;
  const limit = Math.min(req.query.limit || 20, MAX_PAGE_SIZE);
  const skip = (page - 1) * limit;

  // Public listing: only published posts. Drafts and private posts are reachable
  // through the owner-scoped endpoints, never from here.
  //
  // Administrators may opt into the unfiltered list with ?all=true, which is what the
  // moderation console needs. The flag is ignored for everyone else.
  const wantsAll = req.query.all === 'true';
  const isAdmin = req.user?.roles?.includes('admin');
  const filter = wantsAll && isAdmin ? {} : { visibility: 'public' };

  /*
    A single author's stories.

    The public profile page used to fetch the global feed and filter it in the browser, so it
    only ever saw whichever of that author's posts happened to fall in the first page of the
    whole site — usually none of them — and the counts it derived were wrong for the same
    reason. Filtering and paging belong here.
  */
  if (req.query.author) {
    filter.user = req.query.author;
  }

  /*
    Moderation controls, honoured only for the administrator's unfiltered listing.

    Deliberately gated on `wantsAll && isAdmin`: for anybody else `filter.visibility` is
    already pinned to 'public', and letting the query set it would turn the public feed into a
    way to list everybody's drafts.
  */
  if (wantsAll && isAdmin && ['draft', 'private', 'public'].includes(req.query.visibility)) {
    filter.visibility = req.query.visibility;
  }

  // Searching the listing by title. Escaped, so a term containing regex metacharacters is
  // matched as the text somebody typed.
  if (req.query.q) {
    filter.title = containsIgnoreCase(req.query.q);
  }

  /*
    Filtering by tag/topic happens here on the database level.
    Supports ?tag=react, ?topic=react, and ?category=react.
  */
  const topicParam = req.query.tag || req.query.topic || req.query.category;
  if (topicParam) {
    const cleanTopic = String(topicParam).trim().toLowerCase();
    const tag = await Tag.findOne({ name: cleanTopic }).select('_id').lean();

    if (tag) {
      filter.tags = tag._id;
    } else {
      filter._id = null; // An unknown topic matches nothing
    }
  }

  const [posts, total, visibilityCounts] = await Promise.all([
    Post.find(filter)
      .populate('user', 'username')
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Post.countDocuments(filter),
    /*
      Counts per visibility, for the moderation console's filter chips.

      They have to be computed over everything the console can see rather than over the page
      it is showing, or the chips report "3 drafts" when what they mean is "3 drafts on this
      page". Only issued for the administrator's listing; there is nothing to break down when
      the filter is pinned to public.
    */
    wantsAll && isAdmin
      ? Post.aggregate([{ $group: { _id: '$visibility', count: { $sum: 1 } } }])
      : null,
  ]);

  const byVisibility = (visibilityCounts ?? []).reduce(
    (acc, row) => ({ ...acc, [row._id]: row.count }),
    {},
  );

  res.status(200).json({
    success: true,
    message: 'Posts found successfully',
    data: posts,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    ...(visibilityCounts && {
      counts: {
        all: Object.values(byVisibility).reduce((sum, n) => sum + n, 0),
        public: byVisibility.public || 0,
        draft: byVisibility.draft || 0,
        private: byVisibility.private || 0,
      },
    }),
  });
});

/**
 * Posts ranked by recent engagement.
 *
 * `trendedBy: 'latest'` is not a failure — it means too little has happened in the window for
 * a ranking to mean anything, so the newest stories are returned and the caller is told to
 * label them as such. The landing page previously called the newest posts "trending"
 * unconditionally, which is the thing this is designed not to do.
 */
exports.getTrendingPosts = asyncHandler(async (req, res) => {
  const limit = Math.min(req.query.limit || 10, MAX_PAGE_SIZE);

  const { posts, window } = await getTrendingPosts({ limit });

  if (posts.length > 0) {
    return res.status(200).json({
      success: true,
      message: 'Trending posts found',
      data: posts,
      trendedBy: 'engagement',
      window,
    });
  }

  const latest = await Post.find({ visibility: 'public' })
    .populate('user', 'username')
    .populate('tags', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    message: 'Not enough recent activity to rank; returning the newest stories',
    data: latest,
    trendedBy: 'latest',
    window,
  });
});

exports.getSinglePost = asyncHandler(async (req, res) => {
  const singlePost = await Post.findById(req.params.id)
    .populate('user', 'username')
    .populate('likes', 'user')
    .populate({
      path: 'comments',
      populate: [
        { path: 'user', select: 'username', model: 'User' },
        { path: 'replies', populate: { path: 'user', select: 'username', model: 'User' } },
      ],
    })
    .populate('tags', 'name');

  if (!singlePost) {
    throw notFound('Post not found');
  }

  // A non-public post is only visible to its author and to administrators. 404 rather
  // than 403 so the response never confirms that an unpublished post exists.
  if (singlePost.visibility !== 'public') {
    const viewerId = req.user ? req.user.id || req.user._id : null;
    const isOwner = viewerId && singlePost.user?._id?.toString() === viewerId.toString();
    const isAdmin = req.user?.roles?.includes('admin');

    if (!isOwner && !isAdmin) {
      throw notFound('Post not found');
    }
  }

  res.status(200).json({
    success: true,
    message: 'Post found successfully',
    data: singlePost,
  });
});

exports.postBlogs = asyncHandler(async (req, res) => {
  const newPost = await createPost(req.user.id, req.body);

  await Profile.updateOne({ user: req.user.id }, { $inc: { postCount: 1 } });

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    postId: newPost._id,
  });
});

exports.putBlogs = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  const existingPost = await Post.findById(postId).select('user').lean();
  if (!existingPost) throw notFound('Post not found');

  if (
    existingPost.user &&
    existingPost.user.toString() !== req.user.id.toString() &&
    !req.user.roles?.includes('admin')
  ) {
    throw forbidden('Unauthorized to edit this post');
  }

  await updatePost(req.body, postId);

  res.status(200).json({
    success: true,
    message: 'Post updated successfully',
  });
});

/**
 * Applies one action to several of the caller's posts at once.
 *
 * Doing this as N separate requests from the browser meant a partial failure left the client
 * guessing which ones landed, and N round trips for what is one intent.
 *
 * Ownership is enforced by the query rather than checked per post: the filter itself is
 * scoped to the caller (or unrestricted for an administrator), so an id belonging to someone
 * else simply matches nothing instead of being acted on.
 */
exports.bulkUpdatePosts = asyncHandler(async (req, res) => {
  const { ids, action } = req.body;

  const isAdmin = req.user.roles?.includes('admin');
  const scope = { _id: { $in: ids }, ...(isAdmin ? {} : { user: req.user.id }) };

  if (action === 'delete') {
    const doomed = await Post.find(scope).select('_id user tags').lean();
    const doomedIds = doomed.map((post) => post._id);

    if (doomedIds.length > 0) {
      await Promise.all([
        Tag.updateMany(
          { _id: { $in: doomed.flatMap((post) => post.tags ?? []) } },
          { $pull: { posts: { $in: doomedIds } } },
        ),
        Comment.deleteMany({ post: { $in: doomedIds } }),
        User.updateMany({}, { $pull: { posts: { $in: doomedIds } } }),
      ]);

      await Post.deleteMany({ _id: { $in: doomedIds } });

      // Decrement each author's counter by however many of their posts went, clamped at zero.
      const perAuthor = doomed.reduce((acc, post) => {
        const key = String(post.user);
        return { ...acc, [key]: (acc[key] || 0) + 1 };
      }, {});

      await Promise.all(
        Object.entries(perAuthor).map(([userId, n]) =>
          Profile.updateOne({ user: userId, postCount: { $gte: n } }, { $inc: { postCount: -n } }),
        ),
      );
    }

    return res.status(200).json({
      success: true,
      message: `${doomedIds.length} ${doomedIds.length === 1 ? 'story' : 'stories'} deleted`,
      affected: doomedIds.length,
    });
  }

  // Remaining actions are visibility changes; the validator has already limited the values.
  const result = await Post.updateMany(scope, { $set: { visibility: action } });

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} ${result.modifiedCount === 1 ? 'story' : 'stories'} updated`,
    affected: result.modifiedCount,
  });
});

exports.deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  const post = await Post.findById(postId).select('user tags comments').lean();
  if (!post) throw notFound('Post not found');

  if (
    post.user &&
    post.user.toString() !== req.user.id.toString() &&
    !req.user.roles?.includes('admin')
  ) {
    throw forbidden('Unauthorized to delete this post');
  }

  // Counters belong to the post's author, not to whoever issued the delete — an
  // administrator moderating someone else's post must not lose their own post count.
  const authorId = post.user || req.user.id;

  // Independent cleanups, so there is nothing to gain from running them in series.
  await Promise.all([
    Tag.updateMany({ _id: { $in: post.tags ?? [] } }, { $pull: { posts: postId } }),
    Comment.deleteMany({ post: postId }),
    User.updateOne({ _id: authorId }, { $pull: { posts: postId } }),
  ]);

  await Post.deleteOne({ _id: postId });

  // Clamped at zero: a counter that drifted below zero previously stayed negative forever.
  await Profile.updateOne({ user: authorId, postCount: { $gt: 0 } }, { $inc: { postCount: -1 } });

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully',
  });
});
