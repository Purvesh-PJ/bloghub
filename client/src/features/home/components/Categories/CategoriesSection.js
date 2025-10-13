import React from 'react';
import {
  FaLaptopCode,
  FaCamera,
  FaPalette,
  FaChartLine,
  FaUtensils,
  FaPlane,
  FaHeartbeat,
  FaBook,
  FaMusic,
  FaFilm,
  FaFlask,
  FaLeaf,
} from 'react-icons/fa';
import {
  CategoriesContainer,
  CategoriesGrid,
  CategoryCard,
  IconContainer,
  CategoryName,
  CategoryCount,
  EmptyMessage,
} from './CategoriesSection.styles';

// Map of category names to icons and gradients
const categoryIcons = {
  Technology: { icon: <FaLaptopCode />, gradient: 'linear-gradient(135deg, #4f46e5, #3b82f6)' },
  Photography: { icon: <FaCamera />, gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  Art: { icon: <FaPalette />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  Business: { icon: <FaChartLine />, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  Food: { icon: <FaUtensils />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  Travel: { icon: <FaPlane />, gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' },
  Health: { icon: <FaHeartbeat />, gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
  Literature: { icon: <FaBook />, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
  Music: { icon: <FaMusic />, gradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)' },
  Film: { icon: <FaFilm />, gradient: 'linear-gradient(135deg, #0d9488, #2dd4bf)' },
  Science: { icon: <FaFlask />, gradient: 'linear-gradient(135deg, #0369a1, #0ea5e9)' },
  Nature: { icon: <FaLeaf />, gradient: 'linear-gradient(135deg, #16a34a, #4ade80)' },
};

// Default icon and gradient for categories not in our map
const defaultCategory = {
  icon: <FaBook />,
  gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)',
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
                $gradient={categoryInfo.gradient}
              >
                <IconContainer className="icon-container">{categoryInfo.icon}</IconContainer>
                <CategoryName>{category.name}</CategoryName>
                <CategoryCount>
                  {category.count || 0} {category.count === 1 ? 'post' : 'posts'}
                </CategoryCount>
              </CategoryCard>
            );
          })
        ) : (
          <EmptyMessage>No categories available. Check back soon for new content!</EmptyMessage>
        )}
      </CategoriesGrid>
    </CategoriesContainer>
  );
};

export default CategoriesSection;
