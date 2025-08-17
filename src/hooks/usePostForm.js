import { useState, useEffect } from 'react';
import useFetchSinglePost from '../hooks/useFetchSinglePost.js';
import useFetchCategories from '../hooks/useFetchCategories.js';
import usePostActions from '../hooks/usePostActions.js';
import useCategoryActions from '../hooks/useCategoryActions.js';

const usePostForm = (isEditing, postId) => {

    // HOOKS
    const { fetchPost, postData, postCategories, postLoading, postError } = useFetchSinglePost(postId, false);
    const { categories, categoriesLoading, categoriesError } = useFetchCategories(); 
    const { addNewPost, updateExistingPost, addNewPostLoading, addNewPostError, updatePostLoading, updatePostError } = usePostActions();
    const { addNewCategoriesToPost, updateCategoriesOfPost, addNewCategoriesLoding, addNewCategoriesError, categoriesUpdationLoading, categoriesUpdationError } = useCategoryActions();
    // STATES
    const [ post, setPost ] = useState();
    const [ selectedCategories, setSelectedCategories ] = useState([]);
    const [ postAttachedCategories, setPostAttachedCategories] = useState([]);
    const [ removedCategories, setRemovedCategories ] = useState([]);
    const [ visibility, setVisibility ] = useState('draft');
    const [ postSubmitLoading, setPostSubmitLoading ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        setLoading(postLoading || categoriesLoading || addNewPostLoading || updatePostLoading || addNewCategoriesLoding || categoriesUpdationLoading)
        const errors = [postError, categoriesError, addNewPostError, updatePostError, addNewCategoriesError, categoriesUpdationError].filter(Boolean);
        setError(errors.length > 0 ? errors.join(', ') : null);
    },[error, 
        postLoading, 
        categoriesLoading, 
        addNewPostLoading, 
        updatePostLoading, 
        addNewCategoriesLoding, 
        categoriesUpdationLoading, 
        postError, 
        categoriesError, 
        addNewPostError, 
        updatePostError, 
        addNewCategoriesError, 
        categoriesUpdationError
    ])

    useEffect(() => { if(isEditing) fetchPost(); },[isEditing, fetchPost]);

    useEffect(() => {
        if(postData && postCategories){
            setPost(postData); 
            setSelectedCategories(postCategories);
            setPostAttachedCategories(postCategories);
        }
    },[postCategories, postData]);

    
    const handlePostFieldChange = (name, value) => { 
        setPost( prevContent => ({ ...prevContent, [name] : value })); 
    };

    const handlePostSubmit = async (event) => {
        event.preventDefault();
        setPostSubmitLoading(true);
        try {
            let response;
            if(isEditing) {
                response = await updateExistingPost(post, postId);
                if(response.data.success){
                    updateCategoriesOfPost(selectedCategories, removedCategories, postId);
                }
            }
            else {
                response = await addNewPost(post);
                if(response.data.success){
                    const { postId } = response.data;
                    addNewCategoriesToPost(selectedCategories, postId);
                }
            } 
        } 
        catch (error) {
            setError(error.message);  
        } 
        finally {
            setPostSubmitLoading(false);
        }
    };

    const handlePostCategoryChange = (value) => {
        if(!selectedCategories.includes(value)){
            setSelectedCategories([...selectedCategories, value]);
            setRemovedCategories(removedCategories.filter( category => category !== value));
        }
        else {
            alert('category already attached with post');
        }
    };

    const handlePostRemoveCategory = (removedCategoryIndex) => {
        const categoryToRemove = selectedCategories[removedCategoryIndex];
        // console.log(categoryToRemove);
        const updateCategories = selectedCategories.filter((_,index) => index !== removedCategoryIndex);
        setSelectedCategories(updateCategories);
        // console.log(selectedCategories);

        if(isEditing && postAttachedCategories.includes(categoryToRemove) && !removedCategories.includes(categoryToRemove)){
            setRemovedCategories([...removedCategories, categoryToRemove]);
        }
    };

    return {
        post,
        categories,
        selectedCategories,
        loading,
        error,
        postSubmitLoading,
        visibility,
        setVisibility,
        handlePostFieldChange,
        handlePostCategoryChange,
        handlePostRemoveCategory,
        handlePostSubmit
    }
}

export default usePostForm;