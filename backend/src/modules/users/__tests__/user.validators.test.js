const { validationResult } = require('express-validator');
const {
  updateAccountRules,
  suspendRules,
  roleRules,
  adminDeleteRules,
} = require('../validators/user.validators');

// Helper to run express-validator chains against a dummy request
const runRules = async (rules, req) => {
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
};

describe('validators/user.validators', () => {
  it('validates optional updateAccountRules fields correctly', async () => {
    const validReq = {
      body: {
        username: 'new_username',
        bio: 'Software engineer and open source contributor',
      },
    };
    const errors = await runRules(updateAccountRules, validReq);
    expect(errors.isEmpty()).toBe(true);
  });

  it('validates suspendRules and roleRules booleans', async () => {
    const suspendReq = { body: { suspended: true } };
    const suspendErrors = await runRules(suspendRules, suspendReq);
    expect(suspendErrors.isEmpty()).toBe(true);

    const roleReq = { body: { admin: false } };
    const roleErrors = await runRules(roleRules, roleReq);
    expect(roleErrors.isEmpty()).toBe(true);

    const invalidRoleReq = { body: { admin: 'not-a-boolean' } };
    const invalidRoleErrors = await runRules(roleRules, invalidRoleReq);
    expect(invalidRoleErrors.isEmpty()).toBe(false);
  });

  it('validates adminDeleteRules requiring admin password', async () => {
    const req = { body: { password: 'admin-password-123' } };
    const errors = await runRules(adminDeleteRules, req);
    expect(errors.isEmpty()).toBe(true);
  });
});
