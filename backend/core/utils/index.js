const { escapeRegex, containsIgnoreCase } = require('./regex');
const { visitorKey, DEDUPE_WINDOW_MS } = require('./visitor');

module.exports = {
  escapeRegex,
  containsIgnoreCase,
  visitorKey,
  DEDUPE_WINDOW_MS,
};
