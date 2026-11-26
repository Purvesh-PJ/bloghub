const path = require('path');

// =========================================================================
// 1. Environment Bootstrap (Load & Validate Before Module Imports)
// =========================================================================
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { assertEnv } = require('./config/env');
assertEnv();

// =========================================================================
// 2. Dependencies & Module Imports
// =========================================================================
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

const { connectDB } = require('./config/db');
const { errorHandler } = require('./core/errors');
const { healthRoutes } = require('./core/health');
const { logger, requestLogger } = require('./core/logging');
const { generalLimiter } = require('./core/security');

const { authRoutes } = require('./modules/auth');
const { commentRoutes } = require('./modules/comments');
const { analyticsRoutes, pageViewRoutes, userActivityRoutes } = require('./modules/analytics');
const { likeRoutes, postRoutes, searchRoutes, tagRoutes } = require('./modules/posts');
const { settingsRoutes, userRoutes } = require('./modules/users');

// =========================================================================
// 3. Database & Express App Initialization
// =========================================================================
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Trust one proxy hop so `req.ip` reflects the real client IP behind Vercel/Nginx.
app.set('trust proxy', 1);

// =========================================================================
// 4. Global Edge Middlewares
// =========================================================================
app.use(requestLogger);
app.use(helmet());

const clientUrl = process.env.CLIENT_URL;
app.use(clientUrl ? cors({ origin: clientUrl, credentials: true }) : cors({ origin: '*' }));

app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

// =========================================================================
// 5. Routes & Centralized Error Handling
// =========================================================================
app.use(healthRoutes);

const apiRouter = express.Router();
apiRouter.use(generalLimiter);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/posts', postRoutes);
apiRouter.use('/tags', tagRoutes);
apiRouter.use('/search', searchRoutes);
apiRouter.use('/likes', likeRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/comments', commentRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/page-views', pageViewRoutes);
apiRouter.use('/user-activity', userActivityRoutes);

app.use('/api', apiRouter);
app.use(errorHandler);

// =========================================================================
// 6. Server Boot & Graceful Shutdown
// =========================================================================
const PORT = process.env.PORT || 4000;
const shouldListen = process.env.NODE_ENV !== 'test' && !process.env.VERCEL;

if (shouldListen) {
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });

  const shutdown = (signal) => {
    logger.info({ signal }, 'Shutting down HTTP server gracefully');
    server.close(async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = app;
