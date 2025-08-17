import { useState, useEffect } from 'react';

const useGetTopAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTopAuthors = async () => {
      try {
        setLoading(true);
        // Replace with actual API call when available
        // For now, return mock data
        const mockAuthors = [
          { id: '1', username: 'JaneWriter', profileImage: 'https://randomuser.me/api/portraits/women/68.jpg', postCount: 24 },
          { id: '2', username: 'TechGuru', profileImage: 'https://randomuser.me/api/portraits/men/32.jpg', postCount: 19 },
          { id: '3', username: 'TravelExplorer', profileImage: 'https://randomuser.me/api/portraits/women/42.jpg', postCount: 15 },
          { id: '4', username: 'FoodieChef', profileImage: 'https://randomuser.me/api/portraits/men/75.jpg', postCount: 12 },
          { id: '5', username: 'FitnessCoach', profileImage: 'https://randomuser.me/api/portraits/women/90.jpg', postCount: 10 }
        ];
        
        setAuthors(mockAuthors);
      } catch (err) {
        setError('Failed to fetch top authors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopAuthors();
  }, []);
  
  return { authors, loading, error };
};

export default useGetTopAuthors; 