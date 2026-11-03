const { validationResult } = require('express-validator');
const {
  signUpRules,
  signInRules,
  refreshRules,
  changePasswordRules,
  deleteAccountRules,
} = require('../../validators/auth.validators');
const {
  createPostRules,
  updatePostRules,
  commentRules,
  feedRules,
} = require('../../validators/content.validators');
const {
  updateAccountRules,
  suspendRules,
  roleRules,
  adminDeleteRules,
} = require('../../validators/user.validators');
const { validateObjectId } = require('../../middlewares/validate');

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

describe('validators/content.validators', () => {
  it('validates createPostRules requiring title and content', async () => {
    const validReq = {
      body: {
        title: 'Clean Architecture with Node',
        content: 'Comprehensive guide to building maintainable software...',
        tags: ['node', 'architecture'],
      },
    };
    const validErrors = await runRules(createPostRules, validReq);
    expect(validErrors.isEmpty()).toBe(true);

    const emptyReq = { body: {} };
    const invalidErrors = await runRules(createPostRules, emptyReq);
    expect(invalidErrors.isEmpty()).toBe(false);
  });

  it('allows partial fields in updatePostRules', async () => {
    const partialReq = {
      body: {
        title: 'Updated Title Only',
      },
    };
    const errors = await runRules(updatePostRules, partialReq);
    expect(errors.isEmpty()).toBe(true);
  });

  it('validates commentRules', async () => {
    const invalidReq = { body: { message: '   ' } };
    const invalidErrors = await runRules(commentRules, invalidReq);
    expect(invalidErrors.isEmpty()).toBe(false);

    const validReq = { body: { message: 'Great insights!' } };
    const validErrors = await runRules(commentRules, validReq);
    expect(validErrors.isEmpty()).toBe(true);
  });

  it('validates feed query parameters', async () => {
    const validQueryReq = {
      query: { page: '2', limit: '20', tag: 'javascript' },
    };
    const validErrors = await runRules(feedRules, validQueryReq);
    expect(validErrors.isEmpty()).toBe(true);
  });
});

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

describe('middlewares/validateObjectId', () => {
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
