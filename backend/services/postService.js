const Post = require('../models/post.model');
const User = require('../models/user.model');

exports.createPost = async (userId, postData) => {
  // console.log(userId);
  // console.log(postData);

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
  const { imageURL, title, slug, content } = post;

  if (!imageURL || !title || !slug || !content) {
    throw new Error('All fields are required');
  }

  try {
    const targetId = typeof postId === 'object' ? postId._id || postId.id : postId;
    const updatedPost = await Post.findByIdAndUpdate(
      targetId,
      {
        imageURL,
        title,
        slug,
        content,
      },
      { new: true, runValidators: true },
    );

    return updatedPost;
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Error updating post');
  }
};
