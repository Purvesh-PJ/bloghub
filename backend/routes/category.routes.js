const express = require('express');
const router = express.Router();
const categoryControllers = require('../controllers/category.controllers');

router.get('/', categoryControllers.getCategories);
router.post('/', categoryControllers.postCats);
router.post('/categoriesCollection', categoryControllers.postCategoryCollection);
router.put('/updateCategoriesCollection/:id', categoryControllers.updateCategoryCollection);



module.exports = router;