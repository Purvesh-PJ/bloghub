const { validateObjectId, paginationRules } = require('../index');
const { validationResult } = require('express-validator');

describe('core/validation/validateObjectId', () => {
  it('accepts valid 24-character hexadecimal ObjectId', () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = {};
    const next = jest.fn();

    validateObjectId('id', 'params')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('rejects invalid or non-24 hex string with 400 AppError', () => {
    const req = { params: { id: 'invalid-id' } };
    const res = {};
    const next = jest.fn();

    validateObjectId('id', 'params')(req, res, next);
    expect(next).toHaveBeenCalled();
    const passedError = next.mock.calls[0][0];
    expect(passedError.status).toBe(400);
    expect(passedError.code).toBe('InvalidObjectId');
  });

  it('rejects non-string object queries to prevent injection attacks', () => {
    const req = { body: { postId: { $ne: null } } };
    const res = {};
    const next = jest.fn();

    validateObjectId('postId', 'body')(req, res, next);
    expect(next).toHaveBeenCalled();
    const passedError = next.mock.calls[0][0];
    expect(passedError.status).toBe(400);
  });
});

describe('core/validation/paginationRules', () => {
  const runRules = async (rules, req) => {
    for (const rule of rules) {
      await rule.run(req);
    }
    return validationResult(req);
  };

  it('accepts valid positive page and limit parameters', async () => {
    const req = { query: { page: '1', limit: '10' } };
    const errors = await runRules(paginationRules, req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('rejects page less than 1 or invalid numbers', async () => {
    const req = { query: { page: '0', limit: '101' } };
    const errors = await runRules(paginationRules, req);
    expect(errors.isEmpty()).toBe(false);
  });
});
