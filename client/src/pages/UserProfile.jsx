import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import {
  UserPlus,
  UserCheck,
  Settings as SettingsIcon,
  PenLine,
  MapPin,
  LinkIcon,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { userService } from '../services/userService';
import { avatarUrl } from '../config/api';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/posts/PostCard';
import { PostCardSkeleton } from '../components/posts/PostCardSkeleton';
import { PageShell, Section } from '../components/layout/PageShell';
import {
  Button,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonText,
  Avatar,
  Pagination,
} from '../components/ui';
import { display, text, label as labelStyle, media } from '../styles/theme/mixins';
import { queryKeys } from '../services/queryKeys';

/**
 * A person's public page — the same page whether it is yours or somebody else's.
 *
 * Two things were wrong with it, and both made it show the wrong person entirely.
 *
 * It called `userService.getUser(userId)`, which ignores its argument and returns whoever the
 * token belongs to, so every writer's page rendered the *viewer's* account — and 401'd for a
 * signed-out reader who clicked a byline. It now calls `GET /users/:id/profile`, a public
 * endpoint written for this page.
 *
 * The stories underneath came from the global feed, filtered by author in the browser. That
 * only ever saw the first page of the whole site, so an author whose work was not among the
 * twenty newest posts appeared to have written nothing, and the counts derived from that
 * list were wrong for the same reason. Both now come from the server.
 */

const PAGE_SIZE = 12;

const Head = styled.header`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing['2xl']};

  ${media.down('sm')`
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
  `}
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

const FullName = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const Bio = styled.p`
  ${text('lg')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 60ch;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textMuted};

  a {
    color: inherit;
    display: inline-flex;
    align-items: center;
    gap: 4px;

    &:hover {
      color: ${({ theme }) => theme.colors.accentText};
    }
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
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

/** The social handles the profile stores, paired with the icon and URL each one implies. */
const SOCIALS = [
  { key: 'github', icon: Github, href: (handle) => `https://github.com/${handle}` },
  { key: 'twitter', icon: Twitter, href: (handle) => `https://twitter.com/${handle}` },
  { key: 'linkedin', icon: Linkedin, href: (handle) => `https://linkedin.com/in/${handle}` },
];

function ProfileSkeleton() {
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

export function UserProfile() {
  const { userId } = useParams();
  const { isAuthenticated, user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pagedAuthor, setPagedAuthor] = useState(userId);

  const isOwnProfile = currentUser?._id === userId || currentUser?.user_id === userId;

  /*
    Navigating from one writer's page straight to another's keeps this component mounted, so
    page 3 of the first author would be requested for the second. Adjusted during render
    rather than in an effect: React re-renders immediately with the corrected value, where an
    effect would let one render escape with the stale page and fetch it.
  */
  if (pagedAuthor !== userId) {
    setPagedAuthor(userId);
    setPage(1);
  }

  const {
    data: profileResponse,
    isLoading: profileLoading,
    isError: profileFailed,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: queryKeys.profiles.detail(userId),
    queryFn: () => userService.getPublicProfile(userId),
    enabled: Boolean(userId),
    retry: false,
  });

  const { data: postsResponse, isLoading: postsLoading } = useQuery({
    // Paged and filtered by the server, so the key has to carry the page.
    queryKey: queryKeys.posts.byAuthor(userId, page),
    queryFn: () => postService.getPostsByAuthor(userId, { page, limit: PAGE_SIZE }),
    enabled: Boolean(userId),
    // Keeps the previous page on screen while the next one loads rather than flashing skeletons.
    placeholderData: (previous) => previous,
  });

  const { data: followingData } = useQuery({
    queryKey: queryKeys.profiles.following(userId),
    queryFn: () => userService.isFollowing(userId),
    enabled: isAuthenticated && !isOwnProfile && Boolean(userId),
  });

  const isFollowing = Boolean(followingData?.isFollowing);

  /*
    Both mutations invalidate the profile as well as the follow state: the follower count on
    this page is part of what just changed, and leaving it stale meant the button flipped
    while the number beside it did not.
  */
  const refreshFollowState = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.profiles.following(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.profiles.detail(userId) });
  };

  const followMutation = useMutation({
    mutationFn: () => userService.followUser(userId),
    onSuccess: refreshFollowState,
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Could not follow this person'),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => userService.unfollowUser(userId),
    onSuccess: refreshFollowState,
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Could not unfollow this person'),
  });

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      toast.error('Sign in to follow writers');
      return;
    }
    (isFollowing ? unfollowMutation : followMutation).mutate();
  };

  if (profileLoading) return <ProfileSkeleton />;

  if (profileFailed) {
    const missing = profileError?.response?.status === 404;
    return (
      <PageShell>
        {/* A deleted account is not a transient failure, so it gets no retry button. */}
        <ErrorState
          title={missing ? 'No such writer' : 'Could not load this profile'}
          error={missing ? undefined : profileError}
          onRetry={missing ? undefined : refetchProfile}
        >
          {missing
            ? 'This account may have been deleted.'
            : 'Something went wrong fetching this page.'}
        </ErrorState>
      </PageShell>
    );
  }

  const author = profileResponse?.data ?? {};
  const authorName = author.username || 'Writer';
  const posts = postsResponse?.data ?? [];
  const pagination = postsResponse?.pagination ?? { page: 1, pages: 1, total: 0 };
  const pending = followMutation.isPending || unfollowMutation.isPending;

  const socials = SOCIALS.filter(({ key }) => author.socialLinks?.[key]);

  return (
    <PageShell>
      <Head>
        {/* Fetched as an image the browser can cache, rather than base64 inside the JSON. */}
        <Avatar
          src={author.hasAvatar ? avatarUrl(userId, author.avatarUpdatedAt) : null}
          name={authorName}
          size="2xl"
        />

        <Identity>
          <NameRow>
            <div>
              <Name>{authorName}</Name>
              {author.fullName && <FullName>{author.fullName}</FullName>}
            </div>

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

          {author.bio && <Bio>{author.bio}</Bio>}

          {(author.location || author.website || socials.length > 0) && (
            <Meta>
              {author.location && (
                <MetaItem>
                  <MapPin /> {author.location}
                </MetaItem>
              )}

              {author.website && (
                <a href={author.website} target="_blank" rel="noopener noreferrer">
                  <LinkIcon /> {author.website.replace(/^https?:\/\//, '')}
                </a>
              )}

              {socials.map(({ key, icon: Icon, href }) => (
                <a
                  key={key}
                  href={href(author.socialLinks[key])}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${authorName} on ${key}`}
                >
                  <Icon /> {author.socialLinks[key]}
                </a>
              ))}
            </Meta>
          )}

          {/* Counts come from the server, which knows the totals rather than the page. */}
          <Counts>
            <Count>
              <CountValue>{author.counts?.posts ?? 0}</CountValue>
              <CountLabel>{author.counts?.posts === 1 ? 'story' : 'stories'}</CountLabel>
            </Count>
            <Count>
              <CountValue>{author.counts?.followers ?? 0}</CountValue>
              <CountLabel>{author.counts?.followers === 1 ? 'follower' : 'followers'}</CountLabel>
            </Count>
            <Count>
              <CountValue>{author.counts?.following ?? 0}</CountValue>
              <CountLabel>following</CountLabel>
            </Count>
          </Counts>
        </Identity>
      </Head>

      <Section title={isOwnProfile ? 'Your published stories' : `Stories by ${authorName}`}>
        {postsLoading && posts.length === 0 ? (
          <Grid aria-hidden="true">
            {[1, 2, 3, 4].map((i) => (
              <PostCardSkeleton key={i} layout="stacked" />
            ))}
          </Grid>
        ) : posts.length === 0 ? (
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
          <>
            <Grid>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} layout="stacked" />
              ))}
            </Grid>

            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              noun="stories"
              onChange={setPage}
            />
          </>
        )}
      </Section>
    </PageShell>
  );
}
