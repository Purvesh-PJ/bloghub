// import { refreshAccessToken } from "./refreshTokenUtil";
// import { RefreshToken } from "../services/authApi";
import { refreshAccessToken } from "./refreshTokenUtil";

export const retryRefreshWithRefreshToken = async (error, api) => {
    
    const originalRequest = error.config;

    if(!originalRequest._retry){
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        const result = await refreshAccessToken(refreshToken);

        if (result.success && result.accessToken) {
            // const { accessToken } = result.data.data;
            const { accessToken } = result.accessToken;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return api(originalRequest);
        } else {
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
}

export const getErrorMessage = (error) => {
    let message = 'An unexpected error occurred.';

    if (error.response) {
        switch (error.response.status) {
            case 400:
                message = error.response.data.message || 'Bad Request.';
                break;

            case 401:
                message = 'Session expired you have to login again.';
                break;

            case 403:
                message = 'Forbidden. You do not have the necessary permissions.';
                break;

            case 404:
                message = 'Resource not found.';
                break;

            case 500:
                message = 'Server error. Please try again later.';
                break;

            default:
                message = error.response.data.message || 'An unexpected error occurred.';
        }
    } else if (error.request) {
        message = 'No response from the server. Please check your network connection.';
    } 
    else {
        message = `Request error: ${error.message}`;
    }
    console.log(message);
    return message;
}