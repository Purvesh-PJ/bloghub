import api from '../config/api';

export const authService = {
  signIn: async (credential, password) => {
    const response = await api.post('/auth/signin', { credential, password });
    return response.data;
  },

  signUp: async (username, email, password, confirmPassword) => {
    const response = await api.post('/auth/signup', {
      username,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refreshToken', { refreshToken });
    return response.data;
  },

  // Revokes the tokens server-side. Clearing them locally only makes this browser forget
  // them; anyone who captured one could still use it until it expired.
  signOut: async () => {
    const response = await api.post('/auth/signout');
    return response.data;
  },

  // Succeeding revokes every session, this browser's included — the caller must sign in
  // again afterwards.
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const response = await api.put('/auth/password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};
