const analyticsRoutes = require('./routes/analytics.routes');
const pageViewRoutes = require('./routes/page-view.routes');
const userActivityRoutes = require('./routes/user-activity.routes');
const AnalyticsController = require('./controllers/analytics.controllers');
const PageViewController = require('./controllers/page-view.controllers');
const UserActivityController = require('./controllers/user-activity.controllers');
const TrendingService = require('./services/trending.service');
const View = require('./models/view.model');
const Read = require('./models/read.model');

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
