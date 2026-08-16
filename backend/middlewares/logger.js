const morgan = require('morgan');

const logFormat = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';

const logger = morgan(logFormat, {
  // A request log per assertion buries the actual test output. Failures still surface through
  // the assertions themselves.
  skip: () => process.env.NODE_ENV === 'test',
});

module.exports = logger;
