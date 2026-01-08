import { useQuery } from '@tanstack/react-query';
import { Eye, Heart, MessageCircle, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import styled from 'styled-components';
import { userService } from '../services/userService';
import { analyticsService } from '../services/analyticsService';
import { useAuthStore } from '../store/authStore';
import { Loading } from '../components/common/Loading';

const PageWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  margin-bottom: 4px;
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const EngagementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const EngagementItem = styled.div``;

const EngagementLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 8px;
`;

const EngagementValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PostItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostRank = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  width: 24px;
`;

const PostTitle = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 ${({ theme }) => theme.spacing.md};
`;

const PostStat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const PerformanceItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const PerformanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PerformanceTitle = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
`;

const PerformanceStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PerformanceStat = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 12px;
    height: 12px;
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 3px;
  transition: width ${({ theme }) => theme.transitions.normal};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export function Analytics() {
  const { user } = useAuthStore();

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts'],
    queryFn: userService.getUserPosts,
  });

  const { data: userAnalytics } = useQuery({
    queryKey: ['userAnalytics', user?.user_id],
    queryFn: () => analyticsService.getUserAnalytics(user?.user_id),
    enabled: !!user?.user_id,
    retry: false,
  });

  if (postsLoading) return <Loading text="Loading analytics..." />;

  const posts = userPosts || [];
  const totalPosts = posts.length;
  const publicPosts = posts.filter((p) => p.visibility === 'public').length;
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
  const totalComments = posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);
  const totalViews = userAnalytics?.totalViews || 0;

  const stats = [
    { label: 'Total Posts', value: totalPosts, icon: FileText },
    { label: 'Published', value: publicPosts, icon: Eye },
    { label: 'Total Views', value: totalViews, icon: BarChart3 },
    { label: 'Total Likes', value: totalLikes, icon: Heart },
    { label: 'Comments', value: totalComments, icon: MessageCircle },
  ];

  const sortedByLikes = [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  const sortedByComments = [...posts].sort(
    (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
  );
  const maxEngagement = Math.max(
    ...posts.map((p) => (p.likes?.length || 0) + (p.comments?.length || 0)),
    1
  );

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Analytics</PageTitle>
        <PageSubtitle>Track your content performance</PageSubtitle>
      </PageHeader>

      <StatsGrid>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StatCard key={stat.label}>
              <StatIcon>
                <Icon />
              </StatIcon>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          );
        })}
      </StatsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <EngagementGrid>
            <EngagementItem>
              <EngagementLabel>Avg. Likes per Post</EngagementLabel>
              <EngagementValue>
                {totalPosts > 0 ? (totalLikes / totalPosts).toFixed(1) : '0'}
              </EngagementValue>
            </EngagementItem>
            <EngagementItem>
              <EngagementLabel>Avg. Comments per Post</EngagementLabel>
              <EngagementValue>
                {totalPosts > 0 ? (totalComments / totalPosts).toFixed(1) : '0'}
              </EngagementValue>
            </EngagementItem>
            <EngagementItem>
              <EngagementLabel>Engagement Rate</EngagementLabel>
              <EngagementValue>
                {totalPosts > 0
                  ? (((totalLikes + totalComments) / totalPosts) * 10).toFixed(1)
                  : '0'}
                %
              </EngagementValue>
            </EngagementItem>
          </EngagementGrid>
        </CardContent>
      </Card>

      <TwoColumnGrid>
        <Card>
          <CardHeader>
            <CardTitle>Top Posts by Likes</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedByLikes.length === 0 ? (
              <EmptyText>No posts yet</EmptyText>
            ) : (
              <PostList>
                {sortedByLikes.slice(0, 5).map((post, index) => (
                  <PostItem key={post._id}>
                    <PostRank>#{index + 1}</PostRank>
                    <PostTitle>{post.title}</PostTitle>
                    <PostStat>
                      <Heart />
                      {post.likes?.length || 0}
                    </PostStat>
                  </PostItem>
                ))}
              </PostList>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Posts by Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedByComments.length === 0 ? (
              <EmptyText>No posts yet</EmptyText>
            ) : (
              <PostList>
                {sortedByComments.slice(0, 5).map((post, index) => (
                  <PostItem key={post._id}>
                    <PostRank>#{index + 1}</PostRank>
                    <PostTitle>{post.title}</PostTitle>
                    <PostStat>
                      <MessageCircle />
                      {post.comments?.length || 0}
                    </PostStat>
                  </PostItem>
                ))}
              </PostList>
            )}
          </CardContent>
        </Card>
      </TwoColumnGrid>

      <Card>
        <CardHeader>
          <CardTitle>All Posts Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <EmptyText>No posts to show</EmptyText>
          ) : (
            posts.map((post) => {
              const engagement = (post.likes?.length || 0) + (post.comments?.length || 0);
              const percentage = (engagement / maxEngagement) * 100;
              return (
                <PerformanceItem key={post._id}>
                  <PerformanceHeader>
                    <PerformanceTitle>{post.title}</PerformanceTitle>
                    <PerformanceStats>
                      <PerformanceStat>
                        <Heart /> {post.likes?.length || 0}
                      </PerformanceStat>
                      <PerformanceStat>
                        <MessageCircle /> {post.comments?.length || 0}
                      </PerformanceStat>
                    </PerformanceStats>
                  </PerformanceHeader>
                  <ProgressBar>
                    <ProgressFill style={{ width: `${percentage}%` }} />
                  </ProgressBar>
                </PerformanceItem>
              );
            })
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
