// refreshTokenUtil.js
import { RefreshToken } from '../services/authApi';

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    return {
      success: false,
      message: 'Refresh token missing',
    };
  }

  try {
    const response = await RefreshToken(refreshToken);
    if (response.data.success) {
      const { data } = response.data;
      const { accessToken } = data;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        return { success: true, accessToken };
      }
      return { success: false };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
