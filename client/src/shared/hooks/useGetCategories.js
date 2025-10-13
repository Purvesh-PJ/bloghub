import { useState, useEffect } from 'react';

const useGetCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Replace with actual API call when available
        // For now, return mock data
        const mockCategories = [
          { id: 'technology', name: 'Technology', count: 12, color: '#3b82f6' },
          { id: 'travel', name: 'Travel', count: 8, color: '#ef4444' },
          { id: 'lifestyle', name: 'Lifestyle', count: 15, color: '#10b981' },
          { id: 'food', name: 'Food & Cooking', count: 10, color: '#f59e0b' },
          { id: 'business', name: 'Business', count: 5, color: '#8b5cf6' },
          { id: 'health', name: 'Health & Fitness', count: 7, color: '#ec4899' },
        ];

        setCategories(mockCategories);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useGetCategories;
