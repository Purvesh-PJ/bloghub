import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  DashboardHeader,
  HeaderTitle,
  HeaderControls,
  DateRangeSelector,
  OverviewSection,
  OverviewGrid,
  StatCard,
  StatIcon,
  StatContent,
  StatValue,
  StatLabel,
  StatChange,
  ChartSection,
  ChartContainer,
  ChartHeader,
  ChartTitle,
  TabsContainer,
  Tab,
  FilterControls,
  FilterGroup,
  FilterLabel,
  DropdownFilter,
  PieChartLegend,
  LegendItem,
  LegendColor,
  LegendLabel,
} from './Page_UserAnalytics.styles';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  FaThumbsUp,
  FaFileAlt,
  FaChartLine,
  FaArrowUp,
  FaUsers,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from 'react-icons/fa';
import { Eye, FileText, Users, MessagesSquare } from 'lucide-react';
import { Table as ReusableTable } from '@/shared';

const Page_UserAnalytics = () => {
  const [dateRange, setDateRange] = useState('last30Days');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [sortField, setSortField] = useState('views');
  const [sortDirection, setSortDirection] = useState('desc');

  // Monthly views data
  const monthlyViewsData = [
    { name: 'Sep', views: 2400 },
    { name: 'Oct', views: 3600 },
    { name: 'Nov', views: 4200 },
    { name: 'Dec', views: 3800 },
    { name: 'Jan', views: 5100 },
    { name: 'Feb', views: 6200 },
  ];

  // Daily views data (last 30 days)
  const dailyViewsData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return {
      name: `${day} ${month}`,
      views: Math.floor(Math.random() * 500) + 100,
    };
  });

  // Category engagement data
  const categoryEngagementData = [
    { name: 'Technology', likes: 340, comments: 180, shares: 120 },
    { name: 'Business', likes: 280, comments: 150, shares: 90 },
    { name: 'Health', likes: 420, comments: 210, shares: 150 },
    { name: 'Lifestyle', likes: 380, comments: 190, shares: 110 },
    { name: 'Travel', likes: 310, comments: 160, shares: 100 },
  ];

  // Traffic sources data
  const trafficSourcesData = [
    { name: 'Search Engines', value: 45, color: '#4f46e5' },
    { name: 'Social Media', value: 30, color: '#10b981' },
    { name: 'Direct Traffic', value: 15, color: '#f59e0b' },
    { name: 'Referrals', value: 10, color: '#ef4444' },
  ];

  // Top performing posts data
  const topPosts = [
    {
      id: 1,
      title: 'Getting Started with React Hooks',
      image: 'https://via.placeholder.com/100',
      author: 'Jane Cooper',
      category: 'Technology',
      date: 'Feb 15, 2023',
      views: 8450,
      likes: 385,
      comments: 132,
      shares: 78,
    },
    {
      id: 2,
      title: 'How to Build a REST API with Node.js',
      image: 'https://via.placeholder.com/100',
      author: 'Michael Johnson',
      category: 'Programming',
      date: 'Jan 28, 2023',
      views: 7230,
      likes: 293,
      comments: 108,
      shares: 64,
    },
    {
      id: 3,
      title: 'CSS Grid vs Flexbox: When to Use Each',
      image: 'https://via.placeholder.com/100',
      author: 'Sarah Wilson',
      category: 'Web Design',
      date: 'Jan 12, 2023',
      views: 6540,
      likes: 257,
      comments: 94,
      shares: 52,
    },
    {
      id: 4,
      title: 'Introduction to TypeScript for JavaScript Developers',
      image: 'https://via.placeholder.com/100',
      author: 'Jane Cooper',
      category: 'Programming',
      date: 'Dec 18, 2022',
      views: 5970,
      likes: 219,
      comments: 84,
      shares: 48,
    },
    {
      id: 5,
      title: '10 SEO Tips to Boost Your Blog Traffic',
      image: 'https://via.placeholder.com/100',
      author: 'Robert Brown',
      category: 'Marketing',
      date: 'Feb 2, 2023',
      views: 5840,
      likes: 232,
      comments: 93,
      shares: 61,
    },
    {
      id: 6,
      title: 'The Future of AI in Web Development',
      image: 'https://via.placeholder.com/100',
      author: 'Michael Johnson',
      category: 'Technology',
      date: 'Jan 5, 2023',
      views: 5620,
      likes: 218,
      comments: 76,
      shares: 45,
    },
    {
      id: 7,
      title: 'Mobile-First Design Principles',
      image: 'https://via.placeholder.com/100',
      author: 'Sarah Wilson',
      category: 'Web Design',
      date: 'Dec 29, 2022',
      views: 5130,
      likes: 186,
      comments: 67,
      shares: 39,
    },
    {
      id: 8,
      title: 'Building a Portfolio Website from Scratch',
      image: 'https://via.placeholder.com/100',
      author: 'Jane Cooper',
      category: 'Web Design',
      date: 'Feb 8, 2023',
      views: 4950,
      likes: 178,
      comments: 65,
      shares: 42,
    },
    {
      id: 9,
      title: 'Understanding Progressive Web Apps',
      image: 'https://via.placeholder.com/100',
      author: 'Robert Brown',
      category: 'Technology',
      date: 'Jan 19, 2023',
      views: 4780,
      likes: 166,
      comments: 58,
      shares: 36,
    },
    {
      id: 10,
      title: 'JavaScript ES2022: New Features Explained',
      image: 'https://via.placeholder.com/100',
      author: 'Michael Johnson',
      category: 'Programming',
      date: 'Feb 12, 2023',
      views: 4620,
      likes: 154,
      comments: 52,
      shares: 34,
    },
  ];

  // Author performance data
  const authorPerformance = [
    {
      id: 1,
      name: 'Jane Cooper',
      avatar: 'https://via.placeholder.com/40',
      posts: 24,
      views: 105600,
      engagement: 4850,
    },
    {
      id: 2,
      name: 'Michael Johnson',
      avatar: 'https://via.placeholder.com/40',
      posts: 18,
      views: 87300,
      engagement: 4120,
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      avatar: 'https://via.placeholder.com/40',
      posts: 15,
      views: 73500,
      engagement: 3650,
    },
    {
      id: 4,
      name: 'Robert Brown',
      avatar: 'https://via.placeholder.com/40',
      posts: 12,
      views: 59400,
      engagement: 2980,
    },
  ];

  // Subscriber growth data
  const subscriberGrowthData = [
    { month: 'Sep', subscribers: 1250 },
    { month: 'Oct', subscribers: 1580 },
    { month: 'Nov', subscribers: 2120 },
    { month: 'Dec', subscribers: 2540 },
    { month: 'Jan', subscribers: 3250 },
    { month: 'Feb', subscribers: 4100 },
  ];

  const categories = ['All', 'Technology', 'Programming', 'Web Design', 'Marketing', 'Business'];
  const authors = ['All', 'Jane Cooper', 'Michael Johnson', 'Sarah Wilson', 'Robert Brown'];

  // In a real app, you would fetch data here
  useEffect(() => {
    // Simulating loading state
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [dateRange, categoryFilter, authorFilter]);

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleAuthorFilterChange = (e) => {
    setAuthorFilter(e.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />;
    }
    return null;
  };

  const filteredPosts = topPosts
    .filter(
      (post) =>
        categoryFilter === 'all' || post.category.toLowerCase() === categoryFilter.toLowerCase(),
    )
    .filter((post) => authorFilter === 'all' || post.author === authorFilter)
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

  // Define table columns for the ReusableTable - Posts
  const postsColumns = useMemo(
    () => [
      {
        Header: 'Post Title',
        accessor: 'title',
        Cell: ({ value }) => <strong>{value}</strong>,
        width: '40%',
      },
      {
        Header: 'Author',
        accessor: 'author',
        width: '15%',
      },
      {
        Header: 'Category',
        accessor: 'category',
        width: '15%',
      },
      {
        Header: 'Views',
        accessor: 'views',
        Cell: ({ value }) => value.toLocaleString(),
        width: '10%',
      },
      {
        Header: 'Likes',
        accessor: 'likes',
        Cell: ({ value }) => value.toLocaleString(),
        width: '10%',
      },
      {
        Header: 'Comments',
        accessor: 'comments',
        Cell: ({ value }) => value.toLocaleString(),
        width: '10%',
      },
    ],
    [],
  );

  // Define table columns for the ReusableTable - Authors
  const authorsColumns = useMemo(
    () => [
      {
        Header: 'Author',
        accessor: 'name',
        Cell: ({ row }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={row.original.avatar}
              alt={row.original.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <strong>{row.original.name}</strong>
          </div>
        ),
        width: '30%',
      },
      {
        Header: 'Posts',
        accessor: 'posts',
        width: '15%',
      },
      {
        Header: 'Total Views',
        accessor: 'views',
        Cell: ({ value }) => value.toLocaleString(),
        width: '25%',
      },
      {
        Header: 'Engagement',
        accessor: 'engagement',
        Cell: ({ value }) => value.toLocaleString(),
        width: '30%',
      },
    ],
    [],
  );

  return (
    <Container>
      <DashboardHeader>
        <HeaderTitle>Analytics Dashboard</HeaderTitle>
        <HeaderControls>
          <DateRangeSelector value={dateRange} onChange={handleDateRangeChange}>
            <option value="last7Days">Last 7 Days</option>
            <option value="last30Days">Last 30 Days</option>
            <option value="last90Days">Last 90 Days</option>
            <option value="lastYear">Last Year</option>
          </DateRangeSelector>
        </HeaderControls>
      </DashboardHeader>

      <TabsContainer>
        <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          Overview
        </Tab>
        <Tab active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>
          Posts
        </Tab>
        <Tab active={activeTab === 'authors'} onClick={() => setActiveTab('authors')}>
          Authors
        </Tab>
        <Tab active={activeTab === 'subscribers'} onClick={() => setActiveTab('subscribers')}>
          Subscribers
        </Tab>
      </TabsContainer>

      {activeTab === 'overview' && (
        <>
          <OverviewSection>
            <OverviewGrid>
              <StatCard>
                <StatIcon color="#4f46e5">
                  <Eye size={20} strokeWidth={2} />
                </StatIcon>
                <StatContent>
                  <StatValue>86.4K</StatValue>
                  <StatLabel>Total Views</StatLabel>
                  <StatChange positive>
                    <FaArrowUp /> 12.5%
                  </StatChange>
                </StatContent>
              </StatCard>

              <StatCard>
                <StatIcon color="#ef4444">
                  <FileText size={20} strokeWidth={2} />
                </StatIcon>
                <StatContent>
                  <StatValue>69</StatValue>
                  <StatLabel>Total Posts</StatLabel>
                  <StatChange positive>
                    <FaArrowUp /> 8.2%
                  </StatChange>
                </StatContent>
              </StatCard>

              <StatCard>
                <StatIcon color="#f59e0b">
                  <Users size={20} strokeWidth={2} />
                </StatIcon>
                <StatContent>
                  <StatValue>4.1K</StatValue>
                  <StatLabel>Subscribers</StatLabel>
                  <StatChange positive>
                    <FaArrowUp /> 26.3%
                  </StatChange>
                </StatContent>
              </StatCard>

              <StatCard>
                <StatIcon color="#ef4444">
                  <MessagesSquare size={20} strokeWidth={2} />
                </StatIcon>
                <StatContent>
                  <StatValue>3.2K</StatValue>
                  <StatLabel>Comments</StatLabel>
                  <StatChange positive>
                    <FaArrowUp /> 18.7%
                  </StatChange>
                </StatContent>
              </StatCard>
            </OverviewGrid>
          </OverviewSection>

          <ChartSection>
            <ChartContainer>
              <ChartHeader>
                <ChartTitle>
                  <FaChartLine /> Blog Views
                </ChartTitle>
              </ChartHeader>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyViewsData}>
                  <Line
                    type="monotone"
                    dataKey="name"
                    stroke="black"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#555', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#6b7280"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer>
              <ChartHeader>
                <ChartTitle>
                  <FaUsers /> Traffic Sources
                </ChartTitle>
              </ChartHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSourcesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {trafficSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <PieChartLegend>
                  {trafficSourcesData.map((item, index) => (
                    <LegendItem key={index}>
                      <LegendColor color={item.color} />
                      <LegendLabel>
                        {item.name} ({item.value}%)
                      </LegendLabel>
                    </LegendItem>
                  ))}
                </PieChartLegend>
              </div>
            </ChartContainer>
          </ChartSection>

          <ChartSection>
            <ChartContainer>
              <ChartHeader>
                <ChartTitle>
                  <FaThumbsUp /> Category Engagement
                </ChartTitle>
              </ChartHeader>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#555', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="likes"
                    name="Likes"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="comments"
                    name="Comments"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="shares"
                    name="Shares"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer>
              <ChartHeader>
                <ChartTitle>
                  <FaUsers /> Subscriber Growth
                </ChartTitle>
              </ChartHeader>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={subscriberGrowthData}>
                  <defs>
                    <linearGradient id="subscriberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#subscriberGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartSection>
        </>
      )}

      {activeTab === 'posts' && (
        <>
          <FilterControls>
            <FilterGroup>
              <FilterLabel>
                <FaFilter /> Filter by:
              </FilterLabel>
              <DropdownFilter value={categoryFilter} onChange={handleCategoryFilterChange}>
                {categories.map((category, index) => (
                  <option key={index} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </DropdownFilter>
              <DropdownFilter value={authorFilter} onChange={handleAuthorFilterChange}>
                {authors.map((author, index) => (
                  <option key={index} value={author === 'All' ? 'all' : author}>
                    {author}
                  </option>
                ))}
              </DropdownFilter>
            </FilterGroup>
          </FilterControls>

          <ChartContainer>
            <ChartHeader>
              <ChartTitle>
                <FaFileAlt /> Top Performing Posts
              </ChartTitle>
            </ChartHeader>
            <ReusableTable data={filteredPosts} columns={postsColumns} />
          </ChartContainer>
        </>
      )}

      {activeTab === 'authors' && (
        <>
          <ChartContainer>
            <ChartHeader>
              <ChartTitle>
                <FaUsers /> Author Performance
              </ChartTitle>
            </ChartHeader>
            <ReusableTable data={authorPerformance} columns={authorsColumns} />
          </ChartContainer>
        </>
      )}

      {activeTab === 'subscribers' && (
        <ChartContainer>
          <ChartHeader>
            <ChartTitle>
              <FaUsers /> Subscriber Growth (6 Months)
            </ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={subscriberGrowthData}>
              <defs>
                <linearGradient id="subscriberGradientLarge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="subscribers"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#subscriberGradientLarge)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </Container>
  );
};

export default Page_UserAnalytics;
