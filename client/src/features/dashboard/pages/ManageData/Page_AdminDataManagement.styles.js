import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: white;
  border-radius: 1rem;
  margin: 1rem;
  // height: 100%;
`;

export const Header = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
`;

export const Title = styled.h1`
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 20px 4px;
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 12px;
  width: 300px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #94a3b8;
    box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.1);
  }

  svg {
    color: #64748b;
  }
`;

export const SearchInput = styled.input`
  border: none;
  background: transparent;
  padding: 10px 12px;
  font-size: 14px;
  width: 100%;
  outline: none;
  color: #334155;

  &::placeholder {
    color: #94a3b8;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: ${(props) => (props.small ? '6px 12px' : '8px 16px')};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid ${(props) => (props.primary ? '#4f46e5' : props.danger ? '#ef4444' : '#e2e8f0')};
  background-color: ${(props) => (props.primary ? '#4f46e5' : props.danger ? '#ef4444' : 'white')};
  color: ${(props) => (props.primary || props.danger ? 'white' : '#64748b')};

  &:hover {
    background-color: ${(props) =>
      props.primary ? '#4338ca' : props.danger ? '#dc2626' : '#f8fafc'};
    border-color: ${(props) => (props.primary ? '#4338ca' : props.danger ? '#dc2626' : '#cbd5e1')};
    color: ${(props) => (props.primary || props.danger ? 'white' : '#334155')};
  }

  svg {
    stroke-width: 2px;
  }
`;

export const FilterButton = styled(Button)`
  background-color: white;
  color: #64748b;

  &:hover {
    background-color: #f8fafc;
    color: #334155;
  }
`;

export const RefreshButton = styled(Button)`
  background-color: white;
  color: #64748b;

  &:hover {
    background-color: #f8fafc;
    color: #334155;
  }
`;

export const FilterContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
`;

export const ButtonText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const ManageDataWrapper = styled.div`
  padding: 24px;
`;
