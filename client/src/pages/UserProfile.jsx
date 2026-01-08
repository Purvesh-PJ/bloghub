import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Avatar,
  Card,
  Grid,
  Button,
  Badge,
  Separator,
} from '@radix-ui/themes';
import { FileTextIcon, HeartIcon, PersonIcon } from '@radix-ui/react-icons';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { useAuthStore } from '../store/authStore';
import { PostCard } from '../components/common/PostCard';
import { Loading } from '../components/common/Loading';

export function UserProfile() {
  const { userId } = useParams();
  const { isAuthenticated, user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(false);

  // Get all posts and filter by user
  const { data: allPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getPosts,
  });

  // Check if following
  const { data: followingData } = useQuery({
    queryKey: ['isFollowing', userId],
    queryFn: () => userService.isFollowing(userId),
    enabled: isAuthenticated && currentUser?.user_id !== userId,
  });

  useEffect(() => {
    if (followingData) {
      setIsFollowing(followingData.isFollowing);
    }
  }, [followingData]);

  const followMutation = useMutation({
    mutationFn: () => userService.followUser(userId),
    onSuccess: () => {
      setIsFollowing(true);
      queryClient.invalidateQueries(['isFollowing', userId]);
      toast.success('Followed successfully');
    },
    onError: () => toast.error('Failed to follow'),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => userService.unfollowUser(userId),
    onSuccess: () => {
      setIsFollowing(false);
      queryClient.invalidateQueries(['isFollowing', userId]);
      toast.success('Unfollowed successfully');
    },
    onError: () => toast.error('Failed to unfollow'),
  });

  if (postsLoading) {
    return <Loading text="Loading profile..." />;
  }

  // Filter posts by this user
  const userPosts =
    allPosts?.filter((post) => post.user?._id === userId && post.visibility === 'public') || [];

  const totalLikes = userPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
  const authorName = userPosts[0]?.user?.username || 'User';

  const isOwnProfile = currentUser?.user_id === userId;

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to follow');
      return;
    }
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="6">
        {/* Profile Header */}
        <Card>
          <Flex direction={{ initial: 'column', sm: 'row' }} gap="5" p="5" align="center">
            <Avatar size="8" fallback={authorName[0]?.toUpperCase() || 'U'} radius="full" />
            <Box style={{ flex: 1, textAlign: 'center' }}>
              <Heading size="6" mb="2">
                {authorName}
              </Heading>

              <Flex gap="6" justify="center" mb="4">
                <Box style={{ textAlign: 'center' }}>
                  <Text size="5" weight="bold">
                    {userPosts.length}
                  </Text>
                  <Text size="1" color="gray" style={{ display: 'block' }}>
                    Posts
                  </Text>
                </Box>
                <Box style={{ textAlign: 'center' }}>
                  <Text size="5" weight="bold">
                    {totalLikes}
                  </Text>
                  <Text size="1" color="gray" style={{ display: 'block' }}>
                    Likes
                  </Text>
                </Box>
              </Flex>

              {!isOwnProfile && isAuthenticated && (
                <Button
                  variant={isFollowing ? 'soft' : 'solid'}
                  onClick={handleFollowToggle}
                  disabled={followMutation.isPending || unfollowMutation.isPending}
                >
                  <PersonIcon />
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </Box>
          </Flex>
        </Card>

        {/* Posts */}
        <Box>
          <Heading size="5" mb="4">
            Posts by {authorName}
          </Heading>
          {userPosts.length === 0 ? (
            <Card>
              <Flex direction="column" align="center" py="9">
                <Text color="gray">No public posts yet</Text>
              </Flex>
            </Card>
          ) : (
            <Grid columns={{ initial: '1', sm: '2' }} gap="4">
              {userPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </Grid>
          )}
        </Box>
      </Flex>
    </Container>
  );
}
