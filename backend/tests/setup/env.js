/*
  Configuration for the test run.

  index.js calls assertEnv() at import time and exits the process when a required variable is
  missing, so these must be set before any test file requires the app. Setting them here also
  keeps the suite independent of whatever .env a developer happens to have locally, and lets
  it run on CI with no secrets configured.
*/
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-access-secret-at-least-32-characters-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-characters-long';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
