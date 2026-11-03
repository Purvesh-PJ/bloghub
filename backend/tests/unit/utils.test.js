const {
  AppError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
} = require('../../utils/AppError');
const { escapeRegex, containsIgnoreCase } = require('../../utils/regex');
const { visitorKey, DEDUPE_WINDOW_MS } = require('../../utils/visitor');

describe('utils/AppError', () => {
  it('creates an AppError instance with correct properties', () => {
    const error = new AppError(418, "I'm a teapot", 'TeapotError');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('AppError');
    expect(error.status).toBe(418);
    expect(error.message).toBe("I'm a teapot");
    expect(error.code).toBe('TeapotError');
    expect(error.expected).toBe(true);
    expect(error.stack).toBeDefined();
  });

  it('creates default badRequest error', () => {
    const error = badRequest('Invalid input');
    expect(error.status).toBe(400);
    expect(error.message).toBe('Invalid input');
    expect(error.code).toBe('BadRequest');
    expect(error.expected).toBe(true);
  });

  it('creates custom badRequest error with explicit code', () => {
    const error = badRequest('Bad param', 'CustomBadRequest');
    expect(error.status).toBe(400);
    expect(error.code).toBe('CustomBadRequest');
  });

  it('creates unauthorized error with defaults', () => {
    const error = unauthorized();
    expect(error.status).toBe(401);
    expect(error.message).toBe('Authentication required');
    expect(error.code).toBe('Unauthorized');
  });

  it('creates unauthorized error with custom message and code', () => {
    const error = unauthorized('Token expired', 'TokenExpired');
    expect(error.status).toBe(401);
    expect(error.message).toBe('Token expired');
    expect(error.code).toBe('TokenExpired');
  });

  it('creates forbidden error with defaults', () => {
    const error = forbidden();
    expect(error.status).toBe(403);
    expect(error.message).toBe('Forbidden');
    expect(error.code).toBe('Forbidden');
  });

  it('creates forbidden error with custom message and code', () => {
    const error = forbidden('Admin only', 'AdminRequired');
    expect(error.status).toBe(403);
    expect(error.message).toBe('Admin only');
    expect(error.code).toBe('AdminRequired');
  });

  it('creates notFound error with defaults', () => {
    const error = notFound();
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.code).toBe('NotFound');
  });

  it('creates notFound error with custom message and code', () => {
    const error = notFound('Post not found', 'PostNotFound');
    expect(error.status).toBe(404);
    expect(error.message).toBe('Post not found');
    expect(error.code).toBe('PostNotFound');
  });

  it('creates conflict error', () => {
    const error = conflict('Email already registered');
    expect(error.status).toBe(409);
    expect(error.message).toBe('Email already registered');
    expect(error.code).toBe('Conflict');
  });

  it('creates conflict error with custom code', () => {
    const error = conflict('Duplicate entry', 'DuplicateEntry');
    expect(error.status).toBe(409);
    expect(error.code).toBe('DuplicateEntry');
  });
});

describe('utils/regex', () => {
  describe('escapeRegex', () => {
    it('escapes all regular expression metacharacters', () => {
      const input = 'hello.*+?^${}()|[]\\world';
      const escaped = escapeRegex(input);
      expect(escaped).toBe('hello\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\world');

      const regex = new RegExp(escaped);
      expect(regex.test(input)).toBe(true);
      expect(regex.test('helloXYZworld')).toBe(false);
    });

    it('handles null, undefined, and empty string safely', () => {
      expect(escapeRegex(null)).toBe('');
      expect(escapeRegex(undefined)).toBe('');
      expect(escapeRegex('')).toBe('');
    });

    it('leaves alphanumeric and safe characters unchanged', () => {
      expect(escapeRegex('clean-tag_123')).toBe('clean-tag_123');
    });
  });

  describe('containsIgnoreCase', () => {
    it('returns a case-insensitive regex query object with escaped value', () => {
      const result = containsIgnoreCase('C++');
      expect(result).toEqual({
        $regex: 'C\\+\\+',
        $options: 'i',
      });
    });
  });
});

describe('utils/visitor', () => {
  it('returns user-prefixed id when user is authenticated', () => {
    const req = { user: { id: 'usr_789' } };
    expect(visitorKey(req)).toBe('u:usr_789');
  });

  it('returns anonymous hash key for unauthenticated visitor', () => {
    const req = {
      ip: '192.168.1.1',
      headers: { 'user-agent': 'Mozilla/5.0' },
    };

    const key = visitorKey(req);
    expect(key).toMatch(/^a:[a-f0-9]{32}$/);
  });

  it('produces the same key for identical anonymous visitor details', () => {
    const req1 = { ip: '10.0.0.1', headers: { 'user-agent': 'Chrome' } };
    const req2 = { ip: '10.0.0.1', headers: { 'user-agent': 'Chrome' } };

    expect(visitorKey(req1)).toBe(visitorKey(req2));
  });

  it('produces different keys for different IP or user-agent', () => {
    const req1 = { ip: '10.0.0.1', headers: { 'user-agent': 'Chrome' } };
    const req2 = { ip: '10.0.0.2', headers: { 'user-agent': 'Chrome' } };
    const req3 = { ip: '10.0.0.1', headers: { 'user-agent': 'Safari' } };

    expect(visitorKey(req1)).not.toBe(visitorKey(req2));
    expect(visitorKey(req1)).not.toBe(visitorKey(req3));
  });

  it('handles missing ip and user-agent gracefully', () => {
    const req = { headers: {} };
    const key = visitorKey(req);
    expect(key).toMatch(/^a:[a-f0-9]{32}$/);
  });

  it('exports expected DEDUPE_WINDOW_MS duration of 6 hours', () => {
    expect(DEDUPE_WINDOW_MS).toBe(6 * 60 * 60 * 1000);
  });
});
