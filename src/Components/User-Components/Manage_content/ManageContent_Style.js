import styled from "styled-components";
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Eye, FilePenLine, Trash2 } from 'lucide-react';

// Main container
export const Container = styled.div`
  // background-color: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  // width: 100%;
  box-sizing : border-box;
`;

// Header section
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #334155;
  margin: 0;
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background : transparent;
  background-color : oklch(0.967 0.003 264.542);
  color: oklch(0.208 0.042 265.755);
  border: none;
  border-radius: 200px;
  padding: 10px 16px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    color : oklch(0.446 0.03 256.802);
  }
  
  svg {
    font-size: 16px;
  }
`;

// Filter and search section
export const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 12px;
  flex: 1;
  max-width: 400px;
  
  svg {
    color: #94a3b8;
    margin-right: 8px;
  }
  
  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const SearchInput = styled.input`
  border: none;
  background-color: transparent;
  padding: 10px 0;
  width: 100%;
  font-size: 0.9rem;
  color: #334155;
  outline: none;
  
  &::placeholder {
    color: #94a3b8;
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
  }
  
  svg {
    font-size: 18px;
  }
`;

export const StatusSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
  font-size: 0.9rem;
  color: #475569;
  outline: none;
  cursor: pointer;
  
  &:hover {
    border-color: #cbd5e1;
  }
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
`;

// Empty state styles
export const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
  border-radius: 10px;
  border: 1px dashed #cbd5e1;
  background-color: white;
  padding: 40px 20px;
  text-align: center;
    box-sizing : border-box;
`;

export const EmptyStateIcon = styled(AddCircleOutlineIcon)`
  font-size: 64px !important;
  color: #94a3b8;
  margin-bottom: 16px;
`;

export const EmptyStateText = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #475569;
`;

export const EmptyStateSubtext = styled.p`
  margin: 0 0 24px 0;
  font-size: 0.9rem;
  color: #64748b;
  max-width: 400px;
`;

export const LinkRoute = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #2563eb;
  }
  
  svg {
    font-size: 20px;
  }
`;

export const Text = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
`; 

// Table styles (enhancing existing styles)
export const TableContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  
  .rdt_Table {
    border: none;
    font-family: inherit;
  }
  
  .rdt_TableHeader {
    background-color: #f8fafc;
    padding: 16px;
    font-weight: 600;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .rdt_TableHeadRow {
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 600;
    color: #475569;
  }
  
  .rdt_TableRow {
    border-bottom: 1px solid #e2e8f0;
    &:hover {
      background-color: #f1f5f9;
    }
  }
  
  .rdt_TableCell {
    padding: 16px;
  }
`;

export const FixedHeaderSizeTitle = styled.div`
  font-size: 0.820rem;
  color: oklch(55.4% 0.046 257.417);
  font-weight: 400;
  
  &:hover {
    color: oklch(37.2% 0.044 257.287);
    cursor: pointer;
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ status }) => {
    switch (status) {
      case 'public':
        return `
          background-color: #dcfce7;
          color: #166534;
        `;
      case 'private':
        return `
          background-color: #ffedd5;
          color: #9a3412;
        `;
      case 'draft':
      default:
        return `
          background-color: #f3f4f6;
          color: oklch(44.6% 0.043 257.281);
        `;
    }
  }}
`;

// Action buttons
export const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const ActionButton = styled.div`
  display: flex;
  gap: 8px;
`;

export const Edit = styled(FilePenLine)`
  color: oklch(44.6% 0.043 257.281);
  // background-color: #eff6ff;
  border-radius: 8px;
  padding: 6px;
  font-size: 20px !important;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: oklch(92.9% 0.013 255.508);
    transform: translateY(-2px);
    cursor: pointer;
  }
`;

export const View = styled(Eye)`
  color: oklch(44.6% 0.043 257.281);
  // background-color: #f0fdfa;
  border-radius: 8px;
  padding: 6px;
  font-size: 20px !important;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: oklch(92.9% 0.013 255.508);
    transform: translateY(-2px);
    cursor: pointer;
  }
`;

export const Delete = styled(Trash2)`
  color: oklch(44.6% 0.043 257.281);
  // background-color: #fef2f2;
  border-radius: 8px;
  padding: 6px;
  font-size: 20px !important;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: oklch(92.9% 0.013 255.508);
    transform: translateY(-2px);
    cursor: pointer;
  }
`;

// Loading state
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

export const LoadingSpinner = styled.div`
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Pagination styles (if your Table component uses pagination)
export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
`;