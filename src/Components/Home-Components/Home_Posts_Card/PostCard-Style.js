import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { IoIosShareAlt } from 'react-icons/io';
import { BiSolidLike } from "react-icons/bi";
import { FaBookReader } from "react-icons/fa";

export const ArticleCard = styled.article`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    
    img {
      transform: scale(1.05);
    }
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

export const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

export const CategoryTag = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(90deg, #4f46e5, #3b82f6);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  flex-grow: 1;
`;

export const ArticleTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: #1e293b;
  line-height: 1.4;
  transition: color 0.2s ease;
  
  &:hover {
    color: #4f46e5;
  }
`;

export const ArticleExcerpt = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

export const MetaContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  margin-bottom: 1rem;
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const AuthorAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

export const AuthorName = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

export const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-left: 0.75rem;
  
  &:first-child {
    margin-left: 0;
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

export const ReadMoreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #4f46e5;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s ease;
  
  svg {
    transition: transform 0.2s ease;
    margin-left: 0.25rem;
    font-size: 0.75rem;
  }
  
  &:hover {
    color: #3730a3;
    
    svg {
      transform: translateX(3px);
    }
  }
`;

// Keep these for backward compatibility
export const ParentContainer = ArticleCard;
export const ImageSection = ImageContainer;
export const PostImage = ArticleImage;
export const DataWrapper = styled.div``;
export const DataSection = ContentContainer;
export const PostTitle = ArticleTitle;
export const PostDetailsSection = styled.div``;
export const PostDescription = ArticleExcerpt;
export const ButtonsSection = styled.div``;
export const SocialshareButton = styled.button``;
export const ShareIcon = styled(IoIosShareAlt)``;
export const LinkWrapper = styled(Link)``;
export const LikesButton = styled.button``;
export const PeopleLikedIcon = styled(BiSolidLike)``;
export const ViewsWrapper = styled.div``;
export const PeopleReadsIcon = styled(FaBookReader)``;
