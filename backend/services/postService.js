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

  // console.log(imageURL);
  // console.log(title);
  // console.log(slug);
  // console.log(content);

  if (!imageURL || !title || !slug || !content) {
    throw new Error('All fields are required');
  }

  try {
    // Creation of new post
    const PostForUpdate = await Post.findByIdAndUpdate(postId, {
      imageURL: imageURL,
      title: title,
      slug: slug,
      content: content,
    });
    await PostForUpdate.save();

    return PostForUpdate;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Error creating post');
  }
};
