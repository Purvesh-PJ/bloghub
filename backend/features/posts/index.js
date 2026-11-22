const postRoutes = require('./routes/post.routes');
const likeRoutes = require('./routes/like.routes');
const tagRoutes = require('./routes/tag.routes');
const searchRoutes = require('./routes/search.routes');
const PostController = require('./controllers/post.controllers');
const LikeController = require('./controllers/like.controllers');
const TagController = require('./controllers/tag.controllers');
const SearchController = require('./controllers/search.controllers');
const PostService = require('./services/post.service');
const Post = require('./models/post.model');
const Like = require('./models/like.model');
const Tag = require('./models/tag.model');
const postValidators = require('./validators/post.validators');

module.exports = {
  postRoutes,
  likeRoutes,
  tagRoutes,
  searchRoutes,
  PostController,
  LikeController,
  TagController,
  SearchController,
  PostService,
  Post,
  Like,
  Tag,
  postValidators,
};
