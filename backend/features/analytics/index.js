const analyticsRoutes = require('./analytics.routes');
const pageViewRoutes = require('./page-view.routes');
const userActivityRoutes = require('./user-activity.routes');
const AnalyticsController = require('./analytics.controllers');
const PageViewController = require('./page-view.controllers');
const UserActivityController = require('./user-activity.controllers');
const TrendingService = require('./trending.service');
const View = require('./view.model');
const Read = require('./read.model');

module.exports = {
  analyticsRoutes,
  pageViewRoutes,
  userActivityRoutes,
  AnalyticsController,
  PageViewController,
  UserActivityController,
  TrendingService,
  View,
  Read,
};
