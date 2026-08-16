const Post = require('../models/post.model');
const User = require('../models/user.model');

const VISIBILITIES = ['draft', 'private', 'public'];

const normalizeVisibility = (value) => (VISIBILITIES.includes(value) ? value : 'draft');

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `story-${Date.now()}`;

exports.createPost = async (userId, postData) => {
  if (!userId || !postData) {
    throw new Error('User ID and post data are required');
  }

  const title = (postData.title || '').trim();
  const content = postData.content;
  if (!title || !content) {
    throw new Error('Title and content are required to create a post');
  }

  const slug = (postData.slug || '').trim() || slugify(title);

  try {
    const newPost = new Post({
      user: userId,
      imageURL: postData.imageURL || '',
      title,
      slug,
      content,
      visibility: normalizeVisibility(postData.visibility),
    });

    await newPost.save();

    const user = await User.findById(userId);
    if (user) {
      if (!user.posts) user.posts = [];
      user.posts.push(newPost._id);
      await user.save();
    }

    return newPost;
  } catch (error) {
    console.error('[createPost error]:', error);
    throw new Error(error.message || 'Error creating post');
  }
};

exports.updatePost = async (post, postId) => {
  const targetId = typeof postId === 'object' ? postId._id || postId.id : postId;
  const existing = await Post.findById(targetId);
  if (!existing) {
    throw new Error('Post not found');
  }

  const title = post.title !== undefined ? String(post.title).trim() : existing.title;
  const content = post.content !== undefined ? post.content : existing.content;
  const slug = (post.slug && String(post.slug).trim()) || existing.slug || slugify(title);
  const imageURL = post.imageURL !== undefined ? post.imageURL : existing.imageURL;

  try {
    const update = {
      imageURL: imageURL || '',
      title,
      slug,
      content,
    };

    if (post.visibility !== undefined) {
      update.visibility = normalizeVisibility(post.visibility);
    }

    const updatedPost = await Post.findByIdAndUpdate(targetId, update, {
      new: true,
      runValidators: true,
    });

    return updatedPost;
  } catch (error) {
    console.error('[updatePost error]:', error);
    throw new Error(error.message || 'Error updating post');
  }
};
