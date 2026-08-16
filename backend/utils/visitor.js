const crypto = require('crypto');

/**
 * A stable, non-identifying key for the caller.
 *
 * View and read tracking is open to anonymous visitors, so without something to group
 * requests by, a single client could inflate any post's numbers simply by repeating the
 * request. A signed-in reader is keyed by account; everyone else by a hash of their address.
 *
 * The address is hashed rather than stored: the analytics only need to know that two requests
 * came from the same place, never where that place is. Salting with the app secret stops the
 * hash from being reversed by walking the (small) IPv4 space.
 *
 * @param {import('express').Request} req
 * @returns {string} key of the form 'u:<id>' or 'a:<hash>'
 */
const visitorKey = (req) => {
  if (req.user?.id) return `u:${req.user.id}`;

  // req.ip is only trustworthy because index.js sets 'trust proxy'.
  const source = `${req.ip || 'unknown'}|${req.headers['user-agent'] || ''}`;
  const hash = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'bloghub')
    .update(source)
    .digest('hex');

  return `a:${hash.slice(0, 32)}`;
};

// How long the same visitor's repeat requests are folded into the first one. Long enough to
// stop refresh-spam, short enough that genuinely returning tomorrow counts again.
const DEDUPE_WINDOW_MS = 6 * 60 * 60 * 1000;

module.exports = { visitorKey, DEDUPE_WINDOW_MS };
