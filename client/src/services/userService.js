import api from '../config/api';

export const userService = {
  // The signed-in account. Scoped to the token, so it takes no id — see getPublicProfile for
  // somebody else's page.
  getUser: async () => {
    const response = await api.get('/users/getUser');
    return response.data;
  },

  /**
   * Anybody's public page.
   *
   * The profile screen used to call `getUser` with a user id, which that function ignores —
   * so it rendered the *viewer's* own account for every writer on the site, and 401'd for a
   * signed-out reader who clicked an author byline.
   *
   * Returns { success, data: { username, avatar, bio, location, website, socialLinks,
   * counts: { posts, followers, following } } }. The email is present only when the account
   * turned that on in its own privacy settings.
   */
  getPublicProfile: async (userId) => {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  },

  updateUser: async (formData) => {
    const response = await api.put('/users/setUser', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getUserProfile: async () => {
    const response = await api.get('/users/getUserProfile');
    return response.data;
  },

  followUser: async (toFollowId) => {
    const response = await api.post('/users/followUser', { toFollowId });
    return response.data;
  },

  unfollowUser: async (toUnfollowId) => {
    const response = await api.post('/users/unfollowUser', { toUnfollowId });
    return response.data;
  },

  isFollowing: async (userId) => {
    const response = await api.get(`/users/isFollowing/${userId}`);
    return response.data;
  },

  // Permanent. Requires the account password, not just a valid session.
  deleteAccount: async (password) => {
    const response = await api.delete('/users/me', { data: { password } });
    return response.data;
  },

  /* ── Administrator actions on other accounts ───────────────────────────── */

  // Reversible, keeps the person's content, and ends their sessions immediately.
  setUserSuspended: async (userId, suspended) => {
    const response = await api.patch(`/users/${userId}/suspension`, { suspended });
    return response.data;
  },

  setUserRole: async (userId, isAdmin) => {
    const response = await api.patch(`/users/${userId}/role`, { admin: isAdmin });
    return response.data;
  },

  // Requires the administrator's own password, like deleting your own account does.
  deleteUser: async (userId, password) => {
    const response = await api.delete(`/users/${userId}`, { data: { password } });
    return response.data;
  },

  getAllUsers: async (page = 1, params = {}) => {
    const response = await api.get('/users', { params: { page, ...params } });
    return response.data;
  },
};
