import styled, { css } from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { spin, fadeIn } from '../../../../components/common/theme/animations';

export const CommentsContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: white;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-top: 24px;
`;

export const CommentsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

export const CommentsCount = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;

  svg {
    font-size: 1.25rem;
    color: #3b82f6;
  }
`;

export const CommentHeaderTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin: 0 -24px;
  padding: 0 24px;
`;

export const CommentTab = styled.button`
  padding: 12px 16px;
  font-size: 0.875rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${(props) => (props.active ? '#3b82f6' : 'transparent')};
  color: ${(props) => (props.active ? '#3b82f6' : '#64748b')};
  font-weight: ${(props) => (props.active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => (props.active ? '#3b82f6' : '#334155')};
  }
`;

export const ControlsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 300px;

  @media (max-width: 640px) {
    max-width: 100%;
  }
`;

export const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.875rem;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  font-size: 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #334155;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const CommentSorter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SortLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  white-space: nowrap;
`;

export const SortSelect = styled.select`
  padding: 8px 12px;
  font-size: 0.875rem;
  color: #1e293b;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.875rem;
  color: ${(props) => (props.active ? '#ffffff' : '#64748b')};
  background-color: ${(props) => (props.active ? '#3b82f6' : 'white')};
  border: 1px solid ${(props) => (props.active ? '#3b82f6' : '#e2e8f0')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#2563eb' : '#f1f5f9')};
  }

  svg {
    font-size: 0.75rem;
  }
`;

export const CommentsList = styled.div`
  padding: ${(props) => (props.isLoading ? '24px' : '16px 24px')};
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 200px;
  position: relative;

  > * {
    animation: ${fadeIn} 0.3s ease-out;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 200px;
  color: #64748b;

  svg {
    font-size: 2rem;
    color: #3b82f6;
    animation: ${spin} 1s linear infinite;
  }
`;

export const NoCommentsMessage = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: #64748b;

  p {
    font-size: 1rem;
    margin: 0;
  }
`;

export const CommentPagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

export const PageButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => (props.active ? '#3b82f6' : '#e2e8f0')};
  background-color: ${(props) => (props.active ? '#3b82f6' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#64748b')};
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.active ? '#2563eb' : '#f1f5f9')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoadMoreButton = styled.button`
  margin: 16px auto 8px;
  padding: 10px 24px;
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f9ff;
    border-color: #93c5fd;
  }
`;
