import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  animation: ${fadeIn} 0.5s ease-out;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 2rem;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

export const SectionDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, rgba(226, 232, 240, 0), rgba(226, 232, 240, 1), rgba(226, 232, 240, 0));
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    margin: 3rem 0;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      border-radius: 2px;
    }
  }
  
  a {
    color: #3b82f6;
    font-weight: 500;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: #2563eb;
    }
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  gap: 1.5rem;
  color: #64748b;
  
  .loader {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-bottom-color: #3b82f6;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
  
  p {
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
    letter-spacing: -0.01em;
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  gap: 1.5rem;
  color: #ef4444;
  text-align: center;
  
  svg {
    font-size: 3rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 600;
  }
  
  p {
    font-size: 1.125rem;
    max-width: 600px;
    color: #64748b;
    line-height: 1.6;
  }
`;

export const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin: 3rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
    font-weight: 500;
  }
`;
