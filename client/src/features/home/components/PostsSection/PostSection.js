import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticlesContainer, ArticlesGrid, EmptyMessage, ViewAllButton } from './PostSection.styles';
import ArticleCard from '../PostsCard/PostCard';
import { FaChevronRight } from 'react-icons/fa';

export const PostSection = ({ data = [] }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/posts');
  };

  return (
    <ArticlesContainer>
      <ArticlesGrid>
        {data && data.length > 0 ? (
          data.map((article, index) => (
            <ArticleCard key={article._id || index} data={article} index={index} />
          ))
        ) : (
          <EmptyMessage>No articles available. Check back soon for new content!</EmptyMessage>
        )}
      </ArticlesGrid>

      {data && data.length > 0 && (
        <ViewAllButton onClick={handleViewAll}>
          View all articles <FaChevronRight />
        </ViewAllButton>
      )}
    </ArticlesContainer>
  );
};
