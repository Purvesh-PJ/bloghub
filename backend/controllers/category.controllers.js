const Category = require('../models/category.model');
const Post = require('../models/post.model');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * Categories, each with the number of published stories in it.
 *
 * The count is what lets a caller avoid offering a category that leads nowhere. Both the
 * landing page and search rendered a chip for every category an administrator had ever
 * created, so a reader could pick one with nothing behind it and land on an empty list —
 * "Lifestyle" existed with zero published stories and was offered anyway.
 *
 * `?withEmpty=true` returns the full list, which is what the editor and the admin console
 * want: a writer must be able to file a story under a category nobody has used yet.
 */
exports.getCategories = asyncHandler(async (req, res) => {
  const counts = await Post.aggregate([
    { $match: { visibility: 'public' } },
    { $unwind: '$categories' },
    { $group: { _id: '$categories', count: { $sum: 1 } } },
  ]);

  const countById = new Map(counts.map((row) => [String(row._id), row.count]));

  const categories = await Category.find().select('name').sort({ name: 1 }).lean();

  const withCounts = categories.map((category) => ({
    ...category,
    postCount: countById.get(String(category._id)) ?? 0,
  }));

  res.status(200).json({
    success: true,
    message: 'Categories found successfully',
    data: req.query.withEmpty === 'true' ? withCounts : withCounts.filter((c) => c.postCount > 0),
  });
});

exports.postCategoryCollection = async (req, res) => {
  try {
    const { categories, postId } = req.body;

    if (!Array.isArray(categories) || !postId) {
      return res.status(400).json({
        success: false,
        message: 'categories (array) and postId are required',
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Only the author (or an administrator) may re-categorise a post.
    const userId = req.user.id;
    const isOwner = post.user && post.user.toString() === userId.toString();
    if (!isOwner && !req.user.roles?.includes('admin')) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this post' });
    }

    const found = await Category.find({ name: { $in: categories } });
    const foundNames = found.map((cat) => cat.name);
    const unknown = categories.filter((name) => !foundNames.includes(name));

    const categoryIds = found.map((cat) => cat._id);

    // Await both writes so the response reflects work that actually completed.
    await Promise.all([
      Category.updateMany({ _id: { $in: categoryIds } }, { $addToSet: { posts: postId } }),
      Post.updateOne({ _id: postId }, { $addToSet: { categories: { $each: categoryIds } } }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Categories attached successfully',
      data: { attached: foundNames, unknown },
    });
  } catch (error) {
    console.error('[postCategoryCollection]', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    });
  }
};

exports.updateCategoryCollection = async (req, res) => {
  try {
    const { selectedCategories, removedCategories } = req.body;
    const post_id = req.params.id;

    const post = await Post.findById(post_id).populate('categories');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userId = req.user.id;
    const isOwner = post.user && post.user.toString() === userId.toString();
    if (!isOwner && !req.user.roles?.includes('admin')) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this post' });
    }

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
  try {
    const { category } = req.body;

    if (!category || !String(category).trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const name = String(category).trim();

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }

    const cat = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: 'Category created',
      data: cat,
    });
  } catch (error) {
    console.error('[postCats]', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the category',
    });
  }
};
