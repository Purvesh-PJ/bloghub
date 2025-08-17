const express = require('express');
const router = express.Router();
const SearchControllers = require('../controllers/search.controllers');

router.get('/:query', SearchControllers.getSearchQueries);



module.exports = router;