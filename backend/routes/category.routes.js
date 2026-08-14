const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controllers');
const AuthUser = require('../middlewares/authenticateUser');

// Public read
router.get('/', categoryController.getCategories);

// Taxonomy management is an administrative action
router.post('/', AuthUser.authenticateUser, AuthUser.authorizeAdmin, categoryController.postCats);

// Attaching categories mutates a post, so it requires authentication; the controller
// additionally enforces post ownership.
router.post(
  '/categoriesCollection',
  AuthUser.authenticateUser,
  categoryController.postCategoryCollection,
);
router.put(
  '/updateCategoriesCollection/:id',
  AuthUser.authenticateUser,
  categoryController.updateCategoryCollection,
);

module.exports = router;
