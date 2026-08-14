/**
 * Fails fast on a misconfigured deployment.
 *
 * Without this, a missing JWT_SECRET lets the process boot and serve reads, then surfaces
 * as a 500 on the first sign-in — in production, to a user.
 */

const REQUIRED = ['JWT_SECRET'];
const REQUIRED_IN_PRODUCTION = ['CLIENT_URL'];
const MIN_SECRET_LENGTH = 32;

function assertEnv() {
  const isProduction = process.env.NODE_ENV === 'production';
  const required = [...REQUIRED, ...(isProduction ? REQUIRED_IN_PRODUCTION : [])];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[Config] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (isProduction) {
    if (process.env.JWT_SECRET.length < MIN_SECRET_LENGTH) {
      console.error(
        `[Config] JWT_SECRET must be at least ${MIN_SECRET_LENGTH} characters in production`,
      );
      process.exit(1);
    }

    if (!process.env.JWT_REFRESH_SECRET) {
      console.warn(
        '[Config] JWT_REFRESH_SECRET is not set — refresh tokens fall back to JWT_SECRET. ' +
          'Set a distinct secret so a refresh token cannot be replayed as an access token.',
      );
    } else if (process.env.JWT_REFRESH_SECRET === process.env.JWT_SECRET) {
      console.error('[Config] JWT_REFRESH_SECRET must differ from JWT_SECRET');
      process.exit(1);
    }
  }
}

module.exports = { assertEnv };
