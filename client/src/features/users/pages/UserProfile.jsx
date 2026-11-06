import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PenLine } from 'lucide-react';
import toast from 'react-hot-toast';

import { userService } from '../services/userService';
import { avatarUrl } from '../../../config/api';
import { postService } from '../../posts/services/postService';
import { useAuth } from '../../../features/auth';
import { PostCard, PostCardSkeleton } from '../../posts';
import { PageShell, Section } from '../../../components/layout/PageShell';
import { Button, EmptyState, ErrorState, Pagination } from '../../../components/ui';
import { ProfileHeader, ProfileSkeleton } from '../components';
import { queryKeys } from '../../../config/queryKeys';

const PAGE_SIZE = 12;

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
    if (!isAuthenticated) {
      toast('Sign in to follow this author', { icon: '👤' });
      return;
    }
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
  const pending = followMutation.isPending || unfollowMutation.isPending;

  return (
    <PageShell>
      <ProfileHeader
        author={author}
        authorAvatar={authorAvatar}
        authorName={authorName}
        isOwnProfile={isOwnProfile}
        isAuthenticated={isAuthenticated}
        isFollowing={isFollowing}
        pending={pending}
        onFollowToggle={handleFollowToggle}
      />

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
