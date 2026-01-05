import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Avatar,
  Card,
  Grid,
  Tabs,
  Button,
  Badge,
  Separator,
} from '@radix-ui/themes';
import { Pencil1Icon, CalendarIcon, FileTextIcon, HeartIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import { formatDistanceToNow } from 'date-fns';
import { userService } from '../services/userService';
import { useAuthStore } from '../store/authStore';
import { PostCard } from '../components/common/PostCard';
import { Loading } from '../components/common/Loading';

export function Profile() {
  const { user } = useAuthStore();

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getUser,
  });

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts'],
    queryFn: userService.getUserPosts,
  });

  if (userLoading) {
    return <Loading text="Loading profile..." />;
  }

  const profile = userData?.User;
  const posts = userPosts || [];
  const publicPosts = posts.filter((p) => p.visibility === 'public');
  const draftPosts = posts.filter((p) => p.visibility === 'draft');
  const privatePosts = posts.filter((p) => p.visibility === 'private');

  const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
  const totalComments = posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);

  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="6">
        {/* Profile Header */}
        <Card>
          <Flex direction={{ initial: 'column', sm: 'row' }} gap="5" p="5">
            <Avatar
              size="8"
              fallback={profile?.username?.[0]?.toUpperCase() || 'U'}
              radius="full"
              src={profile?.profile?.image?.data}
            />
            <Box style={{ flex: 1 }}>
              <Flex justify="between" align="start" mb="3">
                <Box>
                  <Heading size="6">{profile?.username}</Heading>
                  <Text size="2" color="gray">{profile?.email}</Text>
                </Box>
                <Button variant="soft" asChild>
                  <Link to="/settings">
                    <Pencil1Icon /> Edit Profile
                  </Link>
                </Button>
              </Flex>

              {profile?.profile?.bio && (
                <Text size="2" color="gray" mb="4" style={{ display: 'block' }}>
                  {profile.profile.bio}
                </Text>
              )}

              <Flex gap="2" mb="4" wrap="wrap">
                {user?.roles?.map((role) => (
                  <Badge key={role} variant="soft" color={role === 'admin' ? 'red' : 'blue'}>
                    {role}
                  </Badge>
                ))}
              </Flex>

              <Flex gap="6" wrap="wrap">
                <Flex align="center" gap="2">
                  <FileTextIcon />
                  <Text size="2">
                    <Text weight="bold">{profile?.profile?.postCount || posts.length}</Text> Posts
                  </Text>
                </Flex>
                <Flex align="center" gap="2">
                  <HeartIcon />
                  <Text size="2">
                    <Text weight="bold">{totalLikes}</Text> Likes
                  </Text>
                </Flex>
                <Flex align="center" gap="2">
                  <ChatBubbleIcon />
                  <Text size="2">
                    <Text weight="bold">{totalComments}</Text> Comments
                  </Text>
                </Flex>
              </Flex>

              <Separator size="4" my="4" />

              <Flex gap="6">
                <Box style={{ textAlign: 'center' }}>
                  <Text size="5" weight="bold">{profile?.profile?.followersCount || 0}</Text>
                  <Text size="1" color="gray" style={{ display: 'block' }}>Followers</Text>
                </Box>
                <Box style={{ textAlign: 'center' }}>
                  <Text size="5" weight="bold">{profile?.profile?.followingsCount || 0}</Text>
                  <Text size="1" color="gray" style={{ display: 'block' }}>Following</Text>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Card>

        {/* Stats Cards */}
        <Grid columns={{ initial: '2', md: '4' }} gap="4">
          <Card>
            <Flex direction="column" align="center" p="3">
              <Text size="6" weight="bold" color="blue">{publicPosts.length}</Text>
              <Text size="1" color="gray">Published</Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" p="3">
              <Text size="6" weight="bold" color="orange">{draftPosts.length}</Text>
              <Text size="1" color="gray">Drafts</Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" p="3">
              <Text size="6" weight="bold" color="gray">{privatePosts.length}</Text>
              <Text size="1" color="gray">Private</Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" p="3">
              <Text size="6" weight="bold" color="green">{totalLikes}</Text>
              <Text size="1" color="gray">Total Likes</Text>
            </Flex>
          </Card>
        </Grid>

        {/* Posts Tabs */}
        <Tabs.Root defaultValue="published">
          <Tabs.List>
            <Tabs.Trigger value="published">Published ({publicPosts.length})</Tabs.Trigger>
            <Tabs.Trigger value="drafts">Drafts ({draftPosts.length})</Tabs.Trigger>
            <Tabs.Trigger value="private">Private ({privatePosts.length})</Tabs.Trigger>
          </Tabs.List>

          <Box pt="4">
            <Tabs.Content value="published">
              {postsLoading ? (
                <Loading text="Loading posts..." />
              ) : publicPosts.length === 0 ? (
                <Card>
                  <Flex direction="column" align="center" py="9">
                    <Text color="gray" mb="3">No published posts yet</Text>
                    <Button asChild>
                      <Link to="/write">Write your first post</Link>
                    </Button>
                  </Flex>
                </Card>
              ) : (
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  {publicPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </Grid>
              )}
            </Tabs.Content>

            <Tabs.Content value="drafts">
              {postsLoading ? (
                <Loading text="Loading drafts..." />
              ) : draftPosts.length === 0 ? (
                <Card>
                  <Flex direction="column" align="center" py="9">
                    <Text color="gray">No drafts</Text>
                  </Flex>
                </Card>
              ) : (
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  {draftPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </Grid>
              )}
            </Tabs.Content>

            <Tabs.Content value="private">
              {postsLoading ? (
                <Loading text="Loading private posts..." />
              ) : privatePosts.length === 0 ? (
                <Card>
                  <Flex direction="column" align="center" py="9">
                    <Text color="gray">No private posts</Text>
                  </Flex>
                </Card>
              ) : (
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  {privatePosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </Grid>
              )}
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>
    </Container>
  );
}
