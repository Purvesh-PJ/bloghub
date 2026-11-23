const authorizeSelfOrAdmin = require('../middlewares/authorizeSelfOrAdmin');

describe('modules/auth/middlewares/authorizeSelfOrAdmin', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('returns 401 if user is not authenticated', () => {
    req = { user: null };
    authorizeSelfOrAdmin('userId')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authentication required',
    });
  });

  it('allows access if user has admin role', () => {
    req = {
      user: { id: 'admin-id-123', roles: ['admin'] },
      params: { id: 'target-user-456' },
    };
    authorizeSelfOrAdmin('id')(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('allows access if authenticated user matches target params.id', () => {
    req = {
      user: { id: 'user-id-123', roles: [] },
      params: { id: 'user-id-123' },
    };
    authorizeSelfOrAdmin('id')(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('allows access if authenticated user matches target params.userId (default param)', () => {
    req = {
      user: { id: 'user-id-123', roles: [] },
      params: { userId: 'user-id-123' },
    };
    authorizeSelfOrAdmin()(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('denies access with 403 Forbidden if user is neither admin nor the owner', () => {
    req = {
      user: { id: 'user-id-123', roles: [] },
      params: { id: 'another-user-999' },
    };
    authorizeSelfOrAdmin('id')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Forbidden',
    });
  });
});
