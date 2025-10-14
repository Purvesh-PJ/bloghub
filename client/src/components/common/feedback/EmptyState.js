import styled from 'styled-components';

// Empty state container
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing(12)};
  min-height: ${({ $minHeight }) => $minHeight || '300px'};
`;

// Empty state icon wrapper
export const EmptyStateIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => $size || '64px'};
  height: ${({ $size }) => $size || '64px'};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.palette.grey[400]};
  opacity: 0.5;

  svg {
    width: 100%;
    height: 100%;
  }
`;

// Empty state title
export const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.palette.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
`;

// Empty state description
export const EmptyStateDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.palette.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing(6)} 0;
  max-width: 400px;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

// Empty state action container
export const EmptyStateAction = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  flex-wrap: wrap;
  justify-content: center;
`;

// Compose EmptyState with sub-components
EmptyState.Icon = EmptyStateIcon;
EmptyState.Title = EmptyStateTitle;
EmptyState.Description = EmptyStateDescription;
EmptyState.Action = EmptyStateAction;

export default EmptyState;