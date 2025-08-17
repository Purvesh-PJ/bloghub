import styled from 'styled-components';
import { TbArrowsUpDown, TbSortAscending, TbSortDescending } from 'react-icons/tb';

export const ParentContainer = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  background-color: white;
`;

export const SearchFieldWrapper = styled.div`
  padding: 16px 16px 8px;
  display: flex;
  align-items: center;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
`;

export const TableHeadContainer = styled.thead`
  background-color: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const ArrowUpAndDownIcon = styled(TbArrowsUpDown)`
  font-size: 15px;
  color: #64748b;
  transition: color 0.2s ease;
`;

export const SortAscendingIcon = styled(TbSortAscending)`
  font-size: 15px;
  color: #333;
`;

export const SortDescendingIcon = styled(TbSortDescending)`
  font-size: 15px;
  color: #333;
`;

export const TableHead = styled.th`
  padding: 16px;
  color: #475569;
  font-weight: 600;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
  
  &:hover {
    ${ArrowUpAndDownIcon} {
      color: #0f172a;
    }
    background-color: #f1f5f9;
  }
`;

export const TableBody = styled.tbody`
  font-weight: 400;
`;

export const Row = styled.tr`
  transition: background-color 0.15s ease;
  
  &:hover {
    background-color: #f8fafc;
  }
  
  &.footer-bottom-none {
    border: none;
  }
`;  

export const TableData = styled.td`
  padding: 12px 16px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
`;

export const TableFooter = styled.tfoot`
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
`;

export const SelectedRecordsTypo = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin: 0;
`;

export const Span = styled.span`
  margin-left: 5px;
`;

export const Wrapper = styled.div`
  display: flex; 
  flex-direction: row; 
  justify-content: space-between;
  align-items: center;
  padding: 0;
  gap: 6px;
`;

export const HeadWrapper = styled.div`
  font-size: 13px;
  letter-spacing: 0.01em;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const CelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

// Pagination Styles
export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 8px 0;
`;

export const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background-color: ${props => props.active ? '#e0e7ff' : 'transparent'};
  color: ${props => props.active ? '#4f46e5' : '#64748b'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#e0e7ff' : '#f1f5f9'};
    color: ${props => props.active ? '#4f46e5' : '#1e293b'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageSizeSelector = styled.select`
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: white;
  font-size: 12px;
  color: #64748b;
  outline: none;
  cursor: pointer;
  
  &:focus {
    border-color: #94a3b8;
  }
`;

export const PaginationText = styled.span`
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
`;

export const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  accent-color: #4f46e5;
`;

