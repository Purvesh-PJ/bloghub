const User = require('../models/user.model');
const Post = require('../models/post.model');
const Profile = require('../models/user-profile.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const View = require('../models/view.model');
const Read = require('../models/read.model');
const Category = require('../models/category.model');
const Tag = require('../models/tag.model');
const UserSettings = require('../models/user-settings.model');

/**
 * Removes an account and everything belonging to it.
 *
 * Shared by the self-service deletion in settings and the administrator's version, because
 * they must clean up identically — an account removed by a moderator should not leave debris
 * that the same account removing itself would have taken with it.
 *
 * What survives is other people's data that merely referenced this account: their follower
 * lists lose the id, and posts they had liked keep their counts.
 *
 * @param {string} userId
 * @returns {Promise<{posts: number}>}
 */
exports.purgeAccount = async (userId) => {
  const posts = await Post.find({ user: userId }).select('_id').lean();
  const postIds = posts.map((post) => post._id);

  await Promise.all([
    // The person's own content.
    Post.deleteMany({ user: userId }),
    Comment.deleteMany({ user: userId }),
    Like.deleteMany({ user: userId }),
    View.deleteMany({ user: userId }),
    Read.deleteMany({ user: userId }),
    Profile.deleteOne({ user: userId }),
    UserSettings.deleteOne({ user: userId }),

    // Everything on their posts that belonged to other people.
    Comment.deleteMany({ post: { $in: postIds } }),
    Like.deleteMany({ post: { $in: postIds } }),

    // References to them and their posts held elsewhere.
    Category.updateMany({}, { $pull: { posts: { $in: postIds } } }),
    Tag.updateMany({}, { $pull: { posts: { $in: postIds } } }),
    Profile.updateMany(
      { $or: [{ followers: userId }, { followings: userId }] },
      { $pull: { followers: userId, followings: userId } },
    ),
  ]);

  // Follower counters are derived from the arrays just trimmed, so recompute rather than
  // guess at how far each one moved.
  await Profile.updateMany({}, [
    {
      $set: {
        followersCount: { $size: { $ifNull: ['$followers', []] } },
        followingsCount: { $size: { $ifNull: ['$followings', []] } },
      },
    },
  ]);

  await User.deleteOne({ _id: userId });

  return { posts: postIds.length };
};
