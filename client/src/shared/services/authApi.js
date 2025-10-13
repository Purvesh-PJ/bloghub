import { API_AUTH_URL } from './config';
import axios from 'axios';

export const SignUp = async (userData) => {
  // console.log(userData);
  const response = await axios.post(`${API_AUTH_URL}/signup`, userData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
};

export const Login = async (userLoginData) => {
  // console.log(userLoginData);
  const response = await axios.post(`${API_AUTH_URL}/signin`, userLoginData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
};

export const RefreshToken = async (refreshtoken) => {
  const response = await axios.post(
    `${API_AUTH_URL}/refreshToken`,
    { refreshToken: refreshtoken },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response;
};
