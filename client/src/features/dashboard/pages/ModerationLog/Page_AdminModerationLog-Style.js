import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 1rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Title = styled.h1`
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 320px;
`;

export const SearchInput = styled.input`
  width: 80%;
  padding: 0.5rem 0.75rem;
  padding-left: 2.25rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  color: #4b5563;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #9ca3af;
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const FilterSelect = styled.select`
  padding: 0.5rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  font-size: 0.75rem;
  color: #4b5563;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }
`;

export const DateRangeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const DateInput = styled.input`
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  color: #4b5563;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }
`;

export const CardContainer = styled.div`
  background-color: oklch(98.4% 0.003 247.858);
  border-radius: 1rem;
  overflow: hidden;
  flex: 1;
`;

export const LogList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LogItem = styled.div`
  padding: 0.8rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

export const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

export const LogInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LogTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

export const LogMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: oklch(20.8% 0.042 265.755);
`;

export const LogMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const ActionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 9px;
  font-size: 0.75rem;
  font-weight: 500;

  &.approve {
    background-color: #dcfce7;
    color: #16a34a;
  }

  &.reject {
    background-color: #fee2e2;
    color: #dc2626;
  }

  &.delete {
    background-color: #fecaca;
    color: #b91c1c;
  }

  &.ban {
    background-color: #f3f4f6;
    color: #1f2937;
  }

  &.unban {
    background-color: #e0f2fe;
    color: #0284c7;
  }

  &.warn {
    background-color: #fef3c7;
    color: #d97706;
  }
`;

export const LogContent = styled.div`
  margin-bottom: 1rem;
`;

export const LogDescription = styled.div`
  font-size: 0.75rem;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const LogDetails = styled.div`
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

export const LogNote = styled.div`
  font-style: italic;
  font-size: 0.75rem;
  color: #6b7280;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

export const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const PaginationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background-color: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #f9fafb;
    color: #4b5563;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.active {
    background-color: #2563eb;
    color: white;
    border-color: #2563eb;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: #f3f4f6;
  border-radius: 9999px;
  margin-bottom: 1rem;
  color: #9ca3af;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const EmptyStateText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background-color: #2563eb;
    color: white;
    border: none;

    &:hover {
      background-color: #1d4ed8;
    }
  }

  &.secondary {
    background-color: white;
    color: #4b5563;
    border: 1px solid #d1d5db;

    &:hover {
      background-color: #f9fafb;
    }
  }
`;
