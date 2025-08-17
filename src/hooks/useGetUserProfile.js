import { useState, useCallback } from 'react';
import { getUserProfile } from '../services/userApi';

const useGetUserProfile = () => {

    const [ profile, setUserProfile ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError] = useState(null);

    const getProfile = useCallback(async () => {
       
        try {
            const response = await getUserProfile();
            const { data } = response.data; 
            setUserProfile(data);  
            return data;  
        } 
        catch (error) {
            setError(error.message); 
            console.log(error);
        }
        finally {
            setLoading(false)    
        }
    },[]);

    return { profile, loading, error, getProfile };
};

export default useGetUserProfile;