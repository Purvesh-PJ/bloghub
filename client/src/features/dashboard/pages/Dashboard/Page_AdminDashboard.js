import React, { useState, useEffect } from 'react';
import {
  Container,
  DashboardGrid,
  StatCard,
  StatHeader,
  StatTitle,
  StatIconWrapper,
  StatValue,
  StatChange,
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartActions,
  ChartButton,
  TwoColumnGrid,
  TableContainer,
  TableHeader,
  TableTitle,
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
  PostTitle,
  PostMeta,
  ViewsCount,
  Badge,
  BarChartContainer,
  BarChartBar,
  BarChartLabels,
  BarChartLabel,
  LoadingOverlay,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
} from './Page_AdminDashboard.styles';
import { Users, MessageSquare, TrendingUp, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert } from '../../../../components/ui/primitives';
import styled from 'styled-components';

const AlertTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: inherit;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: transparent;
  color: currentColor;
  border: 1px solid currentColor;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;
const Page_AdminDashboard = () => {
  // Add state management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    weeklyUserData: [],
    trendingPosts: [],
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In a real app, you would fetch this data from your API
        // For now, we'll use sample data
        const stats = [
          {
            title: 'Total Users',
            value: '2,543',
            change: '12% increase',
            isPositive: true,
            color: '#3b82f6',
            icon: <Users size={16} />,
          },
          {
            title: 'New Posts',
            value: '45',
            change: '8% increase',
            isPositive: true,
            color: '#10b981',
            icon: <FileText size={16} />,
          },
          {
            title: 'Comments',
            value: '126',
            change: '5% decrease',
            isPositive: false,
            color: '#f59e0b',
            icon: <MessageSquare size={16} />,
          },
        ];

        const weeklyUserData = [
          { day: 'Mon', value: 18 },
          { day: 'Tue', value: 22 },
          { day: 'Wed', value: 30 },
          { day: 'Thu', value: 25 },
          { day: 'Fri', value: 28 },
          { day: 'Sat', value: 12 },
          { day: 'Sun', value: 9 },
        ];

        const trendingPosts = [
          {
            id: 1,
            title: 'The Future of AI in Web Development',
            author: 'John Doe',
            date: 'Apr 5, 2025',
            views: '1.2k',
            status: 'published',
          },
          {
            id: 2,
            title: 'React vs Vue: Which Should You Choose in 2025?',
            author: 'Jane Smith',
            date: 'Apr 3, 2025',
            views: '856',
            status: 'published',
          },
          {
            id: 3,
            title: 'Getting Started with TypeScript',
            author: 'Michael Johnson',
            date: 'Apr 2, 2025',
            views: '743',
            status: 'draft',
          },
          {
            id: 4,
            title: 'CSS Grid Layout: A Complete Guide',
            author: 'Sarah Williams',
            date: 'Mar 30, 2025',
            views: '621',
            status: 'published',
          },
          {
            id: 5,
            title: 'Introduction to Web3 Development',
            author: 'David Brown',
            date: 'Mar 28, 2025',
            views: '512',
            status: 'archived',
          },
        ];

        setDashboardData({
          stats,
          weeklyUserData,
          trendingPosts,
        });

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to load dashboard data. Please try again.');
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to handle retry
  const handleRetry = () => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      // Set sample data
      const stats = [
        {
          title: 'Total Users',
          value: '2,543',
          change: '12% increase',
          isPositive: true,
          color: '#3b82f6',
          icon: <Users size={16} />,
        },
        {
          title: 'New Posts',
          value: '45',
          change: '8% increase',
          isPositive: true,
          color: '#10b981',
          icon: <FileText size={16} />,
        },
        {
          title: 'Comments',
          value: '126',
          change: '5% decrease',
          isPositive: false,
          color: '#f59e0b',
          icon: <MessageSquare size={16} />,
        },
      ];

      const weeklyUserData = [
        { day: 'Mon', value: 18 },
        { day: 'Tue', value: 22 },
        { day: 'Wed', value: 30 },
        { day: 'Thu', value: 25 },
        { day: 'Fri', value: 28 },
        { day: 'Sat', value: 12 },
        { day: 'Sun', value: 9 },
      ];

      const trendingPosts = [
        {
          id: 1,
          title: 'The Future of AI in Web Development',
          author: 'John Doe',
          date: 'Apr 5, 2025',
          views: '1.2k',
          status: 'published',
        },
        {
          id: 2,
          title: 'React vs Vue: Which Should You Choose in 2025?',
          author: 'Jane Smith',
          date: 'Apr 3, 2025',
          views: '856',
          status: 'published',
        },
        {
          id: 3,
          title: 'Getting Started with TypeScript',
          author: 'Michael Johnson',
          date: 'Apr 2, 2025',
          views: '743',
          status: 'draft',
        },
        {
          id: 4,
          title: 'CSS Grid Layout: A Complete Guide',
          author: 'Sarah Williams',
          date: 'Mar 30, 2025',
          views: '621',
          status: 'published',
        },
        {
          id: 5,
          title: 'Introduction to Web3 Development',
          author: 'David Brown',
          date: 'Mar 28, 2025',
          views: '512',
          status: 'archived',
        },
      ];

      setDashboardData({
        stats,
        weeklyUserData,
        trendingPosts,
      });

      setLoading(false);
    }, 1000);
  };

  // If there's an error, display error state
  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <Alert $variant="error">
            <Alert.Icon>
              <AlertCircle size={24} />
            </Alert.Icon>
            <Alert.Content>
              <AlertTitle>Error Loading Dashboard</AlertTitle>
              <div>{error}</div>
              <RetryButton onClick={handleRetry}>
                <RefreshCw size={16} />
                Retry
              </RetryButton>
            </Alert.Content>
          </Alert>
        </ErrorContainer>
      </Container>
    );
  }

  // Destructure dashboard data
  const { stats, weeklyUserData, trendingPosts } = dashboardData;

  return (
    <Container style={{ position: 'relative', minHeight: '600px' }}>
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText>Loading dashboard data...</LoadingText>
        </LoadingOverlay>
      )}

      <DashboardGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatHeader>
              <StatTitle>{stat.title}</StatTitle>
              <StatIconWrapper bg={stat.color}>{stat.icon}</StatIconWrapper>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatChange className={stat.isPositive ? 'positive' : 'negative'}>
              {stat.isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />
              )}
              {stat.change}
            </StatChange>
          </StatCard>
        ))}
      </DashboardGrid>

      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Weekly New User Count</ChartTitle>
          <ChartActions>
            <ChartButton className="active">Weekly</ChartButton>
            <ChartButton>Monthly</ChartButton>
            <ChartButton>Yearly</ChartButton>
          </ChartActions>
        </ChartHeader>

        <BarChartContainer>
          {weeklyUserData.map((item, index) => (
            <BarChartBar
              key={index}
              heightPct={`${(item.value / 30) * 100}%`}
              data-value={item.value}
            />
          ))}
        </BarChartContainer>

        <BarChartLabels>
          {weeklyUserData.map((item, index) => (
            <BarChartLabel key={index}>{item.day}</BarChartLabel>
          ))}
        </BarChartLabels>
      </ChartContainer>

      <TwoColumnGrid>
        <TableContainer>
          <TableHeader>
            <TableTitle>Trending Posts</TableTitle>
          </TableHeader>
          <Table>
            <thead>
              <TableHeaderRow>
                <TableHeaderCell>Post</TableHeaderCell>
                <TableHeaderCell>Views</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </thead>
            <tbody>
              {trendingPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <PostTitle>{post.title}</PostTitle>
                    <PostMeta>
                      By {post.author} • {post.date}
                    </PostMeta>
                  </TableCell>
                  <TableCell>
                    <ViewsCount>{post.views}</ViewsCount>
                  </TableCell>
                  <TableCell>
                    <Badge className={post.status}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </TwoColumnGrid>
    </Container>
  );
};

export default Page_AdminDashboard;
