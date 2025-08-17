import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token) => {
    const { exp } = jwtDecode(token);
    // console.log("Token expires at:", new Date(exp * 1000));
    // console.log("Current time:", new Date());
    const currentTime = Date.now(); 
    return currentTime >= exp * 1000;
};