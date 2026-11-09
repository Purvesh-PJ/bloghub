const crypto = require('crypto');
const pinoHttp = require('pino-http');
const logger = require('../utils/logger');

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID(),
  autoLogging: {
    ignore: (req) => {
      if (process.env.NODE_ENV === 'test') return true;
      if (req.url === '/health' || req.url === '/api/health') return true;
      return false;
    },
  },
  customProps: (req) => ({
    userId: req.user ? String(req.user.id || req.user._id) : undefined,
  }),
});

const requestLogger = (req, res, next) => {
  httpLogger(req, res);
  res.setHeader('x-request-id', req.id);
  next();
};

module.exports = requestLogger;
