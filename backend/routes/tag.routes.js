const express = require('express');
const router = express.Router();
const tagControllers = require('../controllers/tag.controllers');

router.get('/', tagControllers.getTags);
router.post('/',tagControllers.postTags);

module.exports = router;