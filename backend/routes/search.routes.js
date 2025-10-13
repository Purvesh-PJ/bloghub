const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/search.controllers');

router.get('/:query', SearchController.getSearchQueries);

module.exports = router;