const Post = require('../models/post.model');
const User = require('../models/user.model');

const VISIBILITIES = ['draft', 'private', 'public'];

// Falls back to 'draft' for anything the client did not send or that is not a known value,
// so an unexpected payload can never accidentally publish a post.
const normalizeVisibility = (value) => (VISIBILITIES.includes(value) ? value : 'draft');

exports.createPost = async (userId, postData) => {
  if (!userId || !postData) {
    throw new Error('Something missing to create new post');
  }

  try {
    // Creation of new post
    const newPost = new Post({
      user: userId,
      imageURL: postData.imageURL,
      title: postData.title,
      slug: postData.slug,
      content: postData.content,
      visibility: normalizeVisibility(postData.visibility),
    });

    await newPost.save();

    // Find user by id
    const user = await User.findById(userId);

    if (!user) {
      await Post.findByIdAndDelete(newPost._id);
      throw new Error('User not found');
    }

    // Attached created post to desired user
    user.posts.push(newPost._id);
    await user.save();

    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Error creating post', error.message);
  }
};

exports.updatePost = async (post, postId) => {
  const { imageURL, title, slug, content, visibility } = post;

  // imageURL is an optional cover image, so it is deliberately not required here.
  if (!title || !slug || !content) {
    throw new Error('Title, slug and content are required');
  }

  try {
    const targetId = typeof postId === 'object' ? postId._id || postId.id : postId;

    const update = { imageURL: imageURL || '', title, slug, content };
    // Only touch visibility when the caller actually sent one, so a partial update
    // cannot silently unpublish a live post.
    if (visibility !== undefined) {
      update.visibility = normalizeVisibility(visibility);
    }

    const updatedPost = await Post.findByIdAndUpdate(targetId, update, {
      new: true,
      runValidators: true,
    });

    return updatedPost;
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Error updating post');
  }
};
