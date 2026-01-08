const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controllers');

router.get('/', categoryController.getCategories);
router.post('/', categoryController.postCats);
router.post('/categoriesCollection', categoryController.postCategoryCollection);
router.put('/updateCategoriesCollection/:id', categoryController.updateCategoryCollection);

module.exports = router;
