import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { UserPlus, UserCheck, Settings as SettingsIcon, PenLine } from 'lucide-react';
import toast from 'react-hot-toast';

import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/posts/PostCard';
import { PostCardSkeleton } from '../components/posts/PostCardSkeleton';
import { PageShell, Section } from '../components/layout/PageShell';
import { Button, Card, Chip, Loading, EmptyState, Skeleton, SkeletonText } from '../components/ui';
import { display, text, label as labelStyle, media } from '../styles/theme/mixins';
import { initial } from '../utils/text';

/**
 * A person's public page — the same page whether it is yours or somebody else's.
 *
 * There used to be two: this one, built on @radix-ui/themes, and /profile, built on
 * styled-components. Neither matched the other, and this one rendered unstyled because the
 * Themes package was never given its stylesheet or its provider. Viewing your own profile
 * now lands here too, with an Edit button where the Follow button would be, so what you see
 * is what a reader sees.
 */

const Head = styled.header`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing['2xl']};

  ${media.down('sm')`
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

const Portrait = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.gradients.brand};
  color: #ffffff;
  ${display('sm')}
  font-weight: 700;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.35);
  border: 3px solid ${({ theme }) => theme.colors.surfaceElevated};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Identity = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NameRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const Name = styled.h1`
  ${display('sm')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Bio = styled.p`
  ${text('lg')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 60ch;
`;

const Counts = styled.dl`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`;

const Count = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CountValue = styled.dt`
  ${text('md', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const CountLabel = styled.dd`
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

export function UserProfile() {
  const { userId } = useParams();
  const { isAuthenticated, user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?._id === userId || currentUser?.user_id === userId;

  const { data: userData } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId),
    enabled: Boolean(userId),
  });

  const { data: postsResponse, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.getPosts(),
  });

  const { data: followingData } = useQuery({
    queryKey: ['isFollowing', userId],
    queryFn: () => userService.isFollowing(userId),
    enabled: isAuthenticated && !isOwnProfile,
  });

  useEffect(() => {
    if (followingData) setIsFollowing(followingData.isFollowing);
  }, [followingData]);

  const followMutation = useMutation({
    mutationFn: () => userService.followUser(userId),
    onSuccess: () => {
      setIsFollowing(true);
      queryClient.invalidateQueries({ queryKey: ['isFollowing', userId] });
    },
    onError: () => toast.error('Could not follow this person'),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => userService.unfollowUser(userId),
    onSuccess: () => {
      setIsFollowing(false);
      queryClient.invalidateQueries({ queryKey: ['isFollowing', userId] });
    },
    onError: () => toast.error('Could not unfollow this person'),
  });

  // The endpoint already returns only published posts.
  const userPosts = useMemo(
    () => (postsResponse?.data || []).filter((post) => post.user?._id === userId),
    [postsResponse, userId]
  );

  const author = userData?.data || userPosts[0]?.user;
  const authorName = author?.username || 'Writer';
  const authorBio = author?.bio || 'Storyteller on BlogHub.';

  const totals = useMemo(
    () => ({
      posts: userPosts.length,
      likes: userPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0),
      replies: userPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0),
    }),
    [userPosts]
  );

  /** Topics this person actually writes about, most frequent first. */
  const topics = useMemo(() => {
    const tally = new Map();
    userPosts.forEach((post) =>
      (post.categories || []).forEach((category) => {
        const name = category?.name;
        if (name) tally.set(name, (tally.get(name) || 0) + 1);
      })
    );
    return [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [userPosts]);

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      toast.error('Sign in to follow writers');
      return;
    }
    (isFollowing ? unfollowMutation : followMutation).mutate();
  };

  if (postsLoading) {
    return (
      <PageShell>
        <Head aria-hidden="true">
          <Skeleton $variant="circle" $width={96} $height={96} />
          <Identity>
            <Skeleton $width={180} $height={28} $radius="xs" />
            <SkeletonText lines={2} lineHeight="14px" lastLineWidth="70%" gap="xs" />
            <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
              <Skeleton $width={60} $height={20} $radius="xs" />
              <Skeleton $width={60} $height={20} $radius="xs" />
              <Skeleton $width={60} $height={20} $radius="xs" />
            </div>
          </Identity>
        </Head>
        <Section title="Stories">
          <Grid>
            {[1, 2, 3, 4].map((i) => (
              <PostCardSkeleton key={i} layout="stacked" />
            ))}
          </Grid>
        </Section>
      </PageShell>
    );
  }

  const pending = followMutation.isPending || unfollowMutation.isPending;

  return (
    <PageShell>
      <Head>
        <Portrait>
          {author?.profileImage ? (
            <img src={author.profileImage} alt={`${authorName}'s profile picture`} />
          ) : (
            initial(authorName)
          )}
        </Portrait>

        <Identity>
          <NameRow>
            <Name>{authorName}</Name>

            {isOwnProfile ? (
              <Button as={Link} to="/settings" variant="secondary">
                <SettingsIcon /> Edit profile
              </Button>
            ) : (
              isAuthenticated && (
                <Button
                  variant={isFollowing ? 'tonal' : 'primary'}
                  onClick={handleFollowToggle}
                  disabled={pending}
                >
                  {isFollowing ? <UserCheck /> : <UserPlus />}
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )
            )}
          </NameRow>

          {author?.profile?.bio && <Bio>{author.profile.bio}</Bio>}

          <Counts>
            <Count>
              <CountValue>{totals.posts}</CountValue>
              <CountLabel>{totals.posts === 1 ? 'story' : 'stories'}</CountLabel>
            </Count>
            <Count>
              <CountValue>{totals.likes}</CountValue>
              <CountLabel>likes</CountLabel>
            </Count>
            <Count>
              <CountValue>{totals.replies}</CountValue>
              <CountLabel>replies</CountLabel>
            </Count>
          </Counts>

          {topics.length > 0 && (
            <Counts as="div">
              {topics.map(([name, count]) => (
                <Chip key={name} size="sm" interactive={false}>
                  {name} · {count}
                </Chip>
              ))}
            </Counts>
          )}
        </Identity>
      </Head>

      <Section title={isOwnProfile ? 'Your published stories' : `Stories by ${authorName}`}>
        {userPosts.length === 0 ? (
          <EmptyState
            icon={PenLine}
            title={isOwnProfile ? 'Nothing published yet' : 'Nothing here yet'}
            actions={
              isOwnProfile && (
                <Button as={Link} to="/write">
                  <PenLine /> Write your first story
                </Button>
              )
            }
          >
            {isOwnProfile
              ? 'Drafts and private posts stay off this page. Publish one and it will appear here.'
              : `${authorName} has not published anything yet. Follow them and their first story will reach you.`}
          </EmptyState>
        ) : (
          <Grid>
            {userPosts.map((post) => (
              <PostCard key={post._id} post={post} layout="stacked" />
            ))}
          </Grid>
        )}
      </Section>
    </PageShell>
  );
}
