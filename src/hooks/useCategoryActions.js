import { useCallback, useState } from "react";
import { postCategoryCollection, updateCategoryCollection } from "../services/categoryApi";

const useCategoryActions = () => {

    const [ categoriesUpdationLoading, setCategoriesUpdationLoading ] = useState(false);
    const [ categoriesUpdationError, setCategoriesUpdationError ] = useState(null);
    const [ addNewCategoriesLoding, setAddNewCategoriesLoading ] = useState(false);
    const [ addNewCategoriesError, setAddNewCategoriesError ] = useState(null);

    const addNewCategoriesToPost = useCallback( async (categories, postId) => {
        setAddNewCategoriesLoading(true);
        try {
            const response = await postCategoryCollection(categories, postId);
            if(response.data.success){
                return true;
            }
            else {
                return false;
            }
        } 
        catch (error) {
            setAddNewCategoriesError(`Error posting categories: ${error.response?.status || error.message}`);
            return false;
        } 
        finally {
            setAddNewCategoriesLoading(false);
        }
    },[]);

    const updateCategoriesOfPost = useCallback( async (categoriesToAdd, categoriesToRemove, postId) => {
        setCategoriesUpdationLoading(true);
        try {
            const response = await updateCategoryCollection(categoriesToAdd, categoriesToRemove, postId);
            if(response.data.success){
                return true;
            } else {
                return false;
            }
        } 
        catch (error) {
            setCategoriesUpdationError(`Error updating categories: ${error.response?.status || error.message}`);
            return false;
        }
        finally {
            setCategoriesUpdationLoading(false);
        }
    },[]);

    return {
        addNewCategoriesLoding,
        addNewCategoriesError,
        categoriesUpdationLoading,
        categoriesUpdationError,
        addNewCategoriesToPost, 
        updateCategoriesOfPost
    }
};

export default useCategoryActions;