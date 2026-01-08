const { mongoose } = require('mongoose');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Profile = require('../models/user-profile.model');
const { ObjectId } = require('mongodb');

exports.getUser = async (req, res) => {
  try {
    const { user } = req;

    if (!user || !ObjectId.isValid(user)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id',
        error: 'InvalidUserIdException',
      });
    }

    const foundUser = await User.findById({ _id: user }).select('-password -posts').populate({
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
      const userPlainObject = foundUser.toObject(); // convert to plain object

      // Add null check for profile and image data
      let base64 = null;
      if (foundUser.profile && foundUser.profile.image && foundUser.profile.image.data) {
        const { contentType, data } = foundUser.profile.image;
        base64 = `data:${contentType};base64,${Buffer.from(data).toString('base64')}`;
      }

      // Create response object with safe image handling
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
  const { file, user, body } = req;
  const { username, email, bio } = body;
  const user_id = user;

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
        res.status(404).json({
          success: false,
          message: 'profile not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'profile updated successfully',
      });
    } else {
      const newProfile = new Profile({
        user: user,
        image: {
          data: file ? file.path : null,
          contentType: file ? file.mimetype : null,
        },
        bio: body.bio,
      });
      await newProfile.save();

      await User.findByIdAndUpdate(user_id, { $push: { profile: newProfile._id } }, { new: true });
      res.status(201).json({
        success: true,
        message: 'profile created succesfully',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
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
    const userId = req.user;
    const user = await User.findById(userId);

    if (user) {
      const postIds = user.posts.map((post) => post.toString());
      const userFilteredPostsByIds = await filterPostsByUserId(postIds);
      res.status(200).json(userFilteredPostsByIds);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);

  if (user) {
    try {
      const userProfile = await Profile.findOne({ user: user.id });
      if (userProfile) {
        // console.log(UserProfileDataByUserId);
        res.status(200).json({
          success: true,
          message: 'Profile found succesfully',
          data: {
            userProfile,
          },
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Personal details not found',
          error: 'ProfileNotFound',
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: 'ServerError',
      });
    }
  } else {
    res.status(404).json({
      success: true,
      message: 'User not found',
      error: 'UserNotFound',
    });
  }
};

exports.postUserProfile = async (req, res) => {
  try {
    const { user, file, body } = req;

    console.log(req);

    const newProfile = new Profile({
      user: user,
      image: {
        data: file.path,
        contentType: file.mimetype,
      },
      bio: body.bio,
    });

    await newProfile.save();
    res.status(201).json({ message: 'Profile saved succesfully' });
    console.log(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.followUser = async (req, res) => {
  const { toFollowId } = req.body;
  const followerId = req.user;

  if (toFollowId.toString() === followerId.toString()) {
    res.status(409).json({ message: 'Cannot follow yourself ' });
    return;
  }

  try {
    const addFollower = await Profile.findOneAndUpdate(
      { user: toFollowId },
      { $addToSet: { followers: followerId } },
    );

    const addFollowing = await Profile.findOneAndUpdate(
      { user: followerId },
      { $addToSet: { followings: toFollowId } },
    );

    const addFollowerCount = await Profile.findOneAndUpdate(
      { user: toFollowId },
      { $inc: { followersCount: 1 } },
    );

    const addFollowingCount = await Profile.findOneAndUpdate(
      { user: followerId },
      { $inc: { followingsCount: 1 } },
    );

    res.status(200).json({
      success: true,
      message: 'followed succesfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.unfollowUser = async (req, res) => {
  const toUnfollowId = req.body.toUnfollowId;
  const followerId = req.user;

  try {
    const removeFollower = await Profile.findOneAndUpdate(
      { user: toUnfollowId },
      { $pull: { followers: followerId } },
    );

    const removeFollowing = await Profile.findOneAndUpdate(
      { user: followerId },
      { $pull: { followings: toUnfollowId } },
    );

    const removeFollowerCount = await Profile.findOneAndUpdate(
      { user: toUnfollowId },
      { $inc: { followersCount: -1 } },
    );

    const removeFollowingCount = await Profile.findOneAndUpdate(
      { user: followerId },
      { $inc: { followingsCount: -1 } },
    );

    res.status(200).json({
      success: true,
      message: 'unfollowed succesfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.isFollowing = async (req, res) => {
  const tofollowId = req.params.id;
  const currentUser = req.user;

  try {
    const toFollowUser = await Profile.findOne({ user: currentUser });

    if (!toFollowUser) {
      return res.status(404).json({ message: 'Profile not found to unfollow' });
    }

    const isFollowing = toFollowUser.followings.includes(tofollowId);
    res.status(200).json({ isFollowing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
