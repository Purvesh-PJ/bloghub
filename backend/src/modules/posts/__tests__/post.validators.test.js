const { validationResult } = require('express-validator');
const { createPostRules, updatePostRules, feedRules } = require('../validators/post.validators');

// Helper to run express-validator chains against a dummy request
const runRules = async (rules, req) => {
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
};

describe('validators/post.validators', () => {
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

  it('validates feed query parameters', async () => {
    const validQueryReq = {
      query: { page: '2', limit: '20', tag: 'javascript' },
    };
    const validErrors = await runRules(feedRules, validQueryReq);
    expect(validErrors.isEmpty()).toBe(true);
  });
});
