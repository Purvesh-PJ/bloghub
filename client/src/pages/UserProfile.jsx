import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { queryKeys } from '../services/queryKeys';

const PAGE_SIZE = 12;

const SOCIALS = [
  { key: 'github', icon: Github, href: (handle) => `https://github.com/${handle}` },
  { key: 'twitter', icon: Twitter, href: (handle) => `https://twitter.com/${handle}` },
  { key: 'linkedin', icon: Linkedin, href: (handle) => `https://linkedin.com/in/${handle}` },
];

function ProfileSkeleton() {
  return (
    <PageShell>
      <header className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8" aria-hidden="true">
        <Skeleton variant="circle" width={96} height={96} />
        <div className="flex-1 min-w-0 flex flex-col gap-3 w-full">
          <Skeleton width={180} height={28} className="rounded" />
          <SkeletonText lines={2} lineHeight="14px" lastLineWidth="70%" gap="xs" />
          <div className="flex gap-6 mt-2">
            <Skeleton width={60} height={20} className="rounded" />
            <Skeleton width={60} height={20} className="rounded" />
            <Skeleton width={60} height={20} className="rounded" />
          </div>
        </div>
      </header>
      <Section title="Stories">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <PostCardSkeleton key={i} layout="stacked" />
          ))}
        </div>
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

  if (pagedAuthor !== userId) {
    setPagedAuthor(userId);
    setPage(1);
  }

  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: queryKeys.profiles.detail(userId),
    queryFn: () => userService.getPublicProfile(userId),
    enabled: Boolean(userId),
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: queryKeys.posts.byAuthor(userId, page),
    queryFn: () => postService.getPostsByAuthor(userId, { page, limit: PAGE_SIZE }),
    enabled: Boolean(userId),
  });

  const { data: followingData } = useQuery({
    queryKey: queryKeys.profiles.following(userId),
    queryFn: () => userService.isFollowing(userId),
    enabled: Boolean(isAuthenticated && userId && !isOwnProfile),
  });

  const isFollowing = Boolean(followingData?.isFollowing ?? followingData?.data?.isFollowing);

  const followMutation = useMutation({
    mutationFn: () => userService.followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.following(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.detail(userId) });
      toast.success(`Following ${profileData?.data?.username}`);
    },
    onError: () => toast.error('Could not follow user'),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => userService.unfollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.following(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.detail(userId) });
      toast.success(`Unfollowed ${profileData?.data?.username}`);
    },
    onError: () => toast.error('Could not unfollow user'),
  });

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  if (profileLoading) {
    return <ProfileSkeleton />;
  }

  if (profileError) {
    const is404 = profileError?.response?.status === 404;
    return (
      <PageShell>
        <ErrorState
          title={is404 ? 'No such writer' : 'Could not load profile'}
          message={
            is404
              ? 'This account does not exist, or has been removed.'
              : profileError.message || 'Something went wrong fetching this profile.'
          }
        />
      </PageShell>
    );
  }

  const author = profileData?.data;
  if (!author) return null;

  const authorName = author.username || 'Anonymous';
  const authorAvatar = avatarUrl(author.avatar);
  const posts = postsData?.data ?? [];
  const pagination = postsData?.pagination ?? { page: 1, pages: 1, total: posts.length };

  const socials = SOCIALS.filter(
    ({ key }) => author.socialLinks && Boolean(author.socialLinks[key])
  );

  const pending = followMutation.isPending || unfollowMutation.isPending;

  return (
    <PageShell>
      <header className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
        <Avatar
          src={authorAvatar}
          name={authorName}
          size="2xl"
        />

        <div className="flex-1 min-w-0 flex flex-col gap-3 w-full">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                {authorName}
              </h1>
              {author.fullName && (
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                  {author.fullName}
                </p>
              )}
            </div>

            {isOwnProfile ? (
              <Button as={Link} to="/settings" variant="secondary">
                <SettingsIcon className="h-4 w-4" /> Edit profile
              </Button>
            ) : (
              isAuthenticated && (
                <Button
                  variant={isFollowing ? 'tonal' : 'primary'}
                  onClick={handleFollowToggle}
                  disabled={pending}
                >
                  {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )
            )}
          </div>

          {author.bio && (
            <p className="text-base sm:text-lg text-[hsl(var(--muted-foreground))] max-w-[60ch] leading-relaxed">
              {author.bio}
            </p>
          )}

          {(author.location || author.website || socials.length > 0) && (
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-sm text-[hsl(var(--muted-foreground))]">
              {author.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" /> {author.location}
                </span>
              )}

              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[hsl(var(--primary))] transition-colors"
                >
                  <LinkIcon className="h-3.5 w-3.5" /> {author.website.replace(/^https?:\/\//, '')}
                </a>
              )}

              {socials.map(({ key, icon: Icon, href }) => (
                <a
                  key={key}
                  href={href(author.socialLinks[key])}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${authorName} on ${key}`}
                  className="inline-flex items-center gap-1.5 hover:text-[hsl(var(--primary))] transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" /> {author.socialLinks[key]}
                </a>
              ))}
            </div>
          )}

          {/* Counts from server */}
          <dl className="flex gap-6 sm:gap-8 flex-wrap pt-2">
            <div className="flex items-baseline gap-1.5">
              <dt className="text-base font-semibold text-[hsl(var(--foreground))] tabular-nums">
                {author.counts?.posts ?? 0}
              </dt>
              <dd className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                {author.counts?.posts === 1 ? 'story' : 'stories'}
              </dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-base font-semibold text-[hsl(var(--foreground))] tabular-nums">
                {author.counts?.followers ?? 0}
              </dt>
              <dd className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                {author.counts?.followers === 1 ? 'follower' : 'followers'}
              </dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-base font-semibold text-[hsl(var(--foreground))] tabular-nums">
                {author.counts?.following ?? 0}
              </dt>
              <dd className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                following
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <Section title={isOwnProfile ? 'Your published stories' : `Stories by ${authorName}`}>
        {postsLoading && posts.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
            {[1, 2, 3, 4].map((i) => (
              <PostCardSkeleton key={i} layout="stacked" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={PenLine}
            title={isOwnProfile ? 'Nothing published yet' : 'Nothing here yet'}
            actions={
              isOwnProfile && (
                <Button as={Link} to="/write">
                  <PenLine className="h-4 w-4" /> Write your first story
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} layout="stacked" />
              ))}
            </div>

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
