import { API_CATEGORIES_URL } from './config';
import { createApiInstance } from './axiosInstance';

const api = createApiInstance(API_CATEGORIES_URL);

export const getCategories = async () => {
  try {
    const response = await api.get(`${API_CATEGORIES_URL}`);
    // console.log(response);
    return response;
  } catch (error) {
    // console.log(error);
    throw new Error(`Error getting categories : ${error.response || error.message}`);
  }
};

export const postCategoryCollection = async (categories, postId) => {
  // console.log(categories);
  try {
    const response = await api.post(
      `${API_CATEGORIES_URL}/categoriesCollection`,
      { categories, postId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    // console.log(response);
    return response;
  } catch (error) {
    throw new Error(`Error posting categories : ${error.response || error.message}`);
  }
};

export const updateCategoryCollection = async (selectedCategories, removedCategories, postId) => {
  try {
    const response = await api.put(
      `${API_CATEGORIES_URL}/updateCategoriesCollection/${postId}`,
      { selectedCategories, removedCategories },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    // console.log(response);
    return response;
  } catch (error) {
    throw new Error(`Error posting categories : ${error.response || error.message}`);
  }
};
