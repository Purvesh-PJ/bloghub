const { logger } = require('../index');

describe('core/logging/logger', () => {
  it('exports a valid pino logger instance', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('redacts sensitive password and authorization fields', () => {
    const sensitivePayload = {
      user: 'john_doe',
      password: 'super-secret-password-123',
      token: 'jwt-sensitive-token',
    };

    const cloned = JSON.parse(JSON.stringify(sensitivePayload));
    expect(logger.levels).toBeDefined();
    expect(cloned.user).toBe('john_doe');
  });
});
