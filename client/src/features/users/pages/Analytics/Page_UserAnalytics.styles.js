import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
  width: 98%;
  max-width: 14000px;
  margin: 1rem auto;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  background-color: white;
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

export const HeaderControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const DateRangeSelector = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: white;
  font-size: 0.75rem;
  color: #334155;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Tab = styled.button`
  padding: 12px 16px;
  background-color: transparent;
  border: none;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  font-weight: 500;
  color: ${(props) => (props.active ? 'oklch(21% 0.034 264.665)' : '#64748b')};
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${(props) => (props.active ? 'oklch(21% 0.034 264.665)' : 'transparent')};
  white-space: nowrap;

  &:hover {
    color: ${(props) => (props.active ? 'oklch(21% 0.034 264.665)' : '#1e293b')};
  }

  &:focus {
    outline: none;
  }
`;

export const OverviewSection = styled.section`
  margin-bottom: 32px;
`;

export const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  display: flex;
  align-items: start;
  padding: 0.8rem 1rem 0.5rem 1rem;
  background-color: oklch(0.985 0.002 247.839);
  border-radius: 12px;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  // background-color: ${(props) => `${props.color}10` || '#4f46e510'};
  // color: ${(props) => props.color || '#4f46e5'};
  color: lightgray;
  display: flex;
  // align-items: center;
  // justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;

  svg {
    font-size: 2rem;
    color: oklch(0.551 0.027 264.364);
  }
`;

export const StatContent = styled.div`
  flex: 1;
`;

export const StatValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: oklch(0.446 0.03 256.802);
  margin-bottom: 2px;
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: oklch(44.6% 0.043 257.281);
  margin-bottom: 8px;
`;

export const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) =>
    props.positive ? 'oklch(62.7% 0.194 149.214)' : 'oklch(57.7% 0.245 27.325)'};

  svg {
    font-size: 0.75rem;
  }
`;

export const ChartSection = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartContainer = styled.div`
  background-color: oklch(0.985 0.002 247.839);
  border-radius: 1rem;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  padding: 20px;
  overflow: hidden;
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ChartTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: oklch(0.446 0.03 256.802);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #4f46e5;
  }
`;

export const EngagementSection = styled.section`
  margin-bottom: 32px;
`;

export const EngagementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const PostCard = styled.div`
  display: flex;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const PostImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 80px;
    height: 80px;
  }
`;

export const PostContent = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

export const PostTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const PostStats = styled.div`
  display: flex;
  gap: 16px;
  margin-top: auto;
  flex-wrap: wrap;
`;

export const PostStat = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: #64748b;

  svg {
    color: #4f46e5;
    font-size: 0.875rem;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px;
  color: #94a3b8;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 16px 0 8px 0;
  }

  p {
    font-size: 0.9375rem;
    color: #64748b;
    max-width: 480px;
    margin: 0;
  }
`;

// New components for enhanced analytics dashboard
export const FilterControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background-color: oklch(0.985 0.002 247.839);
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    color: #4f46e5;
  }
`;

export const DropdownFilter = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: white;
  font-size: 0.875rem;
  color: #334155;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

export const TopPostsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 32px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const TableHeader = styled.tr`
  background-color: #f8fafc;
`;

export const TableCell = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #334155;
  width: ${(props) => props.width || 'auto'};
  cursor: ${(props) => (props.sortable ? 'pointer' : 'default')};

  &:first-child {
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
  }

  svg {
    margin-left: 4px;
    font-size: 0.75rem;
    vertical-align: middle;
  }
`;

export const TableRow = styled.tr`
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

export const SortIcon = styled.span`
  margin-left: 4px;
  color: #4f46e5;
`;

export const AuthorCard = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const AuthorAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
`;

export const AuthorInfo = styled.div`
  flex: 1;
`;

export const AuthorName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
`;

export const AuthorStats = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

export const PieChartLegend = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding-left: 16px;
  width: 40%;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #1e293b;
`;

export const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
`;

export const LegendLabel = styled.span`
  font-size: 0.875rem;
  color: #334155;
`;
