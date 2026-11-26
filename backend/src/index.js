const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

// Load from root repo .env or backend/.env
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Validate configuration before anything else so misconfigured deployments fail at boot.
const { assertEnv } = require('./config/env');
assertEnv();

const { connectDB } = require('./config/db');
const { errorHandler } = require('./core/errors');
const { healthRoutes } = require('./core/health');
const { requestLogger, logger } = require('./core/logging');
const { generalLimiter } = require('./core/security');

const { authRoutes } = require('./modules/auth');
const { userRoutes, settingsRoutes } = require('./modules/users');
const { postRoutes, likeRoutes, tagRoutes, searchRoutes } = require('./modules/posts');
const { commentRoutes } = require('./modules/comments');
const { analyticsRoutes, pageViewRoutes, userActivityRoutes } = require('./modules/analytics');

// The test harness owns the connection when running under Jest.
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Trust exactly one proxy hop so `req.ip` reflects the real client IP behind Vercel/Nginx.
app.set('trust proxy', 1);

// Global edge middlewares
app.use(requestLogger);
app.use(helmet());

const clientUrl = process.env.CLIENT_URL;
app.use(clientUrl ? cors({ origin: clientUrl, credentials: true }) : cors({ origin: '*' }));

// Bound request bodies so a single request cannot exhaust memory.
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

// Health & readiness probes bypass rate limiters
app.use(healthRoutes);

// API routes
const router = express.Router();
router.use(generalLimiter);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/tags', tagRoutes);
router.use('/comments', commentRoutes);
router.use('/search', searchRoutes);
router.use('/auth', authRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/likes', likeRoutes);
router.use('/page-views', pageViewRoutes);
router.use('/user-activity', userActivityRoutes);
router.use('/settings', settingsRoutes);

app.use('/api', router);

// Centralized error handler MUST be mounted after all routes.
app.use(errorHandler);

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
