const postRoutes = require('./post.routes');
const likeRoutes = require('./like.routes');
const tagRoutes = require('./tag.routes');
const searchRoutes = require('./search.routes');
const PostController = require('./post.controllers');
const LikeController = require('./like.controllers');
const TagController = require('./tag.controllers');
const SearchController = require('./search.controllers');
const PostService = require('./post.service');
const Post = require('./post.model');
const Like = require('./like.model');
const Tag = require('./tag.model');
const postValidators = require('./post.validators');

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
