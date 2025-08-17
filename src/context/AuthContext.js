import React, { createContext, useContext, useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../Utils/jwtUtils';
import useUserActions from '../hooks/useUserActions';
import useAuthActions from '../hooks/useAuthActions';
import useRefreshToken from '../hooks/useRefreshToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuthActions();
    const { fetchUser } = useUserActions();
    const { makeRefresh } = useRefreshToken();
    const navigate = useNavigate();

    useEffect(() => {
        // Check localStorage for user data
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if(!accessToken && !refreshToken){
                logout();
                return navigate('/login');
            }

            if(accessToken && refreshToken){
                if(!isTokenExpired(accessToken)){
                    setIsAuthenticated(true);
                    return await fetchUser();
                }
                else {
                    if(!isTokenExpired(refreshToken)) {
                        const response = await makeRefresh(refreshToken);
                        if(response.success){
                            setIsAuthenticated(true);
                            return await fetchUser();
                        }else {
                            logout();
                            navigate('/login');
                            return setIsAuthenticated(false);
                        }
                    } else {
                        logout();
                        navigate('/login');
                        return setIsAuthenticated(false);
                    }
                } 
            } 
            else {
                logout();
                return navigate('/login');
            }
        };
        checkAuth();
    },[navigate]);

    const login = (userData, token) => {
        const userInfo = { user: userData, token };
        localStorage.setItem('userData', JSON.stringify(userInfo));
        setUser(userInfo);
        setIsAuthenticated(true);
    };

    return (
        <AuthContext.Provider 
            value={{ 
                isAuthenticated, 
                user, 
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};


