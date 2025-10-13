import { useState, useEffect } from 'react';
import { getCategories } from '../services/categoryApi';

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await getCategories();
        setCategories(response.data.data);
      } catch (error) {
        setCategoriesError(`Error fetching categories: ${error.response?.status || error.message}`);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return {
    categories,
    categoriesLoading,
    categoriesError,
  };
};

export default useFetchCategories;
