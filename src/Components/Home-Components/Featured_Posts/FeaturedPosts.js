import React from 'react';
import styled from 'styled-components';
import { FaRegClock, FaRegComment, FaChevronRight, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../../../Pages/Home-Pages/Home_Main/Page_Home-Style';

const FeaturedContainer = styled.section`
  margin: 4rem 0 2rem;
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainFeature = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    
    img {
      transform: scale(1.05);
    }
  }
  
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const MainFeatureImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.2) 100%
    );
    z-index: 2;
  }
`;

const MainFeatureContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  z-index: 3;
  color: white;
`;

const MainFeatureCategory = styled.span`
  display: inline-block;
  background: linear-gradient(90deg, #4f46e5, #3b82f6);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MainFeatureTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
  
  a {
    color: white;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: #a5b4fc;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const MainFeatureExcerpt = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
`;

const MainFeatureMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .meta-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    div {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  .bookmark {
    cursor: pointer;
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.2s ease;
    
    &:hover {
      color: white;
      transform: scale(1.1);
    }
  }
`;

const SecondaryPostsGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  gap: 2rem;
  height: 500px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    height: auto;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SecondaryPost = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
    
    img {
      transform: scale(1.05);
    }
  }
`;

const SecondaryPostImageContainer = styled.div`
  height: 160px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
`;

const SecondaryPostCategory = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(90deg, #4f46e5, #3b82f6);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SecondaryPostContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const SecondaryPostTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  
  a {
    color: #1e293b;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: #4f46e5;
    }
  }
`;

const SecondaryPostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: #64748b;
  margin-top: auto;
  
  div {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
`;

const ReadMoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-top: 1rem;
  color: #4f46e5;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s ease;
  
  svg {
    transition: transform 0.2s ease;
    margin-left: 0.25rem;
  }
  
  &:hover {
    color: #3730a3;
    
    svg {
      transform: translateX(3px);
    }
  }
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

const FeaturedPosts = ({ posts = [] }) => {
  // Default image if no post image is available
  const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get main featured post (first one)
  const mainPost = posts.length > 0 ? posts[0] : null;
  
  // Get secondary featured posts (next three)
  const secondaryPosts = posts.length > 1 ? posts.slice(1, 3) : [];
  
  return (
    <FeaturedContainer>
      <SectionHeader>
        <h2>Featured Posts</h2>
        <Link to="/posts">
          View all posts <FaChevronRight />
        </Link>
      </SectionHeader>
      
      {posts.length > 0 ? (
        <FeaturedGrid>
          {/* Main Featured Post */}
          <MainFeature>
            <MainFeatureImage>
              <img 
                src={mainPost.imageURL || defaultImage} 
                alt={mainPost.title} 
              />
            </MainFeatureImage>
            
            <MainFeatureContent>
              <MainFeatureCategory>
                {mainPost.category?.name || "Featured"}
              </MainFeatureCategory>
              
              <MainFeatureTitle>
                <Link to={`/post/${mainPost._id}`}>{mainPost.title}</Link>
              </MainFeatureTitle>
              
              <MainFeatureExcerpt>
                {mainPost.excerpt || mainPost.content?.substring(0, 150) || "No content provided"}...
              </MainFeatureExcerpt>
              
              <MainFeatureMeta>
                <div className="meta-left">
                  <div>
                    <FaRegClock />
                    {formatDate(mainPost.createdAt)}
                  </div>
                  <div>
                    <FaRegComment />
                    {mainPost.commentCount || 0} comments
                  </div>
                </div>
                
                <FaRegBookmark className="bookmark" />
              </MainFeatureMeta>
            </MainFeatureContent>
          </MainFeature>
          
          {/* Secondary Featured Posts */}
          <SecondaryPostsGrid>
            {secondaryPosts.map((post) => (
              <SecondaryPost key={post._id}>
                <SecondaryPostImageContainer>
                  <SecondaryPostCategory>
                    {post.category?.name || "General"}
                  </SecondaryPostCategory>
                  <img 
                    src={post.imageURL || defaultImage} 
                    alt={post.title} 
                  />
                </SecondaryPostImageContainer>
                
                <SecondaryPostContent>
                  <SecondaryPostTitle>
                    <Link to={`/post/${post._id}`}>{post.title}</Link>
                  </SecondaryPostTitle>
                  
                  <SecondaryPostMeta>
                    <div>
                      <FaRegClock />
                      {formatDate(post.createdAt)}
                    </div>
                    <div>
                      <FaRegComment />
                      {post.commentCount || 0}
                    </div>
                  </SecondaryPostMeta>
                  
                  <ReadMoreLink to={`/post/${post._id}`}>
                    Read article <FaChevronRight />
                  </ReadMoreLink>
                </SecondaryPostContent>
              </SecondaryPost>
            ))}
          </SecondaryPostsGrid>
        </FeaturedGrid>
      ) : (
        <EmptyMessage>
          No featured posts available. Check back soon for new content!
        </EmptyMessage>
      )}
    </FeaturedContainer>
  );
};

export default FeaturedPosts;