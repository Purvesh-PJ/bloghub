import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/*
  The axios layer.

  Everything here is a failure path, which is exactly why it is worth pinning: a refresh that
  half-succeeds, a refresh token that is itself dead, or a 401 arriving on a request that has
  already been retried. Each one, handled wrongly, either loops forever or strands a signed-out
  person in a UI that 401s on every click.
*/

const postMock = vi.fn();

vi.mock('axios', () => {
  const instance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };

  // The module calls api(originalRequest) to replay a request, so the instance has to be
  // callable as well as carry the interceptor registry.
  const callable = Object.assign(
    vi.fn(() => Promise.resolve({ replayed: true })),
    instance
  );

  return {
    default: {
      create: vi.fn(() => callable),
      post: postMock,
    },
  };
});

const axios = (await import('axios')).default;
await import('./api');
const { authState } = await import('../context/AuthContext');

/** The rejection half of the response interceptor the module registered on import. */
const api = axios.create.mock.results[0].value;
const onRejected = api.interceptors.response.use.mock.calls[0][1];
const onRequestFulfilled = api.interceptors.request.use.mock.calls[0][0];

const unauthorized = (config) => ({ response: { status: 401 }, config });

let assignedHref;

beforeEach(() => {
  postMock.mockReset();
  api.mockClear();
  authState.logout();

  // window.location is not writable in jsdom, and the module navigates through it.
  assignedHref = null;
  delete window.location;
  window.location = {
    pathname: '/dashboard',
    set href(value) {
      assignedHref = value;
    },
    get href() {
      return assignedHref;
    },
  };
});

afterEach(() => {
  authState.logout();
});

describe('request interceptor', () => {
  it('attaches the access token when there is one', () => {
    authState.setState({ accessToken: 'token-abc', isAuthenticated: true });
    const config = onRequestFulfilled({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer token-abc');
  });

  it('sends no Authorization header for a signed-out visitor', () => {
    const config = onRequestFulfilled({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });
});

describe('response interceptor', () => {
  it('passes through anything that is not a 401', async () => {
    const error = { response: { status: 500 }, config: {} };
    await expect(onRejected(error)).rejects.toBe(error);
    expect(postMock).not.toHaveBeenCalled();
  });

  it('refreshes once and replays the original request', async () => {
    authState.setState({ refreshToken: 'refresh-abc', isAuthenticated: true });
    postMock.mockResolvedValue({ data: { success: true, data: { accessToken: 'fresh' } } });

    const original = { headers: {}, url: '/posts' };
    const result = await onRejected(unauthorized(original));

    expect(authState.accessToken).toBe('fresh');
    expect(original.headers.Authorization).toBe('Bearer fresh');
    expect(result).toEqual({ replayed: true });
  });

  it('does not retry a request that has already been retried', async () => {
    authState.setState({ refreshToken: 'refresh-abc', isAuthenticated: true });

    // Without the _retry guard a token the server keeps rejecting produces an endless
    // refresh-and-replay loop.
    const error = unauthorized({ headers: {}, url: '/posts', _retry: true });
    await expect(onRejected(error)).rejects.toBe(error);
    expect(postMock).not.toHaveBeenCalled();
  });

  it('ends the session when the refresh endpoint itself answers 401', async () => {
    authState.setState({ refreshToken: 'refresh-abc', isAuthenticated: true });

    const error = unauthorized({ headers: {}, url: '/auth/refreshToken' });
    await expect(onRejected(error)).rejects.toBe(error);

    expect(authState.isAuthenticated).toBe(false);
    expect(assignedHref).toBe('/login');
    // Retrying a dead refresh token would loop.
    expect(postMock).not.toHaveBeenCalled();
  });

  it('ends the session when there is no refresh token to spend', async () => {
    const error = unauthorized({ headers: {}, url: '/posts' });
    await expect(onRejected(error)).rejects.toBe(error);

    expect(authState.isAuthenticated).toBe(false);
    expect(assignedHref).toBe('/login');
  });

  it('treats a 200 that carries no access token as a failed refresh', async () => {
    authState.setState({ refreshToken: 'refresh-abc', isAuthenticated: true });
    postMock.mockResolvedValue({ data: { success: true, data: {} } });

    const error = unauthorized({ headers: {}, url: '/posts' });
    await expect(onRejected(error)).rejects.toBe(error);

    // A malformed success is still a failed refresh; leaving the dead session in place meant
    // every later request 401'd with nothing telling the person why.
    expect(authState.isAuthenticated).toBe(false);
    expect(assignedHref).toBe('/login');
  });

  it('ends the session when the refresh request throws', async () => {
    authState.setState({ refreshToken: 'refresh-abc', isAuthenticated: true });
    const refreshFailure = new Error('network down');
    postMock.mockRejectedValue(refreshFailure);

    await expect(onRejected(unauthorized({ headers: {}, url: '/posts' }))).rejects.toBe(
      refreshFailure
    );
    expect(authState.isAuthenticated).toBe(false);
  });

  it('does not redirect when the person is already on the login screen', async () => {
    window.location.pathname = '/login';

    const error = unauthorized({ headers: {}, url: '/posts' });
    await expect(onRejected(error)).rejects.toBe(error);

    expect(authState.isAuthenticated).toBe(false);
    // Assigning href to the page you are on reloads it, discarding whatever was typed.
    expect(assignedHref).toBeNull();
  });
});
