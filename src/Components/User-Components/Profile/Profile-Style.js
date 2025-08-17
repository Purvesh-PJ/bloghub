import styled from 'styled-components';

export const ProfileContainer = styled.div`
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
`;

export const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.2rem;
  color: #64748b;
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 24px;
  background-color: #fef2f2;
  border-radius: 8px;
  
  p {
    color: #b91c1c;
    font-size: 1.1rem;
    margin-bottom: 16px;
    text-align: center;
  }
`;

export const RetryButton = styled.button`
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #dc2626;
  }
`; 