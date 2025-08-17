import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FaLaptopCode, FaCamera, FaPalette, FaChartLine, 
  FaUtensils, FaPlane, FaHeartbeat, FaBook, 
  FaMusic, FaFilm, FaFlask, FaLeaf
} from 'react-icons/fa';

const CategoriesContainer = styled.section`
  margin: 2rem 0;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
`;

const CategoryCard = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  border-radius: 16px;
  text-decoration: none;
  color: white;
  text-align: center;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.gradient || 'linear-gradient(135deg, #4f46e5, #3b82f6)'};
    z-index: -1;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    
    &::before {
      transform: scale(1.1);
    }
    
    .icon-container {
      transform: translateY(-5px);
    }
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-bottom: 1.25rem;
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease;
  
  svg {
    font-size: 2rem;
  }
`;

const CategoryName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 0.01em;
`;

const CategoryCount = styled.span`
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 500;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 1.125rem;
  padding: 3rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px dashed #e2e8f0;
  width: 100%;
  grid-column: 1 / -1;
`;

// Map of category names to icons and gradients
const categoryIcons = {
  'Technology': { icon: <FaLaptopCode />, gradient: 'linear-gradient(135deg, #4f46e5, #3b82f6)' },
  'Photography': { icon: <FaCamera />, gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  'Art': { icon: <FaPalette />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  'Business': { icon: <FaChartLine />, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  'Food': { icon: <FaUtensils />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  'Travel': { icon: <FaPlane />, gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' },
  'Health': { icon: <FaHeartbeat />, gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
  'Literature': { icon: <FaBook />, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
  'Music': { icon: <FaMusic />, gradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)' },
  'Film': { icon: <FaFilm />, gradient: 'linear-gradient(135deg, #0d9488, #2dd4bf)' },
  'Science': { icon: <FaFlask />, gradient: 'linear-gradient(135deg, #0369a1, #0ea5e9)' },
  'Nature': { icon: <FaLeaf />, gradient: 'linear-gradient(135deg, #16a34a, #4ade80)' }
};

// Default icon and gradient for categories not in our map
const defaultCategory = { 
  icon: <FaBook />, 
  gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)' 
};

const CategoriesSection = ({ categories = [] }) => {
  return (
    <CategoriesContainer>
      <CategoriesGrid>
        {categories.length > 0 ? (
          categories.map((category) => {
            const categoryInfo = categoryIcons[category.name] || defaultCategory;
            
            return (
              <CategoryCard 
                key={category._id || category.id} 
                to={`/categories/${category._id || category.id}`}
                gradient={categoryInfo.gradient}
              >
                <IconContainer className="icon-container">
                  {categoryInfo.icon}
                </IconContainer>
                <CategoryName>{category.name}</CategoryName>
                <CategoryCount>
                  {category.count || 0} {(category.count === 1) ? 'post' : 'posts'}
                </CategoryCount>
              </CategoryCard>
            );
          })
        ) : (
          <EmptyMessage>
            No categories available. Check back soon for new content!
          </EmptyMessage>
        )}
      </CategoriesGrid>
    </CategoriesContainer>
  );
};

export default CategoriesSection;