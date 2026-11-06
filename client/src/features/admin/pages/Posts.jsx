import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search as SearchIcon, Trash2, FileText, Globe, Lock, FileEdit } from 'lucide-react';
import toast from 'react-hot-toast';

import { postService } from '../../posts/services/postService';
import { useDebounced } from '../../posts/hooks/useDebounced';
import { Section } from '../../../components/layout/PageShell';
import { Card, Input, Chip, EmptyState, Skeleton } from '../../../components/ui';
import { ConfirmDialog, BulkActionBar } from '../../../components/shared';
import { AdminPostsTable } from '../components/AdminPostsTable';
import { queryKeys } from '../../../config/queryKeys';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'public', label: 'Published' },
  { id: 'draft', label: 'Drafts' },
  { id: 'private', label: 'Private' },
];

const PAGE_SIZE = 20;

export function AdminPosts() {
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingBulkDelete, setPendingBulkDelete] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const debouncedQuery = useDebounced(query, 300);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(filter !== 'all' && { visibility: filter }),
      ...(debouncedQuery.trim() && { q: debouncedQuery.trim() }),
    }),
    [page, filter, debouncedQuery]
  );

  const filterKey = `${filter}|${debouncedQuery.trim()}`;
  const [syncedFilter, setSyncedFilter] = useState(filterKey);
  if (syncedFilter !== filterKey) {
    setSyncedFilter(filterKey);
    setPage(1);
    setSelectedIds([]);
  }

  const { data: postsResponse, isLoading } = useQuery({
    queryKey: queryKeys.posts.moderation(listParams),
    queryFn: () => postService.getAllPosts(listParams),
    placeholderData: (previous) => previous,
  });

  const refreshLists = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.moderation() });
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.site() });
  };

  const deleteMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      refreshLists();
      setPendingDelete(null);
      toast.success('Post deleted');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not delete the post'),
  });

  const bulkMutation = useMutation({
    mutationFn: ({ ids, action }) => postService.bulkUpdate(ids, action),
    onSuccess: (response) => {
      refreshLists();
      setSelectedIds([]);
      setPendingBulkDelete(null);
      toast.success(response?.message || 'Stories updated');
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Could not update those stories'),
  });

  const visible = useMemo(() => postsResponse?.data || [], [postsResponse]);
  const pagination = postsResponse?.pagination ?? { page: 1, pages: 1, total: 0 };
  const counts = postsResponse?.counts ?? { all: 0, public: 0, draft: 0, private: 0 };

  const visibleIds = visible.map((post) => post._id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const toggleSelected = (id) =>
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    );

  const bulkActions = [
    {
      label: 'Publish',
      icon: <Globe className="w-3.5 h-3.5" />,
      variant: 'secondary',
      onClick: () => bulkMutation.mutate({ ids: selectedIds, action: 'public' }),
      disabled: bulkMutation.isPending,
    },
    {
      label: 'Unpublish',
      icon: <FileEdit className="w-3.5 h-3.5" />,
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
      variant: 'danger',
      onClick: () => setPendingBulkDelete(selectedIds),
      disabled: bulkMutation.isPending,
    },
  ];

  if (isLoading) {
    return (
      <div aria-hidden="true">
        <Card tone="low" radius="xl" padding="lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-border/40 last:border-b-0"
            >
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton width="55%" height={16} className="rounded" />
                <Skeleton width="25%" height={12} className="rounded" />
              </div>
              <Skeleton width={60} height={22} className="rounded-full" />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <>
      <Section>
        {/* Bulk action banner */}
        <BulkActionBar
          selectedCount={selectedIds.length}
          label={`${selectedIds.length} selected on this page`}
          variant="banner"
          actions={bulkActions}
          clearLabel="Clear"
          onClear={() => setSelectedIds([])}
        />

        {/* Toolbar with filter chips and search */}
        <div className="flex items-center gap-2.5 flex-wrap p-3 rounded-2xl bg-card border border-border/60 mb-4">
          {FILTERS.map((option) => (
            <Chip
              key={option.id}
              selected={filter === option.id}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
              {counts[option.id] > 0 ? ` (${counts[option.id]})` : ''}
            </Chip>
          ))}

          <div className="flex-1 min-w-[200px] max-w-[320px] ml-auto max-sm:ml-0 max-sm:max-w-full">
            <Input
              icon={<SearchIcon />}
              placeholder="Search by title"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search posts by title"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState icon={FileText} title="Nothing here">
            {query || filter !== 'all'
              ? 'No posts match that filter. Try another one, or clear the search.'
              : 'Nobody has written anything yet.'}
          </EmptyState>
        ) : (
          <AdminPostsTable
            visible={visible}
            selectedIds={selectedIds}
            onToggleSelected={toggleSelected}
            allVisibleSelected={allVisibleSelected}
            onToggleSelectAll={() =>
              setSelectedIds(
                allVisibleSelected
                  ? selectedIds.filter((id) => !visibleIds.includes(id))
                  : [...new Set([...selectedIds, ...visibleIds])]
              )
            }
            onDelete={setPendingDelete}
            pagination={pagination}
            onPageChange={(next) => {
              setPage(next);
              setSelectedIds([]);
            }}
          />
        )}
      </Section>

      <ConfirmDialog
        open={Boolean(pendingBulkDelete)}
        onOpenChange={(open) => !open && setPendingBulkDelete(null)}
        title={`Delete ${pendingBulkDelete?.length ?? 0} ${
          pendingBulkDelete?.length === 1 ? 'story' : 'stories'
        }?`}
        description="They and their responses will be removed. This cannot be undone."
        confirmText={bulkMutation.isPending ? 'Deleting…' : 'Delete all'}
        confirmVariant="danger"
        loading={bulkMutation.isPending}
        onConfirm={() => bulkMutation.mutate({ ids: pendingBulkDelete, action: 'delete' })}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this post?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" by ${pendingDelete.user?.username || 'an unknown author'} and its comments will be removed. This cannot be undone.`
            : ''
        }
        confirmText={deleteMutation.isPending ? 'Deleting…' : 'Delete'}
        confirmVariant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(pendingDelete._id)}
      />
    </>
  );
}
