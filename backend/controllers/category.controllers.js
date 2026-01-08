const Category = require('../models/category.model');
const Post = require('../models/post.model');
// const { createCategory } = require('../services/categoryServices');

exports.getCategories = async (req, res) => {
  try {
    const Categories = await Category.find();

    res.status(200).json({
      success: true,
      message: 'categories get succesfully',
      data: Categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occured',
      error: error.message,
    });
  }
};

exports.postCategoryCollection = async (req, res) => {
  // console.log(req)
  try {
    const { categories, postId } = req.body;

    categories.map(async (cat) => {
      console.log(cat);

      const category = await Category.findOne({ name: cat });

      if (category && !category.posts.includes(postId)) {
        category.posts.push(postId);
      }
      await category.save();

      const post = await Post.findById(postId);

      if (post && !post.categories.includes(category._id)) {
        post.categories.push(category._id);
      }
      await post.save();
    });

    return res.status(200).json({
      success: true,
      message: 'Category created succesfully',
      // data : newCategory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

exports.updateCategoryCollection = async (req, res) => {
  // console.log(req.body);
  // console.log(req.params);
  try {
    const { selectedCategories, removedCategories } = req.body;
    const post_id = req.params.id;

    const post = await Post.findById(post_id).populate('categories');

    const categoriesToAdd = await Category.find({ name: { $in: selectedCategories } });
    const categoriesToRemove = await Category.find({ name: { $in: removedCategories } });

    const categoryIdsToAdd = categoriesToAdd.map((cat) => cat._id.toString());
    const categoryIdsToRemove = categoriesToRemove.map((cat) => cat._id.toString());

    const finalCategoriesToAdd = categoryIdsToAdd.filter(
      (catId) => !post.categories.some((postCat) => postCat._id.toString() === catId),
    );
    const finalCategoriesToRemove = categoryIdsToRemove.filter((catId) =>
      post.categories.some((postCat) => postCat._id.toString() === catId),
    );
    // console.log(finalCategoriesToRemove);

    if (finalCategoriesToAdd.length > 0 || finalCategoriesToRemove.length > 0) {
      if (finalCategoriesToRemove.length > 0) {
        await Category.updateMany(
          { _id: { $in: finalCategoriesToRemove } },
          { $pull: { posts: post_id } },
        );
        post.categories = post.categories.filter(
          (cat) => !finalCategoriesToRemove.includes(cat._id.toString()),
        );
      }

      if (finalCategoriesToAdd.length > 0) {
        await Category.updateMany(
          { _id: { $in: finalCategoriesToAdd } },
          { $addToSet: { posts: post_id } },
        );
        finalCategoriesToAdd.forEach((catId) => {
          if (!post.categories.map((cat) => cat._id.toString()).includes(catId)) {
            post.categories.push(catId);
          }
        });
      }

      await post.save();

      return res.json({
        success: true,
        message: 'Categories updated succesfully',
      });
    } else {
      return res.json({
        success: true,
        message: 'No change in categories',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

exports.postCats = async (req, res) => {
  // console.log(req.body);
  try {
    const { category } = req.body;

    const cat = new Category({
      name: category,
    });
    await cat.save();

    res.status(200).json({
      success: true,
      message: 'Category created',
      data: cat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: `${error.message || error.response}`,
    });
  }
};
