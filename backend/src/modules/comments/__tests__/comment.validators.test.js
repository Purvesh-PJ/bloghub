const { validationResult } = require('express-validator');
const { commentRules } = require('../validators/comment.validators');

// Helper to run express-validator chains against a dummy request
const runRules = async (rules, req) => {
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
};

describe('validators/comment.validators', () => {
  it('validates commentRules', async () => {
    const invalidReq = { body: { message: '   ' } };
    const invalidErrors = await runRules(commentRules, invalidReq);
    expect(invalidErrors.isEmpty()).toBe(false);

    const validReq = { body: { message: 'Great insights!' } };
    const validErrors = await runRules(commentRules, validReq);
    expect(validErrors.isEmpty()).toBe(true);
  });
});
