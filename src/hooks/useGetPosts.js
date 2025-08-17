import { useState, useEffect } from 'react';
import { getPosts } from '../services/postApi'; 

const useGetPosts = () => {

    const [ posts, setPosts ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        ;(async() => {
            try {
                const response = await getPosts();
                if(isMounted){
                    setPosts(response.data);   
                } 
            } 
            catch (error) {
                if(isMounted){
                    setError(error.message);
                } 
            }
            finally {
                if(isMounted){
                    setLoading(false)   
                } 
            }
        })();

        return () => {
            isMounted = false;
        }
    },[])

    return { posts, loading, error };
};

export default useGetPosts;
