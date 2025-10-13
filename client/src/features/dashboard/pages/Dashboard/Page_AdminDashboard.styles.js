import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: ${({ theme }) => theme.palette.background.surface};
  padding: 1rem;
  margin: 1rem;
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: relative;
  min-height: 600px;
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background-color: ${({ theme }) => theme.palette.background.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

export const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.text.muted};
  margin: 0;
`;

export const StatIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.palette.common?.white || '#fff'};
  background-color: ${({ bg, theme }) => bg || theme.palette.primary.main};
`;

export const StatValue = styled.div`
  font-size: 1.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: 0.5rem;
`;

export const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;

  &.positive {
    color: ${({ theme }) => theme.palette.success.main};
  }
  &.negative {
    color: ${({ theme }) => theme.palette.error.main};
  }
`;

export const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.palette.background.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ChartTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.primary};
  margin: 0;
`;

export const ChartActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const ChartButton = styled.button`
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.palette.background.surface};
  color: ${({ theme }) => theme.palette.text.muted};
  border: 1px solid ${({ theme }) => theme.palette.grey[200]};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background-color: ${({ theme }) => theme.palette.background.subtle};
  }
  &.active {
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const TwoColumnGrid = styled.div`
  /* reserved: layout adjustments if needed */
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.palette.background.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

export const TableHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.primary};
  margin: 0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeaderRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey[200]};
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.text.muted};
  text-transform: uppercase;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey[200]};
  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.palette.text.primary};
`;

export const PostTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: 0.25rem;
`;

export const PostMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.palette.text.muted};
`;

export const ViewsCount = styled.div`
  font-weight: 500;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 0.75rem;
  font-weight: 500;

  &.published {
    background-color: #dcfce7;
    color: #16a34a;
  }
  &.draft {
    background-color: #f3f4f6;
    color: #6b7280;
  }
  &.archived {
    background-color: #fee2e2;
    color: #dc2626;
  }
`;

export const BarChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 200px;
  gap: 0.5rem;
  padding: 0 1rem;
`;

export const BarChartBar = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.palette.info.main};
  border-radius: 0.25rem 0.25rem 0 0;
  position: relative;
  min-width: 2rem;
  height: ${({ heightPct }) => heightPct || '0%'};

  &:hover {
    background-color: ${({ theme }) => theme.palette.info.dark};
  }

  &::after {
    content: attr(data-value);
    position: absolute;
    top: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.muted};
  }
`;

export const BarChartLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0 1rem;
`;

export const BarChartLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.palette.text.muted};
  text-align: center;
  flex: 1;
  min-width: 2rem;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: ${({ theme }) => theme.radii.lg};
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.palette.info.main};
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.palette.text.muted};
  font-weight: 500;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background-color: #fef2f2;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid #fee2e2;
  width: 100%;
  min-height: 300px;
`;

export const ErrorIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: #fee2e2;
  border-radius: 9999px;
  margin-bottom: 1rem;
  color: #dc2626;
`;

export const ErrorTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.error.dark};
  margin-bottom: 0.5rem;
`;

export const ErrorMessage = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.palette.error.main};
  margin-bottom: 1.5rem;
`;

export const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ theme }) => theme.palette.background.surface};
  color: ${({ theme }) => theme.palette.error.dark};
  border: 1px solid ${({ theme }) => theme.palette.error.dark};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fee2e2;
  }
`;
