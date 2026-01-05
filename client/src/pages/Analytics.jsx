import { useQuery } from '@tanstack/react-query';
import { Box, Container, Flex, Heading, Text, Card, Grid, Separator } from '@radix-ui/themes';
import { EyeOpenIcon, HeartIcon, ChatBubbleIcon, FileTextIcon, BarChartIcon } from '@radix-ui/react-icons';
import { userService } from '../services/userService';
import { analyticsService } from '../services/analyticsService';
import { useAuthStore } from '../store/authStore';
import { Loading } from '../components/common/Loading';

export function Analytics() {
  const { user } = useAuthStore();

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts'],
    queryFn: userService.getUserPosts,
  });

  const { data: userAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['userAnalytics', user?.user_id],
    queryFn: () => analyticsService.getUserAnalytics(user?.user_id),
    enabled: !!user?.user_id,
    retry: false,
  });

  if (postsLoading) {
    return <Loading text="Loading analytics..." />;
  }

  const posts = userPosts || [];
  const totalPosts = posts.length;
  const publicPosts = posts.filter((p) => p.visibility === 'public').length;
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
  const totalComments = posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);
  const totalViews = userAnalytics?.totalViews || 0;

  const stats = [
    { label: 'Total Posts', value: totalPosts, icon: FileTextIcon, color: 'blue' },
    { label: 'Published', value: publicPosts, icon: EyeOpenIcon, color: 'green' },
    { label: 'Total Views', value: totalViews, icon: BarChartIcon, color: 'purple' },
    { label: 'Total Likes', value: totalLikes, icon: HeartIcon, color: 'red' },
    { label: 'Total Comments', value: totalComments, icon: ChatBubbleIcon, color: 'orange' },
  ];

  // Sort posts by engagement
  const sortedByLikes = [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  const sortedByComments = [...posts].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));

  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="6">
        <Box>
          <Heading size="7" mb="2">Analytics</Heading>
          <Text size="2" color="gray">Track your content performance</Text>
        </Box>

        {/* Stats Grid */}
        <Grid columns={{ initial: '2', sm: '3', md: '5' }} gap="4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <Flex direction="column" gap="2" p="4">
                  <Box
                    style={{
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-2)',
                      backgroundColor: `var(--${stat.color}-3)`,
                      width: 'fit-content',
                    }}
                  >
                    <Icon width="20" height="20" style={{ color: `var(--${stat.color}-9)` }} />
                  </Box>
                  <Text size="6" weight="bold">{stat.value}</Text>
                  <Text size="1" color="gray">{stat.label}</Text>
                </Flex>
              </Card>
            );
          })}
        </Grid>

        {/* Engagement Rate */}
        <Card>
          <Flex direction="column" p="5">
            <Heading size="4" mb="4">Engagement Overview</Heading>
            <Grid columns={{ initial: '1', sm: '3' }} gap="6">
              <Box>
                <Text size="2" color="gray" mb="2">Avg. Likes per Post</Text>
                <Text size="6" weight="bold">
                  {totalPosts > 0 ? (totalLikes / totalPosts).toFixed(1) : 0}
                </Text>
              </Box>
              <Box>
                <Text size="2" color="gray" mb="2">Avg. Comments per Post</Text>
                <Text size="6" weight="bold">
                  {totalPosts > 0 ? (totalComments / totalPosts).toFixed(1) : 0}
                </Text>
              </Box>
              <Box>
                <Text size="2" color="gray" mb="2">Engagement Rate</Text>
                <Text size="6" weight="bold">
                  {totalPosts > 0 ? (((totalLikes + totalComments) / totalPosts) * 10).toFixed(1) : 0}%
                </Text>
              </Box>
            </Grid>
          </Flex>
        </Card>

        <Grid columns={{ initial: '1', md: '2' }} gap="6">
          {/* Top Posts by Likes */}
          <Card>
            <Flex direction="column" p="4">
              <Heading size="4" mb="4">Top Posts by Likes</Heading>
              {sortedByLikes.length === 0 ? (
                <Text color="gray" size="2">No posts yet</Text>
              ) : (
                <Flex direction="column" gap="3">
                  {sortedByLikes.slice(0, 5).map((post, index) => (
                    <Flex key={post._id} justify="between" align="center">
                      <Flex align="center" gap="3">
                        <Text size="2" color="gray" style={{ width: '20px' }}>
                          #{index + 1}
                        </Text>
                        <Text size="2" className="text-truncate" style={{ maxWidth: '200px' }}>
                          {post.title}
                        </Text>
                      </Flex>
                      <Flex align="center" gap="1">
                        <HeartIcon width="14" height="14" color="var(--red-9)" />
                        <Text size="2" weight="bold">{post.likes?.length || 0}</Text>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Flex>
          </Card>

          {/* Top Posts by Comments */}
          <Card>
            <Flex direction="column" p="4">
              <Heading size="4" mb="4">Top Posts by Comments</Heading>
              {sortedByComments.length === 0 ? (
                <Text color="gray" size="2">No posts yet</Text>
              ) : (
                <Flex direction="column" gap="3">
                  {sortedByComments.slice(0, 5).map((post, index) => (
                    <Flex key={post._id} justify="between" align="center">
                      <Flex align="center" gap="3">
                        <Text size="2" color="gray" style={{ width: '20px' }}>
                          #{index + 1}
                        </Text>
                        <Text size="2" className="text-truncate" style={{ maxWidth: '200px' }}>
                          {post.title}
                        </Text>
                      </Flex>
                      <Flex align="center" gap="1">
                        <ChatBubbleIcon width="14" height="14" color="var(--orange-9)" />
                        <Text size="2" weight="bold">{post.comments?.length || 0}</Text>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Flex>
          </Card>
        </Grid>

        {/* All Posts Performance */}
        <Card>
          <Flex direction="column" p="4">
            <Heading size="4" mb="4">All Posts Performance</Heading>
            {posts.length === 0 ? (
              <Text color="gray" size="2">No posts to show</Text>
            ) : (
              <Flex direction="column" gap="3">
                {posts.map((post) => (
                  <Box key={post._id}>
                    <Flex justify="between" align="center" mb="2">
                      <Text size="2" weight="medium" className="text-truncate" style={{ maxWidth: '300px' }}>
                        {post.title}
                      </Text>
                      <Flex gap="4">
                        <Flex align="center" gap="1">
                          <HeartIcon width="12" height="12" />
                          <Text size="1">{post.likes?.length || 0}</Text>
                        </Flex>
                        <Flex align="center" gap="1">
                          <ChatBubbleIcon width="12" height="12" />
                          <Text size="1">{post.comments?.length || 0}</Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Box
                      style={{
                        height: '6px',
                        backgroundColor: 'var(--gray-4)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        style={{
                          height: '100%',
                          width: `${Math.min(((post.likes?.length || 0) + (post.comments?.length || 0)) / Math.max(totalLikes + totalComments, 1) * 100, 100)}%`,
                          backgroundColor: 'var(--blue-9)',
                          borderRadius: '3px',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Flex>
            )}
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
}
