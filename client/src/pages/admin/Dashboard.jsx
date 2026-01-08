import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Box, Flex, Heading, Text, Card, Grid, Badge, Button } from '@radix-ui/themes';
import { FileText, Users, Eye, Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { postService } from '../../services/postService';
import { analyticsService } from '../../services/analyticsService';
import { Loading } from '../../components/common/Loading';

export function AdminDashboard() {
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['allPosts'],
    queryFn: postService.getPosts,
  });

  const { data: adminAnalytics } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: analyticsService.getAdminAnalytics,
    retry: false,
  });

  if (postsLoading) return <Loading text="Loading..." />;

  const totalPosts = posts?.length || 0;
  const publicPosts = posts?.filter((p) => p.visibility === 'public').length || 0;
  const draftPosts = posts?.filter((p) => p.visibility === 'draft').length || 0;
  const totalLikes = posts?.reduce((acc, p) => acc + (p.likes?.length || 0), 0) || 0;
  const totalComments = posts?.reduce((acc, p) => acc + (p.comments?.length || 0), 0) || 0;

  const stats = [
    { label: 'Total Posts', value: totalPosts, icon: FileText },
    { label: 'Published', value: publicPosts, icon: Eye },
    { label: 'Drafts', value: draftPosts, icon: FileText },
    { label: 'Total Likes', value: totalLikes, icon: Heart },
    { label: 'Comments', value: totalComments, icon: MessageCircle },
    { label: 'Users', value: adminAnalytics?.totalUsers || '-', icon: Users },
  ];

  const recentPosts = posts?.slice(0, 5) || [];

  return (
    <Box>
      <Flex justify="between" align="center" mb="5">
        <Box>
          <Heading size="5">Dashboard</Heading>
          <Text size="2" color="gray">
            Overview of your platform
          </Text>
        </Box>
        <Button size="2" asChild>
          <Link to="/write">New Post</Link>
        </Button>
      </Flex>

      {/* Stats */}
      <Grid columns={{ initial: '2', sm: '3', md: '6' }} gap="3" mb="5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <Box p="3">
                <Flex justify="between" align="start" mb="2">
                  <Icon size={16} color="var(--text-muted)" />
                </Flex>
                <Text size="5" weight="bold">
                  {stat.value}
                </Text>
                <Text size="1" color="gray">
                  {stat.label}
                </Text>
              </Box>
            </Card>
          );
        })}
      </Grid>

      <Grid columns={{ initial: '1', md: '2' }} gap="4">
        {/* Recent Posts */}
        <Card>
          <Box p="4">
            <Flex justify="between" align="center" mb="3">
              <Text size="3" weight="medium">
                Recent Posts
              </Text>
              <Button variant="ghost" size="1" asChild>
                <Link to="/admin/posts">
                  View All <ArrowRight size={12} />
                </Link>
              </Button>
            </Flex>
            <Flex direction="column" gap="2">
              {recentPosts.length === 0 ? (
                <Text color="gray" size="2">
                  No posts yet
                </Text>
              ) : (
                recentPosts.map((post) => (
                  <Flex key={post._id} justify="between" align="center" py="2">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/post/${post._id}`}>
                        <Text
                          size="2"
                          weight="medium"
                          className="text-truncate"
                          style={{ display: 'block' }}
                        >
                          {post.title}
                        </Text>
                      </Link>
                      <Text size="1" color="gray">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </Text>
                    </Box>
                    <Badge color="gray" size="1">
                      {post.visibility}
                    </Badge>
                  </Flex>
                ))
              )}
            </Flex>
          </Box>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Box p="4">
            <Text size="3" weight="medium" mb="3">
              Quick Actions
            </Text>
            <Grid columns="2" gap="2">
              <Button variant="soft" size="2" asChild>
                <Link to="/write">New Post</Link>
              </Button>
              <Button variant="soft" size="2" asChild>
                <Link to="/admin/categories">Categories</Link>
              </Button>
              <Button variant="soft" size="2" asChild>
                <Link to="/admin/posts">All Posts</Link>
              </Button>
              <Button variant="soft" size="2" asChild>
                <Link to="/admin/users">Users</Link>
              </Button>
            </Grid>
          </Box>
        </Card>

        {/* Content Summary */}
        <Card>
          <Box p="4">
            <Text size="3" weight="medium" mb="3">
              Content Summary
            </Text>
            <Flex direction="column" gap="2">
              <Flex justify="between">
                <Text size="2" color="gray">
                  Public Posts
                </Text>
                <Text size="2" weight="medium">
                  {publicPosts}
                </Text>
              </Flex>
              <Flex justify="between">
                <Text size="2" color="gray">
                  Draft Posts
                </Text>
                <Text size="2" weight="medium">
                  {draftPosts}
                </Text>
              </Flex>
              <Flex justify="between">
                <Text size="2" color="gray">
                  Private Posts
                </Text>
                <Text size="2" weight="medium">
                  {posts?.filter((p) => p.visibility === 'private').length || 0}
                </Text>
              </Flex>
              <Flex justify="between">
                <Text size="2" color="gray">
                  Total Engagement
                </Text>
                <Text size="2" weight="medium">
                  {totalLikes + totalComments}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Card>

        {/* Performance */}
        <Card>
          <Box p="4">
            <Text size="3" weight="medium" mb="3">
              Top Posts
            </Text>
            <Flex direction="column" gap="2">
              {recentPosts.slice(0, 4).map((post) => (
                <Flex key={post._id} justify="between" align="center">
                  <Text size="2" className="text-truncate" style={{ maxWidth: '180px' }}>
                    {post.title}
                  </Text>
                  <Flex gap="2">
                    <Flex align="center" gap="1">
                      <Heart size={12} />
                      <Text size="1">{post.likes?.length || 0}</Text>
                    </Flex>
                    <Flex align="center" gap="1">
                      <MessageCircle size={12} />
                      <Text size="1">{post.comments?.length || 0}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Box>
        </Card>
      </Grid>
    </Box>
  );
}
