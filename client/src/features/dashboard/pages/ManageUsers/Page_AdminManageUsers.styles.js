import styled from 'styled-components';

export const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  padding: 1rem;
  margin: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
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
  color: #111827;
  margin-left: 0.4rem;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  margin-right: 0.5rem;
  z-index: 1;
`;

export const SearchInput = styled.input`
  width: 80%;
  padding: 0.625rem 0.75rem 0.625rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }

  &.primary {
    background-color: oklch(27.9% 0.041 260.031);
    border-color: oklch(27.9% 0.041 260.031);
    color: white;

    &:hover {
      background-color: oklch(37.2% 0.044 257.287);
    }
  }
`;

export const CardContainer = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const TableRow = styled.tr`
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  &.active {
    background-color: #dcfce7;
    color: #15803d;
  }

  &.inactive {
    background-color: #fee2e2;
    color: #b91c1c;
  }
`;

export const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.span`
  font-weight: 500;
  color: #111827;
`;

export const UserEmail = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`;

export const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  &.admin {
    background-color: #e0e7ff;
    color: #4338ca;
  }

  &.member {
    background-color: #f3f4f6;
    color: #4b5563;
  }
`;
