// import { useState } from "react";
import { RefreshToken } from '../services/authApi';
import useAuthActions from './useAuthActions';
import { useNavigate } from 'react-router-dom';

const useRefreshToken = () => {
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  const makeRefresh = async (refreshToken) => {
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
          return { success: true };
        } else {
          return { success: false };
        }
      }
    } catch (error) {
      logout();
      navigate('/login');
      return {
        success: false,
        message: error.message,
      };
    }
  };

  return { makeRefresh };
};

export default useRefreshToken;
