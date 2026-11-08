import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, EyeOff, Lock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useDebounced } from './useDebounced';
import { postService } from '../services/postService';
import { analyticsService } from '../../analytics/services/analyticsService';
import { queryKeys } from '../../../config/queryKeys';

const PAGE_SIZE = 10;

const VISIBILITY_MESSAGE = {
  public: 'Story published live! 🎉',
  draft: 'Story moved to drafts.',
  private: 'Story is now private.',
};

/**
 * useStoriesManagement — encapsulates all querying, pagination, search,
 * visibility toggling, single and bulk mutations for the creator stories studio.
 */
export function useStoriesManagement() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingBulk, setPendingBulk] = useState(null);

  const debouncedQuery = useDebounced(query, 300);

  const listParams = {
    page,
    limit: PAGE_SIZE,
    sort,
    ...(filter !== 'all' && { visibility: filter }),
    ...(debouncedQuery.trim() && { q: debouncedQuery.trim() }),
  };

  const {
    data: postsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.posts.mine(listParams),
    queryFn: () => postService.getMyPosts(listParams),
    placeholderData: (previous) => previous,
  });

  const { data: analyticsData } = useQuery({
    queryKey: queryKeys.analytics.mine(),
    queryFn: analyticsService.getMyAnalytics,
  });

  const refreshLists = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.mine() });
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.mine() });
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
  };

  const setVisibilityMutation = useMutation({
    mutationFn: ({ post, newVisibility }) =>
      postService.updatePost(post._id, { visibility: newVisibility }),
    onSuccess: (_, { newVisibility }) => {
      refreshLists();
      toast.success(VISIBILITY_MESSAGE[newVisibility] ?? 'Story updated.');
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || 'Could not update story visibility'),
  });

  const deleteMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      refreshLists();
      setPendingDelete(null);
      toast.success('Story deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not delete story'),
  });

  const bulkMutation = useMutation({
    mutationFn: ({ ids, action }) => postService.bulkUpdate(ids, action),
    onSuccess: (response) => {
      refreshLists();
      setSelectedIds([]);
      setPendingBulk(null);
      toast.success(response?.message || 'Stories updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not update those stories'),
  });

  const posts = useMemo(() => (Array.isArray(postsData?.data) ? postsData.data : []), [postsData]);
  const pagination = postsData?.pagination;
  const counts = postsData?.counts ?? { all: 0, public: 0, draft: 0, private: 0 };

  const statsByPost = useMemo(() => {
    const map = new Map();
    (analyticsData?.data?.postsAnalytics ?? []).forEach((entry) =>
      map.set(String(entry.postId), entry)
    );
    return map;
  }, [analyticsData]);

  const visibleIds = posts.map((post) => post._id);
  const allOnPageSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const toggleSelected = (id) =>
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );

  const resetToFirstPage = (apply) => {
    apply();
    setPage(1);
    setSelectedIds([]);
  };

  const bulkActions = [
    {
      label: 'Publish',
      icon: <Globe className="w-3.5 h-3.5" />,
      variant: 'tonal',
      onClick: () => bulkMutation.mutate({ ids: selectedIds, action: 'public' }),
      disabled: bulkMutation.isPending,
    },
    {
      label: 'To drafts',
      icon: <EyeOff className="w-3.5 h-3.5" />,
      variant: 'secondary',
      onClick: () => bulkMutation.mutate({ ids: selectedIds, action: 'draft' }),
      disabled: bulkMutation.isPending,
    },
    {
      label: 'Make private',
      icon: <Lock className="w-3.5 h-3.5" />,
      variant: 'secondary',
      onClick: () => bulkMutation.mutate({ ids: selectedIds, action: 'private' }),
      disabled: bulkMutation.isPending,
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-3.5 h-3.5" />,
      variant: 'dangerTonal',
      onClick: () => setPendingBulk(selectedIds),
      disabled: bulkMutation.isPending,
    },
  ];

  return {
    filter,
    setFilter,
    query,
    setQuery,
    sort,
    setSort,
    page,
    setPage,
    selectedIds,
    setSelectedIds,
    pendingDelete,
    setPendingDelete,
    pendingBulk,
    setPendingBulk,
    posts,
    pagination,
    counts,
    statsByPost,
    visibleIds,
    allOnPageSelected,
    toggleSelected,
    resetToFirstPage,
    bulkActions,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    setVisibilityMutation,
    deleteMutation,
    bulkMutation,
  };
}
