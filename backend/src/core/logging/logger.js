const pino = require('pino');

const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';

const defaultLevel = isTest ? 'silent' : process.env.LOG_LEVEL || (isDev ? 'debug' : 'info');

const logger = pino({
  level: defaultLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'body.password',
      'body.confirmPassword',
      'body.token',
      'password',
      'confirmPassword',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
    ],
    censor: '[REDACTED]',
  },
});

module.exports = logger;
