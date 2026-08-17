import api from '../config/api';

export const categoryService = {
  /**
   * Categories, each carrying `postCount`.
   *
   * By default only categories that have published stories come back, so a reader is never
   * offered a filter that leads to an empty list. Pass `withEmpty` where the point is to
   * choose rather than to browse — the editor and the admin console, which must be able to
   * offer a category nobody has used yet.
   */
  getCategories: async ({ withEmpty = false } = {}) => {
    const response = await api.get('/categories', {
      params: withEmpty ? { withEmpty: 'true' } : undefined,
    });
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
