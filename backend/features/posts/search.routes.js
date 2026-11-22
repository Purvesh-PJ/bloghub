const express = require('express');
const router = express.Router();
const SearchController = require('./search.controllers');

router.get('/:query', SearchController.getSearchQueries);

module.exports = router;
