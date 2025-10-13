import axios from 'axios';
import { showErrorNotification } from '../utils/showErrorNotifications';
import { retryRefreshWithRefreshToken } from '../utils/axiosUtils';
import { getErrorMessage } from '../utils/axiosUtils';

export const createApiInstance = (baseURL) => {
  const api = axios.create({ baseURL: baseURL });

  // Attach Authorization header automatically if accessToken exists
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const message = getErrorMessage(error);
      if (error.response && error.response.status === 401) {
        return retryRefreshWithRefreshToken(error, api);
      }
      showErrorNotification(message);
      return Promise.reject(error);
    },
  );

  return api;
};
