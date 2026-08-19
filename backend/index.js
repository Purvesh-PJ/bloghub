const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Validate configuration before anything else, so a misconfigured deployment fails at
// boot rather than on a user's first request.
const { assertEnv } = require('./config/env');
assertEnv();

const app = express();

// Every request arrives through the platform's proxy, so without this Express reads the
// proxy's address as `req.ip` and the rate limiters below key every visitor to the same
// bucket — turning a per-client limit into a site-wide one that a single caller can exhaust
// for everybody. Trust exactly one hop; trusting all of them would let a client spoof
// X-Forwarded-For and sidestep the limit entirely.
app.set('trust proxy', 1);

// IMPORT DATABASE CONNECTION
const { connectDB } = require('./config/db');
// The test harness owns the connection when running under Jest.
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const errorHandler = require('./middlewares/errorHandler'); // Import error handling middleware

// IMPORT ROUTES
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');
const tagRoutes = require('./routes/tag.routes');
const commentRoutes = require('./routes/comment.routes');
const searchRoutes = require('./routes/search.routes');
const authRoutes = require('./routes/auth.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const likesRoutes = require('./routes/likes.routes');
const pageViewsRoutes = require('./routes/page-views.routes');
const userActivityRoutes = require('./routes/user-activity.routes');
const settingsRoutes = require('./routes/settings.routes');

const logger = require('./middlewares/logger'); // Import logging middleware

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const clientUrl = process.env.CLIENT_URL;

app.use(logger); // Use the logging middleware
app.use(helmet()); // Baseline security headers

// Credentialed CORS cannot use a wildcard origin. Authentication is bearer-token based, so
// when no CLIENT_URL is configured (development only — production requires it) fall back to
// an open origin without credentials rather than an invalid combination.
app.use(clientUrl ? cors({ origin: clientUrl, credentials: true }) : cors({ origin: '*' }));

// Bound request bodies so a single request cannot exhaust memory.
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

// Rate limits. Note: the default store is per-instance, so on a serverless platform these
// are approximate across cold starts. A shared store would make them exact.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true, // only failed attempts count towards the limit
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

// HEALTH — mounted directly on the app so monitoring probes bypass the rate limiter.
// Deliberately reveals nothing beyond liveness and readiness.
const mongoose = require('mongoose');

app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get(['/ready', '/api/ready'], async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ status: 'unavailable' });
  }
  try {
    await mongoose.connection.db.admin().ping();
    return res.status(200).json({ status: 'ready' });
  } catch {
    return res.status(503).json({ status: 'unavailable' });
  }
});

// ROUTES
const router = express.Router();
router.use(generalLimiter);
router.use('/auth', authLimiter);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/tags', tagRoutes);
router.use('/comments', commentRoutes);
router.use('/search', searchRoutes);
router.use('/auth', authRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/likes', likesRoutes);
router.use('/page-views', pageViewsRoutes);
router.use('/user-activity', userActivityRoutes);
router.use('/settings', settingsRoutes);

// Mounted once. The router used to be mounted at '/' as well, which gave every endpoint two
// URLs and doubled the surface to reason about, while vercel.json only ever forwards /api/*.
app.use('/api', router);

// Error handling middleware MUST be after routes
app.use(errorHandler);

// SERVER LISTENING
const PORT = process.env.PORT || 4000;
// Vercel invokes the exported app directly, and the test suite drives it through supertest;
// binding a port in either case is at best useless and at worst a leaked handle that keeps
// the test runner alive after the suite finishes.
const shouldListen = process.env.NODE_ENV !== 'test' && !process.env.VERCEL;
if (shouldListen) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
