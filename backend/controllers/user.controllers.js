const { mongoose } = require('mongoose');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Profile = require('../models/user-profile.model');
const { ObjectId } = require('mongodb');

exports.getUser = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id || req.user) : null;

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id',
        error: 'InvalidUserIdException',
      });
    }

    const foundUser = await User.findById(userId).select('-password -posts').populate({
      path: 'profile',
      select: '-followers -followings',
    });

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'UserNotFoundException',
      });
    } else {
      const userPlainObject = foundUser.toObject();

      let base64 = null;
      if (foundUser.profile && foundUser.profile.image && foundUser.profile.image.data) {
        const { contentType, data } = foundUser.profile.image;
        base64 = `data:${contentType};base64,${Buffer.from(data).toString('base64')}`;
      }

      const resposeUser = {
        ...userPlainObject,
        profile: {
          ...userPlainObject.profile,
          image:
            foundUser.profile && foundUser.profile.image
              ? {
                  ...userPlainObject.profile.image,
                  data: base64,
                }
              : null,
        },
      };

      return res.status(200).json({
        success: true,
        message: 'User found',
        User: resposeUser,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: 'ServerError',
    });
  }
};

exports.setUser = async (req, res) => {
  const { file, body } = req;
  const user_id = req.user ? (req.user.id || req.user._id || req.user) : null;
  const { username, email, bio } = body;

  try {
    const userData = {};
    if (username) userData.username = username;
    if (email) userData.email = email;

    const profileData = {};
    if (bio) profileData.bio = bio;

    if (file) {
      profileData.image = {
        data: file.path,
        contentType: file.mimetype,
      };
    }

    const updateUser = await User.findByIdAndUpdate(
      user_id,
      { $set: userData },
      { new: true, runValidators: true },
    );

    if (!updateUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const existingProfile = await Profile.findOne({ user: user_id });

    if (existingProfile) {
      const updateProfile = await Profile.findByIdAndUpdate(
        existingProfile._id,
        { $set: profileData },
        { new: true, runValidators: true },
      );

      if (!updateProfile) {
        return res.status(404).json({
          success: false,
          message: 'profile not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'profile updated successfully',
      });
    } else {
      const newProfile = new Profile({
        user: user_id,
        image: {
          data: file ? file.path : null,
          contentType: file ? file.mimetype : null,
        },
        bio: body.bio,
      });
      await newProfile.save();

      await User.findByIdAndUpdate(user_id, { $set: { profile: newProfile._id } }, { new: true });
      return res.status(201).json({
        success: true,
        message: 'profile created succesfully',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

async function filterPostsByUserId(postIds) {
  try {
    const postObjIds = postIds.map((postId) => new mongoose.Types.ObjectId(postId));
    const filteredPostsByUserId = await Post.find({ _id: { $in: postObjIds } });
    return filteredPostsByUserId;
  } catch (error) {
    console.error(error);
    throw error; // Handle the error appropriately in your application
  }
}

exports.getUserSelfPosts = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id || req.user) : null;
    const user = await User.findById(userId);

    if (user) {
      const postIds = user.posts.map((post) => post.toString());
      const userFilteredPostsByIds = await filterPostsByUserId(postIds);
      return res.status(200).json(userFilteredPostsByIds);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.user ? (req.user.id || req.user._id || req.user) : null;
  const user = await User.findById(userId);

  if (user) {
    try {
      const userProfile = await Profile.findOne({ user: user.id });
      if (userProfile) {
        return res.status(200).json({
          success: true,
          message: 'Profile found succesfully',
          data: {
            userProfile,
          },
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Personal details not found',
          error: 'ProfileNotFound',
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: 'ServerError',
      });
    }
  } else {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      error: 'UserNotFound',
    });
  }
};

exports.postUserProfile = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id || req.user) : null;
    const { file, body } = req;

    const newProfile = new Profile({
      user: userId,
      image: {
        data: file ? file.path : null,
        contentType: file ? file.mimetype : null,
      },
      bio: body ? body.bio : '',
    });

    await newProfile.save();
    return res.status(201).json({ message: 'Profile saved succesfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.followUser = async (req, res) => {
  const { toFollowId } = req.body;
  const followerId = req.user ? (req.user.id || req.user._id || req.user) : null;

  if (!toFollowId || !followerId) {
    return res.status(400).json({ success: false, message: 'Invalid follow parameters' });
  }

  if (toFollowId.toString() === followerId.toString()) {
    return res.status(409).json({ success: false, message: 'Cannot follow yourself' });
  }

  try {
    const targetProfile = await Profile.findOne({ user: toFollowId });
    if (!targetProfile) {
      return res.status(404).json({ success: false, message: 'Target profile not found' });
    }

    const isAlreadyFollowing = targetProfile.followers.some(
      (id) => id.toString() === followerId.toString(),
    );

    if (isAlreadyFollowing) {
      return res.status(200).json({ success: true, message: 'Already following user' });
    }

    await Profile.findOneAndUpdate(
      { user: toFollowId },
      { $addToSet: { followers: followerId }, $inc: { followersCount: 1 } },
    );
    await Profile.findOneAndUpdate(
      { user: followerId },
      { $addToSet: { followings: toFollowId }, $inc: { followingsCount: 1 } },
    );

    return res.status(200).json({
      success: true,
      message: 'followed succesfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.unfollowUser = async (req, res) => {
  const toUnfollowId = req.body.toUnfollowId;
  const followerId = req.user ? (req.user.id || req.user._id || req.user) : null;

  if (!toUnfollowId || !followerId) {
    return res.status(400).json({ success: false, message: 'Invalid unfollow parameters' });
  }

  try {
    const targetProfile = await Profile.findOne({ user: toUnfollowId });
    if (!targetProfile) {
      return res.status(404).json({ success: false, message: 'Target profile not found' });
    }

    const isFollowing = targetProfile.followers.some(
      (id) => id.toString() === followerId.toString(),
    );

    if (!isFollowing) {
      return res.status(200).json({ success: true, message: 'Not following user' });
    }

    await Profile.findOneAndUpdate(
      { user: toUnfollowId },
      { $pull: { followers: followerId }, $inc: { followersCount: -1 } },
    );
    await Profile.findOneAndUpdate(
      { user: followerId },
      { $pull: { followings: toUnfollowId }, $inc: { followingsCount: -1 } },
    );

    return res.status(200).json({
      success: true,
      message: 'unfollowed succesfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.isFollowing = async (req, res) => {
  const tofollowId = req.params.id;
  const currentUser = req.user ? (req.user.id || req.user._id || req.user) : null;

  try {
    const userProfile = await Profile.findOne({ user: currentUser });

    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const isFollowing = userProfile.followings.some(
      (id) => id.toString() === tofollowId.toString(),
    );
    return res.status(200).json({ isFollowing });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserSettings = (req, res) => {
  try {
  } catch (error) {}
};

exports.postUserSettings = (req, res) => {
  try {
  } catch (error) {}
};
