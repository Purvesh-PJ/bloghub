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
      confirmPassword 
    });
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refreshToken', { refreshToken });
    return response.data;
  },
};
