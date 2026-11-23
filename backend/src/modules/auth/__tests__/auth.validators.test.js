const { validationResult } = require('express-validator');
const {
  signUpRules,
  signInRules,
  refreshRules,
  changePasswordRules,
  deleteAccountRules,
} = require('../validators/auth.validators');

// Helper to run express-validator chains against a dummy request
const runRules = async (rules, req) => {
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
};

describe('validators/auth.validators', () => {
  it('accepts valid sign up data', async () => {
    const req = {
      body: {
        username: 'valid_user-1',
        email: 'user@example.com',
        password: 'ValidPassphrase123',
        confirmPassword: 'ValidPassphrase123',
      },
    };

    const errors = await runRules(signUpRules, req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('rejects invalid username with spaces or special symbols', async () => {
    const req = {
      body: {
        username: 'user name!',
        email: 'valid@example.com',
        password: 'ValidPassphrase123',
        confirmPassword: 'ValidPassphrase123',
      },
    };

    const errors = await runRules(signUpRules, req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array().some((e) => e.path === 'username')).toBe(true);
  });

  it('rejects passwords shorter than MIN_PASSWORD_LENGTH or mismatched confirmPassword', async () => {
    const req = {
      body: {
        username: 'validuser',
        email: 'valid@example.com',
        password: 'short',
        confirmPassword: 'mismatch',
      },
    };

    const errors = await runRules(signUpRules, req);
    const errMap = errors.mapped();
    expect(errMap.password).toBeDefined();
    expect(errMap.confirmPassword).toBeDefined();
  });

  it('accepts valid sign in rules and rejects empty credential or password', async () => {
    const validReq = {
      body: { credential: 'testuser', password: 'secretpassword' },
    };
    const validErrors = await runRules(signInRules, validReq);
    expect(validErrors.isEmpty()).toBe(true);

    const emptyReq = { body: { credential: '', password: '' } };
    const invalidErrors = await runRules(signInRules, emptyReq);
    expect(invalidErrors.isEmpty()).toBe(false);
  });

  it('validates refresh token rules', async () => {
    const invalidReq = { body: {} };
    const invalidErrors = await runRules(refreshRules, invalidReq);
    expect(invalidErrors.isEmpty()).toBe(false);

    const validReq = { body: { refreshToken: 'valid-token-str' } };
    const validErrors = await runRules(refreshRules, validReq);
    expect(validErrors.isEmpty()).toBe(true);
  });

  it('validates changePasswordRules and deleteAccountRules', async () => {
    const changeReq = {
      body: {
        currentPassword: 'oldSecretPassword',
        newPassword: 'newSecretPassword123',
        confirmPassword: 'newSecretPassword123',
      },
    };
    const changeErrors = await runRules(changePasswordRules, changeReq);
    expect(changeErrors.isEmpty()).toBe(true);

    const deleteReq = { body: { password: 'secretpassword' } };
    const deleteErrors = await runRules(deleteAccountRules, deleteReq);
    expect(deleteErrors.isEmpty()).toBe(true);
  });
});
