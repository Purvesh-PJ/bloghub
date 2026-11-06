import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PenLine,
  Search as SearchIcon,
  EyeOff,
  Globe,
  Lock,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useDebounced } from '../hooks/useDebounced';
import { postService } from '../services/postService';
import { analyticsService } from '../../analytics/services/analyticsService';
import { PageShell } from '../../../components/layout/PageShell';
import { StoryRow } from '../components/StoryRow';
import { ConfirmDialog, BulkActionBar } from '../../../components/shared';
import {
  Button,
  Card,
  Input,
  Chip,
  EmptyState,
  ErrorState,
  Spinner,
  Skeleton,
  Pagination,
} from '../../../components/ui';
import { queryKeys } from '../../../config/queryKeys';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'public', label: 'Published' },
  { id: 'draft', label: 'Drafts' },
  { id: 'private', label: 'Private' },
];

const SORTS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'updated', label: 'Recently updated' },
  { id: 'title', label: 'Title A–Z' },
];

const PAGE_SIZE = 10;

export function Stories() {
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

  const VISIBILITY_MESSAGE = {
    public: 'Story published live! 🎉',
    draft: 'Story moved to drafts.',
    private: 'Story is now private.',
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

  return (
    <PageShell>
      {/* Bulk actions banner */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        label={`${selectedIds.length} selected on this page`}
        variant="banner"
        actions={bulkActions}
        clearLabel="Cancel"
        onClear={() => setSelectedIds([])}
      />

      {/* Toolbar: Filter chips, sort select, and title search */}
      <div className="flex items-center gap-2.5 flex-wrap p-3 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))/0.6] mb-4">
        {FILTERS.map((option) => (
          <Chip
            key={option.id}
            selected={filter === option.id}
            onClick={() => resetToFirstPage(() => setFilter(option.id))}
          >
            {option.label}
            {counts[option.id] > 0 ? ` (${counts[option.id]})` : ''}
          </Chip>
        ))}

        <select
          value={sort}
          onChange={(e) => resetToFirstPage(() => setSort(e.target.value))}
          aria-label="Sort stories"
          className="h-9 px-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] text-sm text-[hsl(var(--foreground))] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.3]"
        >
          {SORTS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex-1 min-w-[200px] max-w-[320px] ml-auto max-sm:ml-0 max-sm:max-w-full">
          <Input
            icon={<SearchIcon />}
            placeholder="Search by title…"
            value={query}
            onChange={(e) => resetToFirstPage(() => setQuery(e.target.value))}
          />
        </div>
      </div>

      {isError ? (
        <ErrorState title="Your stories did not load" error={error} onRetry={() => refetch()} />
      ) : isLoading ? (
        <Card tone="low" radius="xl" padding="md" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))/0.4] last:border-b-0"
            >
              <div className="flex items-center gap-4 flex-1">
                <Skeleton width={20} height={20} className="rounded" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton width="60%" height={16} className="rounded" />
                  <Skeleton width="30%" height={12} className="rounded" />
                </div>
              </div>
              <Skeleton width={60} height={24} className="rounded-full" />
            </div>
          ))}
        </Card>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title={counts.all === 0 ? 'Nothing written yet' : 'No matching stories'}
          actions={
            counts.all === 0 ? (
              <Button as={Link} to="/write" size="sm">
                <PenLine className="w-3.5 h-3.5 mr-1" /> Write your first story
              </Button>
            ) : undefined
          }
        >
          {counts.all === 0
            ? 'Drafts stay private until you publish them, so there is no risk in starting one.'
            : 'No stories match that filter. Try another tab, or clear the search.'}
        </EmptyState>
      ) : (
        <Card tone="low" radius="xl" padding="sm" className="relative p-2">
          {isFetching && (
            <div
              role="status"
              aria-live="polite"
              className="absolute top-2 right-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--primary))/0.15] text-[hsl(var(--primary))] text-xs font-semibold"
            >
              <Spinner size="12px" /> Updating…
            </div>
          )}

          {/* Select all row */}
          <label className="flex items-center gap-3 px-4 py-2 text-xs text-[hsl(var(--muted-foreground))] cursor-pointer border-b border-[hsl(var(--border))/0.4]">
            <input
              type="checkbox"
              checked={allOnPageSelected}
              onChange={() =>
                setSelectedIds(
                  allOnPageSelected
                    ? selectedIds.filter((id) => !visibleIds.includes(id))
                    : [...new Set([...selectedIds, ...visibleIds])]
                )
              }
              aria-label="Select every story on this page"
              className="w-4 h-4 rounded accent-[hsl(var(--primary))] cursor-pointer"
            />
            <span>Select all on this page</span>
          </label>

          {/* Rows list */}
          <div className="flex flex-col">
            {posts.map((post) => (
              <StoryRow
                key={post._id}
                post={post}
                stats={statsByPost.get(String(post._id))}
                selected={selectedIds.includes(post._id)}
                onToggleSelected={toggleSelected}
                onDelete={setPendingDelete}
                onSetVisibility={(p, vis) =>
                  setVisibilityMutation.mutate({ post: p, newVisibility: vis })
                }
              />
            ))}
          </div>

          {pagination && (
            <div className="pt-2">
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                noun="stories"
                onChange={(next) => {
                  setPage(next);
                  setSelectedIds([]);
                }}
              />
            </div>
          )}
        </Card>
      )}

      {/* Delete confirmation modals */}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this story?"
        description={
          pendingDelete
            ? `"${pendingDelete.title || 'Untitled'}" will be permanently removed, along with its comments and likes. This cannot be undone.`
            : ''
        }
        confirmText={deleteMutation.isPending ? 'Deleting…' : 'Delete'}
        confirmVariant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(pendingDelete._id)}
      />

      <ConfirmDialog
        open={Boolean(pendingBulk)}
        onOpenChange={(open) => !open && setPendingBulk(null)}
        title={`Delete ${pendingBulk?.length ?? 0} ${pendingBulk?.length === 1 ? 'story' : 'stories'}?`}
        description="They will be permanently removed, along with their comments and likes. This cannot be undone."
        confirmText={bulkMutation.isPending ? 'Deleting…' : 'Delete all'}
        confirmVariant="danger"
        loading={bulkMutation.isPending}
        onConfirm={() => bulkMutation.mutate({ ids: pendingBulk, action: 'delete' })}
      />
    </PageShell>
  );
}
