const morgan = require('morgan');

const logFormat = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
const logger = morgan(logFormat);

module.exports = logger;
