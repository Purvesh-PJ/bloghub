import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  PageHeader,
  Title,
  HeaderActions,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterContainer,
  FilterSelect,
  DateRangeContainer,
  DateInput,
  CardContainer,
  ActivityList,
  ActivityItem,
  ActivityIcon,
  ActivityContent,
  ActivityHeader,
  ActivityUser,
  ActivityTime,
  ActivityDescription,
  ActivityMeta,
  ActivityMetaItem,
  Pagination,
  PaginationInfo,
  PaginationButtons,
  PaginationButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  Button,
} from './Page_AdminUserActivity.styles';

import {
  Search,
  LogIn,
  FileText,
  MessageSquare,
  ThumbsUp,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Monitor,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Activity,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Alert, Skeleton, Stack } from '../../../../components/ui/primitives';
import { BiErrorCircle } from 'react-icons/bi';

// Custom hook for state management
const useStateManagement = (options = {}) => {
  const { initialLoading = false, initialError = null } = options;
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);

  // Execute a function with loading state
  const executeWithLoading = async (fn, options = {}) => {
    const { errorMessage = 'An error occurred. Please try again.' } = options;

    try {
      setLoading(true);
      setError(null);
      return await fn();
    } catch (err) {
      console.error('Error in executeWithLoading:', err);
      setError(err.message || errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Retry function
  const handleRetry = async (fn) => {
    if (typeof fn === 'function') {
      await fn();
    } else {
      setLoading(false);
      setError(null);
    }
  };

  return {
    loading,
    setLoading,
    error,
    setError,
    executeWithLoading,
    handleRetry,
  };
};

// Styled components for state management
// StateWrapper component
const StateWrapper = ({
  loading,
  error,
  onRetry,
  loadingText = 'Loading...',
  errorTitle = 'Error',
  children,
  minHeight = '200px',
  style = {},
}) => {
  if (error) {
    return (
      <div style={{ minHeight, ...style }}>
        <Alert $variant="error">
          <Alert.Icon>
            <BiErrorCircle size={24} />
          </Alert.Icon>
          <Alert.Content>
            <strong>{errorTitle}</strong>
            <div>{error}</div>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <RefreshCw size={16} />
                Retry
              </button>
            )}
          </Alert.Content>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight, ...style }}>
        <Stack $gap={4}>
          <Skeleton.Text $lines={2} />
          <Skeleton.Card style={{ height: '100px' }} />
          <Skeleton.Card style={{ height: '100px' }} />
          <Skeleton.Card style={{ height: '100px' }} />
        </Stack>
      </div>
    );
  }

  return <div style={{ minHeight, ...style }}>{children}</div>;
};

const Page_AdminUserActivity = () => {
  // Use our custom state management hook
  const { loading, error, executeWithLoading, handleRetry } = useStateManagement({
    initialLoading: true,
  });

  const [activityType, setActivityType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userActivities, setUserActivities] = useState([]);

  // Fetch user activities from the API
  const fetchUserActivities = useCallback(async () => {
    await executeWithLoading(async () => {
      try {
        // Get user data from localStorage for authentication
        const userData = localStorage.getItem('userData');

        if (!userData) {
          throw new Error('No user data found. Please log in again.');
        }

        // In a real app, you would use the parsed user data for authentication
        // const parsedUserData = JSON.parse(userData);
        // const token = parsedUserData.token;

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (activityType !== 'all') {
          queryParams.append('type', activityType);
        }
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        if (startDate) {
          queryParams.append('startDate', startDate);
        }
        if (endDate) {
          queryParams.append('endDate', endDate);
        }
        queryParams.append('page', currentPage);

        // In a real app, you would fetch from your API with authentication
        // const response = await fetch(`/api/admin/user-activities?${queryParams.toString()}`, {
        //     headers: {
        //         'Authorization': `Bearer ${parsedUserData.token}`
        //     }
        // });

        // if (!response.ok) {
        //     throw new Error(`Failed to fetch activities: ${response.status} ${response.statusText}`);
        // }

        // const data = await response.json();
        // setUserActivities(data);

        // For now, we'll simulate an API delay and return sample data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Sample data for user activities
        const activities = [
          {
            id: 1,
            user: 'John Doe',
            userId: 101,
            action: 'login',
            description: 'Logged in to the platform',
            time: '10 minutes ago',
            timestamp: '2025-04-06T00:35:00',
            ip: '192.168.1.1',
            device: 'Chrome on Windows',
            location: 'New York, USA',
          },
          {
            id: 2,
            user: 'Jane Smith',
            userId: 102,
            action: 'post',
            description: 'Published a new blog post "The Future of Web Development"',
            time: '25 minutes ago',
            timestamp: '2025-04-06T00:20:00',
            ip: '192.168.1.2',
            device: 'Firefox on macOS',
            location: 'San Francisco, USA',
            postId: 201,
          },
          {
            id: 3,
            user: 'Michael Johnson',
            userId: 103,
            action: 'comment',
            description: 'Commented on "The Future of Web Development"',
            time: '45 minutes ago',
            timestamp: '2025-04-06T00:00:00',
            ip: '192.168.1.3',
            device: 'Safari on iOS',
            location: 'London, UK',
            postId: 201,
            commentId: 301,
          },
          {
            id: 4,
            user: 'Sarah Williams',
            userId: 104,
            action: 'like',
            description: 'Liked "The Future of Web Development"',
            time: '1 hour ago',
            timestamp: '2025-04-05T23:45:00',
            ip: '192.168.1.4',
            device: 'Chrome on Android',
            location: 'Sydney, Australia',
            postId: 201,
          },
          {
            id: 5,
            user: 'David Brown',
            userId: 105,
            action: 'update',
            description: 'Updated profile information',
            time: '2 hours ago',
            timestamp: '2025-04-05T22:45:00',
            ip: '192.168.1.5',
            device: 'Edge on Windows',
            location: 'Toronto, Canada',
          },
          {
            id: 6,
            user: 'Emily Davis',
            userId: 106,
            action: 'delete',
            description: 'Deleted a comment on "Introduction to React Hooks"',
            time: '3 hours ago',
            timestamp: '2025-04-05T21:45:00',
            ip: '192.168.1.6',
            device: 'Firefox on Linux',
            location: 'Berlin, Germany',
            postId: 202,
            commentId: 302,
          },
          {
            id: 7,
            user: 'Robert Wilson',
            userId: 107,
            action: 'login',
            description: 'Failed login attempt (incorrect password)',
            time: '4 hours ago',
            timestamp: '2025-04-05T20:45:00',
            ip: '192.168.1.7',
            device: 'Chrome on Windows',
            location: 'Paris, France',
          },
          {
            id: 8,
            user: 'Amanda Taylor',
            userId: 108,
            action: 'post',
            description: 'Published a new blog post "CSS Grid vs Flexbox"',
            time: '5 hours ago',
            timestamp: '2025-04-05T19:45:00',
            ip: '192.168.1.8',
            device: 'Safari on macOS',
            location: 'Tokyo, Japan',
            postId: 203,
          },
          {
            id: 9,
            user: 'Daniel Miller',
            userId: 109,
            action: 'comment',
            description: 'Commented on "CSS Grid vs Flexbox"',
            time: '6 hours ago',
            timestamp: '2025-04-05T18:45:00',
            ip: '192.168.1.9',
            device: 'Firefox on Windows',
            location: 'Madrid, Spain',
            postId: 203,
            commentId: 303,
          },
          {
            id: 10,
            user: 'Olivia Anderson',
            userId: 110,
            action: 'like',
            description: 'Liked "CSS Grid vs Flexbox"',
            time: '7 hours ago',
            timestamp: '2025-04-05T17:45:00',
            ip: '192.168.1.10',
            device: 'Chrome on macOS',
            location: 'Rome, Italy',
            postId: 203,
          },
        ];

        // Filter activities based on the current filters
        let filteredActivities = activities;

        if (activityType !== 'all') {
          filteredActivities = filteredActivities.filter(
            (activity) => activity.action === activityType,
          );
        }

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredActivities = filteredActivities.filter(
            (activity) =>
              activity.user.toLowerCase().includes(term) ||
              activity.description.toLowerCase().includes(term),
          );
        }

        if (startDate) {
          const start = new Date(startDate);
          filteredActivities = filteredActivities.filter(
            (activity) => new Date(activity.timestamp) >= start,
          );
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // Set to end of day
          filteredActivities = filteredActivities.filter(
            (activity) => new Date(activity.timestamp) <= end,
          );
        }

        setUserActivities(filteredActivities);
        return filteredActivities;
      } catch (err) {
        console.error('Error fetching user activities:', err);
        throw new Error('Failed to load user activities. Please try again.');
      }
    });
  }, [activityType, searchTerm, startDate, endDate, currentPage, executeWithLoading]);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    fetchUserActivities();
  }, [fetchUserActivities]);

  // Filter activities based on type and search term
  const getFilteredActivities = () => {
    return userActivities;
  };

  const filteredActivities = getFilteredActivities();

  // Handle activity type filter change
  const handleActivityTypeChange = (e) => {
    setActivityType(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle date range changes
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setCurrentPage(1); // Reset to first page when date changes
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setCurrentPage(1); // Reset to first page when date changes
  };

  // Get activity icon based on action type
  const getActivityIcon = (action) => {
    switch (action) {
      case 'login':
        return <LogIn size={16} />;
      case 'post':
        return <FileText size={16} />;
      case 'comment':
        return <MessageSquare size={16} />;
      case 'like':
        return <ThumbsUp size={16} />;
      case 'update':
        return <Edit size={16} />;
      case 'delete':
        return <Trash2 size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  // Handle export to CSV
  const handleExport = () => {
    // In a real app, you would generate a CSV file with the filtered activities
    alert('Exporting user activities to CSV...');
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Container>
        <PageHeader>
          <Title>User Activity Log</Title>
          <HeaderActions>
            <Button onClick={handleExport} disabled={loading || error}>
              <Download size={16} />
              Export to CSV
            </Button>
          </HeaderActions>
        </PageHeader>

        <FilterContainer>
          <SearchContainer>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search by user or activity..."
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={loading}
            />
          </SearchContainer>

          <FilterSelect value={activityType} onChange={handleActivityTypeChange} disabled={loading}>
            <option value="all">All Activities</option>
            <option value="login">Logins</option>
            <option value="post">Posts</option>
            <option value="comment">Comments</option>
            <option value="like">Likes</option>
            <option value="update">Updates</option>
            <option value="delete">Deletions</option>
          </FilterSelect>

          <DateRangeContainer>
            <DateInput
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              disabled={loading}
            />
            <DateInput
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              disabled={loading}
            />
          </DateRangeContainer>
        </FilterContainer>

        <CardContainer style={{ position: 'relative', minHeight: '400px' }}>
          <StateWrapper
            loading={loading}
            error={error}
            onRetry={() => handleRetry(fetchUserActivities)}
            loadingText="Loading user activities..."
            errorTitle="Error Loading Activities"
            minHeight="400px"
          >
            <ActivityList>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <ActivityItem key={activity.id}>
                    <ActivityIcon className={activity.action}>
                      {getActivityIcon(activity.action)}
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityHeader>
                        <ActivityUser>{activity.user}</ActivityUser>
                        <ActivityTime>{activity.time}</ActivityTime>
                      </ActivityHeader>
                      <ActivityDescription>{activity.description}</ActivityDescription>
                      <ActivityMeta>
                        <ActivityMetaItem>
                          <Clock size={14} />
                          {activity.timestamp}
                        </ActivityMetaItem>
                        <ActivityMetaItem>
                          <MapPin size={14} />
                          {activity.location}
                        </ActivityMetaItem>
                        <ActivityMetaItem>
                          <Monitor size={14} />
                          {activity.device}
                        </ActivityMetaItem>
                      </ActivityMeta>
                    </ActivityContent>
                  </ActivityItem>
                ))
              ) : (
                <EmptyState>
                  <EmptyStateIcon>
                    <Activity size={24} />
                  </EmptyStateIcon>
                  <EmptyStateTitle>No activities found</EmptyStateTitle>
                  <EmptyStateText>
                    There are no user activities matching your filter criteria.
                  </EmptyStateText>
                </EmptyState>
              )}
            </ActivityList>

            {filteredActivities.length > 0 && (
              <Pagination>
                <PaginationInfo>Showing {filteredActivities.length} activities</PaginationInfo>
                <PaginationButtons>
                  <PaginationButton
                    disabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(1)}
                  >
                    <ChevronsLeft size={16} />
                  </PaginationButton>
                  <PaginationButton
                    disabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft size={16} />
                  </PaginationButton>
                  <PaginationButton className="active">{currentPage}</PaginationButton>
                  <PaginationButton
                    disabled={true || loading}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight size={16} />
                  </PaginationButton>
                  <PaginationButton
                    disabled={true || loading}
                    onClick={() => handlePageChange(10)} // Assuming 10 is the last page
                  >
                    <ChevronsRight size={16} />
                  </PaginationButton>
                </PaginationButtons>
              </Pagination>
            )}
          </StateWrapper>
        </CardContainer>
      </Container>
    </div>
  );
};

export default Page_AdminUserActivity;
