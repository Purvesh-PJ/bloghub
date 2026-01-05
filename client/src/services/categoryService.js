import api from '../config/api';

export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (category) => {
    const response = await api.post('/categories', { category });
    return response.data;
  },

  attachCategoriesToPost: async (categories, postId) => {
    const response = await api.post('/categories/categoriesCollection', { categories, postId });
    return response.data;
  },

  updatePostCategories: async (postId, selectedCategories, removedCategories) => {
    const response = await api.put(`/categories/updateCategoriesCollection/${postId}`, {
      selectedCategories,
      removedCategories,
    });
    return response.data;
  },
};
