const Post = require('../models/post.model');
const Category = require('../models/category.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Profile = require('../models/user-profile.model');
const { createPost, updatePost } = require('../services/postService');

const MAX_PAGE_SIZE = 50;

exports.getBlogs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;

    // Public listing: only published posts. Drafts and private posts are reachable
    // through the owner-scoped endpoints, never from here.
    //
    // Administrators may opt into the unfiltered list with ?all=true, which is what the
    // moderation console needs. The flag is ignored for everyone else.
    const wantsAll = req.query.all === 'true';
    const isAdmin = req.user?.roles?.includes('admin');
    const filter = wantsAll && isAdmin ? {} : { visibility: 'public' };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('user', 'username')
        .populate('categories')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Posts found successfully',
      data: posts,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[getBlogs]', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching posts',
    });
  }
};

exports.getSinglePost = async (req, res) => {
  try {
    const singlePost = await Post.findById(req.params.id)
      .populate('user', 'username')
      .populate('likes', 'user')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'user',
            select: 'username',
            model: 'User',
          },
          {
            path: 'replies',
            populate: {
              path: 'user',
              select: 'username',
              model: 'User',
            },
          },
        ],
      })
      .populate('categories');

    if (!singlePost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        error: 'NotFound',
      });
    }

    // A non-public post is only visible to its author and to administrators. 404 rather
    // than 403 so the response never confirms that an unpublished post exists.
    if (singlePost.visibility !== 'public') {
      const viewerId = req.user ? req.user.id || req.user._id : null;
      const isOwner = viewerId && singlePost.user?._id?.toString() === viewerId.toString();
      const isAdmin = req.user?.roles?.includes('admin');

      if (!isOwner && !isAdmin) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
          error: 'NotFound',
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'post found succesfully',
      data: singlePost,
    });
  } catch (error) {
    console.error('[getSinglePost]', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the post',
    });
  }
};

exports.postBlogs = async (req, res) => {
  const user_id = req.user ? req.user.id || req.user._id || req.user : null;

  try {
    const newPost = await createPost(user_id, req.body);

    await Profile.findOneAndUpdate(
      { user: user_id },
      { $inc: { postCount: 1 } },
      { new: true, runValidators: true },
    );
    return res.status(201).json({
      success: true,
      message: 'post created successfully',
      postId: newPost._id,
    });
  } catch (error) {
    console.error(error.message);
    const statusCode =
      error.message === 'All fields are required' || error.message === 'User not found' ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while creating the blog post',
    });
  }
};

exports.putBlogs = async (req, res) => {
  try {
    const user_id = req.user ? req.user.id || req.user._id || req.user : null;
    const postData = req.body;
    const postId = req.params._id || req.params.id;

    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (
      existingPost.user &&
      existingPost.user.toString() !== user_id.toString() &&
      !req.user?.roles?.includes('admin')
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this post' });
    }

    await updatePost(postData, postId);

    return res.status(200).json({
      success: true,
      message: 'post updated successfully',
    });
  } catch (error) {
    console.error(error.message);
    const statusCode =
      error.message === 'All fields are required' || error.message === 'User not found' ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating the blog post',
    });
  }
};

exports.deletePost = async (req, res) => {
  const user_id = req.user ? req.user.id || req.user._id || req.user : null;
  try {
    const post_id = req.params._id || req.params.id;

    const post = await Post.findById(post_id).populate('categories').populate('comments');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (
      post.user &&
      post.user.toString() !== user_id.toString() &&
      !req.user?.roles?.includes('admin')
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this post' });
    }

    const postAttachedCategoryIds = post.categories.map((catId) => catId._id);
    const postAttachedCommentIds = post.comments.map((cmtId) => cmtId._id);

    await Category.updateMany(
      { _id: { $in: postAttachedCategoryIds } },
      { $pull: { posts: post_id } },
    );

    await Comment.deleteMany({ _id: { $in: postAttachedCommentIds } });

    // Counters belong to the post's author, not to whoever issued the delete — an
    // administrator moderating someone else's post must not lose their own post count.
    const authorId = post.user || user_id;

    await User.updateOne({ _id: authorId }, { $pull: { posts: post_id } });

    await Post.findByIdAndDelete(post_id);

    await Profile.findOneAndUpdate(
      { user: authorId },
      { $inc: { postCount: -1 } },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: 'post deleted succesfully',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: 'Internal Server error',
    });
  }
};
