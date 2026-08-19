const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Profile = require('../models/user-profile.model');
const asyncHandler = require('../middlewares/asyncHandler');
const { purgeAccount } = require('../services/accountService');
const { notFound, conflict, badRequest, unauthorized, forbidden } = require('../utils/AppError');

/**
 * Renders a stored avatar as a data URI.
 *
 * `image.data` is a Buffer of the image itself. It used to hold the *file path* multer wrote
 * to, which this function then base64-encoded — producing a data URI containing the text of a
 * path and therefore an image that never loaded.
 */
const avatarDataUri = (image) => {
  if (!image?.data || !image.contentType) return null;
  return `data:${image.contentType};base64,${Buffer.from(image.data).toString('base64')}`;
};

exports.getUser = asyncHandler(async (req, res) => {
  const foundUser = await User.findById(req.user.id).select('-password -posts').populate({
    path: 'profile',
    select: '-followers -followings',
  });

  if (!foundUser) {
    throw notFound('User not found', 'UserNotFoundException');
  }

  const plain = foundUser.toObject();

  res.status(200).json({
    success: true,
    message: 'User found',
    User: {
      ...plain,
      profile: plain.profile
        ? {
            ...plain.profile,
            image: { ...plain.profile.image, data: avatarDataUri(plain.profile.image) },
          }
        : null,
    },
  });
});

exports.setUser = asyncHandler(async (req, res) => {
  const { file, body } = req;
  const userId = req.user.id;
  const { username, email, bio } = body;

  const userData = {};
  if (username) userData.username = username;
  if (email) userData.email = email;

  const profileData = {};
  if (bio !== undefined) profileData.bio = bio;

  // The bytes, not the path. See avatarDataUri above for what the old behaviour produced.
  if (file) {
    profileData.image = { data: file.buffer, contentType: file.mimetype };
  }

  if (Object.keys(userData).length > 0) {
    // Checked up front so a clash reports as 409 with a useful message. The unique indexes
    // remain the real guard, and the error handler translates a duplicate-key race to 409 too.
    const clash = await User.findOne({
      _id: { $ne: userId },
      $or: [...(email ? [{ email }] : []), ...(username ? [{ username }] : [])],
    })
      .select('email')
      .lean();

    if (clash) {
      throw conflict(clash.email === email ? 'Email already exists' : 'Username already exists');
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true, runValidators: true },
    );
    if (!updated) throw notFound('User not found');
  }

  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: profileData },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  // Keep the back-reference in step; a profile created by upsert was previously left
  // unlinked from its user.
  await User.updateOne(
    { _id: userId, profile: { $exists: false } },
    { $set: { profile: profile._id } },
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
  });
});

// Sort keys the dashboard offers, mapped to the query they stand for. Restricted to a known
// set so the sort field cannot be chosen freely by the caller.
const POST_SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  title: { title: 1 },
  updated: { updatedAt: -1 },
};

/**
 * The author's own posts, paginated.
 *
 * Returned every post in one response before this, and the dashboard rendered all of them —
 * fine at ten posts, not at a few hundred. Filtering and sorting happen here rather than in
 * the browser for the same reason: the client should not need the whole collection in order
 * to show one page of it.
 */
exports.getUserSelfPosts = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = Math.min(req.query.limit || 10, 50);

  const filter = { user: req.user.id };

  if (['draft', 'private', 'public'].includes(req.query.visibility)) {
    filter.visibility = req.query.visibility;
  }

  if (req.query.q) {
    // Escaped: a title search containing regex metacharacters must be treated as text.
    filter.title = {
      $regex: String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      $options: 'i',
    };
  }

  const sort = POST_SORTS[req.query.sort] || POST_SORTS.newest;

  const [posts, total, counts] = await Promise.all([
    Post.find(filter)
      .populate('tags', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
    // Tab counts must reflect every post the author has, not just the page being shown.
    Post.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$visibility', count: { $sum: 1 } } },
    ]),
  ]);

  const byVisibility = counts.reduce((acc, row) => ({ ...acc, [row._id]: row.count }), {});

  res.status(200).json({
    success: true,
    data: posts,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    counts: {
      all: Object.values(byVisibility).reduce((sum, n) => sum + n, 0),
      public: byVisibility.public || 0,
      draft: byVisibility.draft || 0,
      private: byVisibility.private || 0,
    },
  });
});

exports.getUserProfile = asyncHandler(async (req, res) => {
  // This lookup used to sit above the try block, so a rejection became an unhandled promise
  // rejection rather than a response. asyncHandler now covers the whole handler.
  const userProfile = await Profile.findOne({ user: req.user.id });

  if (!userProfile) {
    throw notFound('Personal details not found', 'ProfileNotFound');
  }

  res.status(200).json({
    success: true,
    message: 'Profile found successfully',
    data: { userProfile },
  });
});

exports.postUserProfile = asyncHandler(async (req, res) => {
  const { file, body } = req;

  // Upsert rather than insert: the unique index on `user` means a second POST from the same
  // account used to fail with a duplicate-key error reported as a 500.
  await Profile.findOneAndUpdate(
    { user: req.user.id },
    {
      $set: {
        bio: body?.bio ?? '',
        ...(file && { image: { data: file.buffer, contentType: file.mimetype } }),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
  );

  res.status(201).json({ success: true, message: 'Profile saved successfully' });
});

exports.followUser = asyncHandler(async (req, res) => {
  const { toFollowId } = req.body;
  const followerId = req.user.id;

  if (toFollowId === followerId.toString()) {
    throw badRequest('Cannot follow yourself');
  }

  const target = await User.exists({ _id: toFollowId });
  if (!target) throw notFound('User not found');

  // $addToSet reports whether it actually added anything, so the counter only moves when the
  // set changed. The previous read-then-write left the counters drifting whenever two follows
  // raced, because both saw "not following yet" and both incremented.
  const followed = await Profile.updateOne(
    { user: toFollowId, followers: { $ne: followerId } },
    { $addToSet: { followers: followerId }, $inc: { followersCount: 1 } },
    { upsert: false },
  );

  if (followed.modifiedCount === 0) {
    return res.status(200).json({ success: true, message: 'Already following user' });
  }

  await Profile.updateOne(
    { user: followerId, followings: { $ne: toFollowId } },
    { $addToSet: { followings: toFollowId }, $inc: { followingsCount: 1 } },
  );

  res.status(200).json({ success: true, message: 'Followed successfully' });
});

exports.unfollowUser = asyncHandler(async (req, res) => {
  const { toUnfollowId } = req.body;
  const followerId = req.user.id;

  const unfollowed = await Profile.updateOne(
    { user: toUnfollowId, followers: followerId },
    { $pull: { followers: followerId }, $inc: { followersCount: -1 } },
  );

  if (unfollowed.modifiedCount === 0) {
    return res.status(200).json({ success: true, message: 'Not following user' });
  }

  await Profile.updateOne(
    { user: followerId, followings: toUnfollowId },
    { $pull: { followings: toUnfollowId }, $inc: { followingsCount: -1 } },
  );

  res.status(200).json({ success: true, message: 'Unfollowed successfully' });
});

exports.isFollowing = asyncHandler(async (req, res) => {
  const following = await Profile.exists({
    user: req.user.id,
    followings: req.params.id,
  });

  res.status(200).json({ success: true, isFollowing: Boolean(following) });
});

/**
 * Deletes the caller's account and everything belonging to it.
 *
 * Requires the password: an authenticated session alone is not enough authority to destroy
 * the account, for the same reason a password change requires it.
 *
 * Removal is deliberate rather than a soft flag — a person asking to be deleted should be
 * deleted. What survives is other people's data that merely referenced them: their follower
 * lists lose this id, and posts they had liked keep their counts.
 */
exports.deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId).select('password roles');
  if (!user) throw notFound('User not found');

  if (!(await bcrypt.compare(password, user.password))) {
    throw unauthorized('Password is incorrect', 'InvalidPassword');
  }

  // The one path that can leave the site with no administrator. The admin console refuses to
  // act on the caller's own account, so every route through it leaves at least the actor —
  // but nothing stops the last administrator deleting themselves from here.
  if (user.roles?.includes('admin')) {
    const others = await User.countDocuments({
      _id: { $ne: userId },
      roles: 'admin',
      suspended: { $ne: true },
    });

    if (others === 0) {
      throw forbidden(
        'You are the only administrator. Promote somebody else before deleting your account.',
        'LastAdmin',
      );
    }
  }

  // Shared with the administrator's version, so both clean up identically.
  await purgeAccount(userId);

  res.status(200).json({
    success: true,
    message: 'Your account and all its content have been deleted',
  });
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  // Bounded by the validator; an unbounded `limit` previously returned the whole table.
  const page = req.query.page || 1;
  const limit = Math.min(req.query.limit || 10, 50);

  const [users, totalUsers] = await Promise.all([
    User.find()
      .select('-password')
      .populate('profile', '-followers -followings -image')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: { total: totalUsers, page, limit, pages: Math.ceil(totalUsers / limit) },
  });
});
