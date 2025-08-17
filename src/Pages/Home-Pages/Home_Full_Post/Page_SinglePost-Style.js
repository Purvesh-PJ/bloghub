import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #f8fafc;
  min-width: 50%;
  min-height: 400px;
  gap: 20px;
  padding: 20px;
  max-width: 1440px;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    padding: 16px;
    gap: 16px;
  }
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 32px;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const LeftContainer = styled.div`
  padding: 0;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 992px) {
    width: 100%;
    order: 2;
  }
`;

export const RightContainer = styled.div`
  padding: 0;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  .bookmark-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    
    &:hover {
      background-color: #f1f5f9;
      transform: translateY(-2px);
    }
    
    svg {
      font-size: 1.25rem;
      color: #3b82f6;
    }
  }
  
  @media (max-width: 992px) {
    width: 100%;
    order: 3;
  }
`;

export const RelatedPostsSection = styled.div`
  position: sticky;
  top: 4rem;
  border-radius: 12px;
  background-color: white;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.4s ease-out;
  
  .placeholder-text {
    color: #94a3b8;
    font-size: 0.875rem;
    text-align: center;
    margin-top: 2rem;
    font-style: italic;
  }
`;

export const TableOfContentsWrapper = styled.div`
  position: sticky;
  top: 4rem;
  border-radius: 12px;
  background-color: white;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.3s ease-out;
`;

export const PopularTagsWrapper = styled.div`
  border-radius: 12px;
  background-color: white;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.5s ease-out;
`;

export const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

export const TagLink = styled(Link)`
  background-color: #f1f5f9;
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e0f2fe;
    color: #2563eb;
    transform: translateY(-2px);
  }
`;

export const PostTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
`;

export const ReadingProgress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background-color: #3b82f6;
  z-index: 1000;
  transition: width 0.3s ease;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 100%;
  color: #64748b;
  font-size: 1rem;
  gap: 16px;
  
  .loading-icon {
    font-size: 2.5rem;
    animation: ${spin} 1s linear infinite;
    color: #3b82f6;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 100%;
  color: #ef4444;
  font-size: 1rem;
  gap: 16px;
  
  svg {
    font-size: 3rem;
  }
  
  p {
    max-width: 500px;
    text-align: center;
  }
`;

export const BackToTopButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
  
  &:hover {
    background-color: #2563eb;
    transform: translateY(-4px);
  }
  
  svg {
    font-size: 24px;
  }
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
`;

export const AuthorProfileCard = styled.div`
  display: flex;
  gap: 20px;
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border-top: 4px solid #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .author-info {
    flex: 1;
    
    h3 {
      font-size: 0.875rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 4px 0;
    }
    
    h4 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1e293b;
    }
    
    p {
      font-size: 0.9375rem;
      color: #475569;
      margin: 0 0 16px 0;
      line-height: 1.5;
    }
    
    .view-profile {
      display: inline-block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #3b82f6;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    
    img {
      margin-bottom: 8px;
    }
  }
`;

export const SubscriptionBox = styled.div`
  background-color: #eff6ff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #bfdbfe;
  animation: ${fadeIn} 0.6s ease-out;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e40af;
    margin: 0 0 8px 0;
  }
  
  p {
    font-size: 0.9375rem;
    color: #3b82f6;
    margin: 0 0 16px 0;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
    
    input {
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #bfdbfe;
      font-size: 0.875rem;
      
      &:focus {
        outline: none;
        border-color: #3b82f6;
      }
    }
    
    button {
      padding: 12px;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: #2563eb;
      }
    }
  }
  
  small {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
  }
`;

export const PostNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 0;
  margin: 0;
  
  a {
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 45%;
    text-decoration: none;
    color: #64748b;
    transition: all 0.2s ease;
    padding: 8px;
    border-radius: 8px;
    
    &:hover {
      background-color: #f8fafc;
      color: #3b82f6;
    }
    
    svg {
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    
    div {
      overflow: hidden;
    }
    
    span {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    
    p {
      font-weight: 500;
      font-size: 0.9375rem;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  .prev-post {
    margin-right: auto;
  }
  
  .next-post {
    margin-left: auto;
    text-align: right;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 16px;
    
    a {
      max-width: 100%;
    }
  }
`;