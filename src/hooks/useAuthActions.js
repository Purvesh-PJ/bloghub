import { useCallback, useState } from "react";
import { Login, SignUp } from "../services/authApi";
import useUserActions from "./useUserActions";
import { useNavigate } from "react-router-dom";

const useAuthActions = () => {

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const { fetchUser } = useUserActions(); 
    const navigate = useNavigate();
    
    const login = useCallback(async (credentials) => {
        setLoading(true);
        try {
            const response = await Login(credentials);
            // console.log(response);
            if(response.data.success){
                const { accessToken, refreshToken, userdata } = response.data.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                await fetchUser();
                // const userDataJSON = JSON.stringify(userdata);
                // localStorage.setItem('userData', userDataJSON);
                return response;  
            }
        } 
        catch (error) {
            setError(error.message); 
        } 
        finally {
            setLoading(false);
        }
    },[]);

    const signup = useCallback(async (data) => {
        setLoading(true);
        try {
            const response = await SignUp(data);
            if(response.data.success){
                navigate('/login');
            }
            return response;
        } 
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    },[navigate]);

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
    };

    return { login, signup, logout, loading, error };

};

export default useAuthActions;