import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArticleCard,
  ImageContainer,
  ArticleImage,
  ContentContainer,
  CategoryTag,
  ArticleTitle,
  ArticleExcerpt,
  MetaContainer,
  MetaItem,
  AuthorInfo,
  AuthorAvatar,
  AuthorName,
  ReadMoreButton
} from "./PostCard-Style";
import { FaRegClock, FaRegComment, FaChevronRight } from 'react-icons/fa';

const calculateReadingTime = (content) => {
  if (!content) return '1 min';
  
  // Average reading speed: 200 words per minute
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  
  return `${minutes} min${minutes > 1 ? 's' : ''}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getExcerpt = (content, maxLength = 120) => {
  if (!content) return 'No content available';
  
  // Remove HTML tags for clean excerpt
  const plainText = content.replace(/<[^>]+>/g, '');
  
  if (plainText.length <= maxLength) return plainText;
  
  return plainText.substring(0, maxLength).trim() + '...';
};

const PostCard = ({ data, index }) => {
  if (!data) return null;
  
  const {
    _id,
    title,
    content,
    imageURL,
    category,
    user,
    commentCount = 0
  } = data;
  
  const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  const readingTime = calculateReadingTime(content);
  const excerpt = getExcerpt(content);
  const authorAvatar = user?.profileImage || "https://via.placeholder.com/40";
  const authorName = user?.username || "Anonymous";
  const categoryName = category?.name || "General";
  
  return (
    <ArticleCard>
      <ImageContainer>
        <CategoryTag>{categoryName}</CategoryTag>
        <ArticleImage src={imageURL || defaultImage} alt={title} />
      </ImageContainer>
      
      <ContentContainer>
        <Link to={`/post/${_id}`}>
          <ArticleTitle>{title}</ArticleTitle>
        </Link>
        
        <ArticleExcerpt>{excerpt}</ArticleExcerpt>
        
        <MetaContainer>
          <AuthorInfo>
            <AuthorAvatar src={authorAvatar} alt={authorName} />
            <AuthorName>{authorName}</AuthorName>
          </AuthorInfo>
          
          <div>
            <MetaItem>
              <FaRegClock />
              <span>{readingTime}</span>
            </MetaItem>
            
            <MetaItem>
              <FaRegComment />
              <span>{commentCount}</span>
            </MetaItem>
          </div>
        </MetaContainer>
        
        <ReadMoreButton to={`/post/${_id}`}>
          Read article <FaChevronRight />
        </ReadMoreButton>
      </ContentContainer>
    </ArticleCard>
  );
};

export default PostCard;
