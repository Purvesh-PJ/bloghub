import styled, { css } from 'styled-components';
import { NavigateNextIcon, NavigateBeforeIcon } from '../../../../shared/icons';

export const ArticlesContainer = styled.section`
  position: relative;
  margin: 2rem 0;
`;

export const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const EmptyMessage = styled.div`
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

export const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem auto 0;
  padding: 0.875rem 1.75rem;
  background: transparent;
  color: #4f46e5;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    font-size: 0.875rem;
    transition: transform 0.2s ease;
  }

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-2px);

    svg {
      transform: translateX(3px);
    }
  }
`;

// Keep these for backward compatibility if needed
export const ParentContainer = ArticlesContainer;
export const PopularPostsTitle = styled.h1`
  border-radius: 10px;
  margin-bottom: 2rem;
  font-weight: 500;
`;
export const PopularPostCardsWrapper = ArticlesGrid;
export const TopicSection = styled.div`
  display: flex;
  width: 1200px;
  flex-wrap: wrap;
`;
export const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 10px;
  padding: 0.5rem;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;
export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
  color: black;
  &:hover {
    background-color: #f0f6f6;
  }
`;
export const PageNumButton = styled(Button)`
  width: 40px;
  height: 40px;
  background-color: white;
  color: black;
  border-radius: 2rem;
`;
export const PrevButton = styled(Button)`
  width: 40px;
  height: 40px;
  background-color: #e2e2e2;
  border-radius: 2rem;
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;
export const NextButton = styled(Button)`
  width: 40px;
  height: 40px;
  background-color: #e2e2e2;
  border-radius: 2rem;
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;
export const IconNavNext = styled(NavigateNextIcon)``;
export const IconNavPrev = styled(NavigateBeforeIcon)``;
