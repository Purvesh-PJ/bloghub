import { useCallback, useState } from "react";
import { addPost, updatePost } from "../services/postApi";


const usePostActions = () => {

    const [ addNewPostLoading, setAddNewPostLoading] = useState(false);
    const [ addNewPostError, setAddNewPostError ] = useState(null);
    const [ updatePostLoading, setUpdatePostLoading ] = useState(false);
    const [ updatePostError, setUpdatePostError ] = useState(null);
    const [ removePostLoading, setRemovePostLoading ] = useState(false);
    const [ removePostError, setRemovePostError  ] = useState(null);
    

    const addNewPost = useCallback(async (post) => {
        setAddNewPostLoading(true);
        try {
            const response = await addPost(post);
            console.log(response);
            return response;
        } 
        catch (error) {
            console.log(error);
            if(error.response){
                switch(error.response.status){
                    case 404: 
                        setAddNewPostError('The post you are looking for does not exist.');
                    break;
                    case 500:
                        setAddNewPostError('Server error occurred. Please try again later.');
                    break;
                    default:
                        setAddNewPostError('An unexpected error occurred. Please try again.');
                }
            } 
            else if (error.request) {
                setAddNewPostError('Unable to connect to the server. Please check your internet connection.');
            } 
            else {
                setAddNewPostError('An unexpected error occurred. Please try again.');
            }
        } 
        finally {
            setAddNewPostLoading(false);
        }
    },[]);

    const updateExistingPost = useCallback(async (post, postId) => {
        setUpdatePostLoading(true);
        try {
            const response = await updatePost(post, postId);
            return response;
        } 
        catch (error) {
            setUpdatePostError(`Error updating post: ${error.response?.status || error.message}`);
            
        } 
        finally {
            setUpdatePostLoading(false);
        }
    },[]);

    const removePost = useCallback(async (post, postId) => {
        setRemovePostLoading(true);
        try {
            const response = await updatePost(post, postId);
            return response;
        } 
        catch (error) {
            setRemovePostError(`Error removing post: ${error.response?.status || error.message}`);   
        } 
        finally {
            setRemovePostLoading(false);
        }
    },[]);


    return {
        addNewPostLoading,
        addNewPostError,
        updatePostLoading,
        updatePostError,
        removePostLoading,
        removePostError,
        addNewPost,
        updateExistingPost,
        removePost    
    }
};

export default usePostActions;