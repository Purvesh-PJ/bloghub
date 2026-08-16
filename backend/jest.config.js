/*
  Suites share one in-memory MongoDB and clear collections between tests, so they must not
  run concurrently — hence `--runInBand` in the npm script.
*/
module.exports = {
  testEnvironment: 'node',
  // Environment first (the app asserts its config at import time), database second.
  setupFiles: ['<rootDir>/tests/env.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  // Starting the in-memory server on a cold cache is slow the first time it downloads a
  // binary; the default 5s is not enough.
  testTimeout: 30000,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middlewares/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    'validators/**/*.js',
  ],
  // Surfaces a handle left open by a test rather than letting the run hang.
  detectOpenHandles: true,
  forceExit: true,
};
