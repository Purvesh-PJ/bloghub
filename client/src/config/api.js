import axios from 'axios';
import { authState } from '../context/AuthContext';

// The API is mounted at /api and nowhere else. It used to also answer on the bare root,
// which is why a base URL without the suffix worked; accept both spellings here so an
// existing .env keeps working after that second mount was removed.
const withApiPrefix = (raw) => {
  const trimmed = String(raw).replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = withApiPrefix(import.meta.env.VITE_API_URL || 'http://localhost:4000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = authState.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Sends the session to the login screen. Called from a single place so that every way a
// refresh can fail ends the same way, rather than leaving a signed-out user clicking through
// a UI that 401s on every request.
const endSession = () => {
  authState.logout();
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // A 401 from the refresh endpoint itself means the refresh token is finished. Retrying
    // would loop.
    if (originalRequest.url?.includes('/auth/refreshToken')) {
      endSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = authState.refreshToken;
    if (!refreshToken) {
      endSession();
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refreshToken`, { refreshToken });

      const accessToken = response.data?.data?.accessToken;
      if (!response.data?.success || !accessToken) {
        // A malformed success response is still a failed refresh — previously this fell
        // through and returned the original 401 while leaving the dead session in place.
        endSession();
        return Promise.reject(error);
      }

      authState.setAccessToken(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      endSession();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
