const { escapeRegex, containsIgnoreCase, visitorKey, DEDUPE_WINDOW_MS } = require('../index');

describe('core/utils/regex', () => {
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

describe('core/utils/visitor', () => {
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
