import React, { useState, useEffect } from 'react';
import { Container } from './Page_AdminDashboard-Style';
import { 
    Users, 
    MessageSquare, 
    ThumbsUp, 
    TrendingUp, 
    FileText, 
    UserPlus,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import styled from 'styled-components';

// Styled components for the dashboard
const DashboardGrid = styled.div`
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

const StatCard = styled.div`
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
`;

const StatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const StatTitle = styled.h3`
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    margin: 0;
`;

const StatIconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    color: white;
`;

const StatValue = styled.div`
    font-size: 1.875rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
`;

const StatChange = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    
    &.positive {
        color: #10b981;
    }
    
    &.negative {
        color: #ef4444;
    }
`;

const ChartContainer = styled.div`
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
`;

const ChartHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
`;

const ChartActions = styled.div`
    display: flex;
    gap: 0.75rem;
`;

const ChartButton = styled.button`
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.375rem;
    background-color: white;
    color: #6b7280;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f9fafb;
    }
    
    &.active {
        background-color: #2563eb;
        color: white;
        border-color: #2563eb;
    }
`;

const TwoColumnGrid = styled.div`
    // display: grid;
    // grid-template-columns: 2fr 1fr;
    // gap: 1.5rem;
    
    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
`;

const TableContainer = styled.div`
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const TableHeader = styled.div`
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TableTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableHeaderRow = styled.tr`
    border-bottom: 1px solid #e5e7eb;
`;

const TableHeaderCell = styled.th`
    text-align: left;
    padding: 0.75rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #e5e7eb;
    
    &:last-child {
        border-bottom: none;
    }
`;

const TableCell = styled.td`
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
    color: #374151;
`;

const PostTitle = styled.div`
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 0.25rem;
`;

const PostMeta = styled.div`
    font-size: 0.75rem;
    color: #6b7280;
`;

const ViewsCount = styled.div`
    font-weight: 500;
`;

const Badge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
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
`;

const BarChartContainer = styled.div`
    display: flex;
    align-items: flex-end;
    height: 200px;
    gap: 0.5rem;
    padding: 0 1rem;
`;

const BarChartBar = styled.div`
    flex: 1;
    background-color: #3b82f6;
    border-radius: 0.25rem 0.25rem 0 0;
    position: relative;
    min-width: 2rem;
    
    &:hover {
        background-color: #2563eb;
    }
    
    &::after {
        content: attr(data-value);
        position: absolute;
        top: -1.5rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.75rem;
        font-weight: 500;
        color: #6b7280;
    }
`;

const BarChartLabels = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    padding: 0 1rem;
`;

const BarChartLabel = styled.div`
    font-size: 0.75rem;
    color: #6b7280;
    text-align: center;
    flex: 1;
    min-width: 2rem;
`;

// Styled components for state management
const LoadingOverlay = styled.div`
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
    border-radius: 0.5rem;
`;

const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid #f3f4f6;
    border-radius: 50%;
    border-top-color: #3b82f6;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const LoadingText = styled.p`
    font-size: 0.875rem;
    color: #4b5563;
    font-weight: 500;
`;

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    background-color: #fef2f2;
    border-radius: 0.5rem;
    border: 1px solid #fee2e2;
    width: 100%;
    min-height: 300px;
`;

const ErrorIcon = styled.div`
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

const ErrorTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: #dc2626;
    margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.p`
    font-size: 0.875rem;
    color: #ef4444;
    margin-bottom: 1.5rem;
`;

const RetryButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: white;
    color: #dc2626;
    border: 1px solid #dc2626;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #fee2e2;
    }
`;

const Page_AdminDashboard = () => {
    // Add state management
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        stats: [],
        weeklyUserData: [],
        trendingPosts: []
    });
    
    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // In a real app, you would fetch this data from your API
                // For now, we'll use sample data
                const stats = [
                    {
                        title: 'Total Users',
                        value: '2,543',
                        change: '12% increase',
                        isPositive: true,
                        color: '#3b82f6',
                        icon: <Users size={16} />
                    },
                    {
                        title: 'New Posts',
                        value: '45',
                        change: '8% increase',
                        isPositive: true,
                        color: '#10b981',
                        icon: <FileText size={16} />
                    },
                    {
                        title: 'Comments',
                        value: '126',
                        change: '5% decrease',
                        isPositive: false,
                        color: '#f59e0b',
                        icon: <MessageSquare size={16} />
                    }
                ];
                
                const weeklyUserData = [
                    { day: 'Mon', value: 18 },
                    { day: 'Tue', value: 22 },
                    { day: 'Wed', value: 30 },
                    { day: 'Thu', value: 25 },
                    { day: 'Fri', value: 28 },
                    { day: 'Sat', value: 12 },
                    { day: 'Sun', value: 9 }
                ];
                
                const trendingPosts = [
                    {
                        id: 1,
                        title: 'The Future of AI in Web Development',
                        author: 'John Doe',
                        date: 'Apr 5, 2025',
                        views: '1.2k',
                        status: 'published'
                    },
                    {
                        id: 2,
                        title: 'React vs Vue: Which Should You Choose in 2025?',
                        author: 'Jane Smith',
                        date: 'Apr 3, 2025',
                        views: '856',
                        status: 'published'
                    },
                    {
                        id: 3,
                        title: 'Getting Started with TypeScript',
                        author: 'Michael Johnson',
                        date: 'Apr 2, 2025',
                        views: '743',
                        status: 'draft'
                    },
                    {
                        id: 4,
                        title: 'CSS Grid Layout: A Complete Guide',
                        author: 'Sarah Williams',
                        date: 'Mar 30, 2025',
                        views: '621',
                        status: 'published'
                    },
                    {
                        id: 5,
                        title: 'Introduction to Web3 Development',
                        author: 'David Brown',
                        date: 'Mar 28, 2025',
                        views: '512',
                        status: 'archived'
                    }
                ];
                
                setDashboardData({
                    stats,
                    weeklyUserData,
                    trendingPosts
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
                    icon: <Users size={16} />
                },
                {
                    title: 'New Posts',
                    value: '45',
                    change: '8% increase',
                    isPositive: true,
                    color: '#10b981',
                    icon: <FileText size={16} />
                },
                {
                    title: 'Comments',
                    value: '126',
                    change: '5% decrease',
                    isPositive: false,
                    color: '#f59e0b',
                    icon: <MessageSquare size={16} />
                }
            ];
            
            const weeklyUserData = [
                { day: 'Mon', value: 18 },
                { day: 'Tue', value: 22 },
                { day: 'Wed', value: 30 },
                { day: 'Thu', value: 25 },
                { day: 'Fri', value: 28 },
                { day: 'Sat', value: 12 },
                { day: 'Sun', value: 9 }
            ];
            
            const trendingPosts = [
                {
                    id: 1,
                    title: 'The Future of AI in Web Development',
                    author: 'John Doe',
                    date: 'Apr 5, 2025',
                    views: '1.2k',
                    status: 'published'
                },
                {
                    id: 2,
                    title: 'React vs Vue: Which Should You Choose in 2025?',
                    author: 'Jane Smith',
                    date: 'Apr 3, 2025',
                    views: '856',
                    status: 'published'
                },
                {
                    id: 3,
                    title: 'Getting Started with TypeScript',
                    author: 'Michael Johnson',
                    date: 'Apr 2, 2025',
                    views: '743',
                    status: 'draft'
                },
                {
                    id: 4,
                    title: 'CSS Grid Layout: A Complete Guide',
                    author: 'Sarah Williams',
                    date: 'Mar 30, 2025',
                    views: '621',
                    status: 'published'
                },
                {
                    id: 5,
                    title: 'Introduction to Web3 Development',
                    author: 'David Brown',
                    date: 'Mar 28, 2025',
                    views: '512',
                    status: 'archived'
                }
            ];
            
            setDashboardData({
                stats,
                weeklyUserData,
                trendingPosts
            });
            
            setLoading(false);
        }, 1000);
    };
    
    // If there's an error, display error state
    if (error) {
        return (
            <Container>
                <ErrorContainer>
                    <ErrorIcon>
                        <AlertCircle size={24} />
                    </ErrorIcon>
                    <ErrorTitle>Error Loading Dashboard</ErrorTitle>
                    <ErrorMessage>{error}</ErrorMessage>
                    <RetryButton onClick={handleRetry}>
                        <RefreshCw size={16} />
                        Retry
                    </RetryButton>
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
                            <StatIconWrapper style={{ backgroundColor: stat.color }}>
                                {stat.icon}
                            </StatIconWrapper>
                        </StatHeader>
                        <StatValue>{stat.value}</StatValue>
                        <StatChange className={stat.isPositive ? 'positive' : 'negative'}>
                            {stat.isPositive ? <TrendingUp size={16} /> : <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />}
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
                            style={{ height: `${(item.value / 30) * 100}%` }}
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
                            {trendingPosts.map(post => (
                                <TableRow key={post.id}>
                                    <TableCell>
                                        <PostTitle>{post.title}</PostTitle>
                                        <PostMeta>By {post.author} • {post.date}</PostMeta>
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