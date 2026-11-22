const {
  AppError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
} = require('../AppError');
const { escapeRegex, containsIgnoreCase } = require('../regex');
const { visitorKey, DEDUPE_WINDOW_MS } = require('../visitor');

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

  it('creates forbidden error with custom message', () => {
    const error = forbidden('Access denied');
    expect(error.status).toBe(403);
    expect(error.message).toBe('Access denied');
  });

  it('creates notFound error with defaults', () => {
    const error = notFound();
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.code).toBe('NotFound');
  });

  it('creates notFound error with custom message', () => {
    const error = notFound('User not found');
    expect(error.status).toBe(404);
    expect(error.message).toBe('User not found');
  });

  it('creates conflict error with code', () => {
    const error = conflict('Resource conflict');
    expect(error.status).toBe(409);
    expect(error.message).toBe('Resource conflict');
    expect(error.code).toBe('Conflict');
  });

  it('creates conflict error with custom message and code', () => {
    const error = conflict('Email in use', 'EmailDuplicate');
    expect(error.status).toBe(409);
    expect(error.message).toBe('Email in use');
    expect(error.code).toBe('EmailDuplicate');
  });
});

describe('utils/regex', () => {
  it('escapes special regex characters correctly', () => {
    const testCases = [
      { input: 'hello.world', expected: 'hello\\.world' },
      { input: 'foo*bar+baz?', expected: 'foo\\*bar\\+baz\\?' },
      { input: '(group)[bracket]{brace}', expected: '\\(group\\)\\[bracket\\]\\{brace\\}' },
      { input: 'price $100^2 | text', expected: 'price \\$100\\^2 \\| text' },
      { input: 'normal text 123', expected: 'normal text 123' },
    ];

    for (const { input, expected } of testCases) {
      expect(escapeRegex(input)).toBe(expected);
    }
  });

  it('returns empty string when input is null, undefined, or empty', () => {
    expect(escapeRegex('')).toBe('');
    expect(escapeRegex(null)).toBe('');
    expect(escapeRegex(undefined)).toBe('');
  });

  it('containsIgnoreCase matches substrings case-insensitively with regex object', () => {
    const filter = containsIgnoreCase('world');
    expect(filter.$options).toBe('i');
    expect(new RegExp(filter.$regex, filter.$options).test('Hello World')).toBe(true);
    expect(new RegExp(filter.$regex, filter.$options).test('WORLD')).toBe(true);
    expect(new RegExp(filter.$regex, filter.$options).test('bye')).toBe(false);
  });

  it('containsIgnoreCase safely escapes regex metacharacters in search text', () => {
    const filter1 = containsIgnoreCase('$100');
    expect(new RegExp(filter1.$regex, filter1.$options).test('cost is $100')).toBe(true);
    expect(new RegExp(filter1.$regex, filter1.$options).test('cost is 100')).toBe(false);

    const filter2 = containsIgnoreCase('(hooks)');
    expect(new RegExp(filter2.$regex, filter2.$options).test('react (hooks) pattern')).toBe(true);
  });

  it('containsIgnoreCase handles null or undefined values', () => {
    const filterNull = containsIgnoreCase(null);
    expect(filterNull.$regex).toBe('');
    const filterUndefined = containsIgnoreCase(undefined);
    expect(filterUndefined.$regex).toBe('');
  });
});

describe('utils/visitor', () => {
  it('generates consistent hash for same IP and user agent', () => {
    const req = {
      ip: '192.168.1.1',
      headers: { 'user-agent': 'Mozilla/5.0 TestBrowser' },
    };

    const key1 = visitorKey(req);
    const key2 = visitorKey(req);

    expect(key1).toBeDefined();
    expect(typeof key1).toBe('string');
    expect(key1).toBe(key2);
  });

  it('generates different hash for different IPs or user agents', () => {
    const req1 = {
      ip: '192.168.1.1',
      headers: { 'user-agent': 'Mozilla/5.0' },
    };
    const req2 = {
      ip: '192.168.1.2',
      headers: { 'user-agent': 'Mozilla/5.0' },
    };
    const req3 = {
      ip: '192.168.1.1',
      headers: { 'user-agent': 'Chrome/100.0' },
    };

    expect(visitorKey(req1)).not.toBe(visitorKey(req2));
    expect(visitorKey(req1)).not.toBe(visitorKey(req3));
  });

  it('handles missing headers gracefully', () => {
    const req = { ip: '127.0.0.1', headers: {} };
    const key = visitorKey(req);
    expect(key).toBeDefined();
    expect(typeof key).toBe('string');
  });

  it('exports DEDUPE_WINDOW_MS as 6 hours in milliseconds', () => {
    expect(DEDUPE_WINDOW_MS).toBe(6 * 60 * 60 * 1000);
  });
});
