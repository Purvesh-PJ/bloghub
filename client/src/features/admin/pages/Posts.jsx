import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search as SearchIcon, Trash2, FileText, Globe, Lock, FileEdit } from 'lucide-react';
import toast from 'react-hot-toast';

import { postService } from '../../posts/services/postService';
import { useDebounced } from '../../posts/hooks/useDebounced';
import { Section } from '../../../components/layout/PageShell';
import { TableSkeleton } from '../../../components/ui';
import { ConfirmDialog, BulkActionBar } from '../../../components/shared';
import { FilterToolbar, DataView } from '../../../components/patterns';
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
        <FilterToolbar
          filters={FILTERS.map((option) => ({ ...option, count: counts[option.id] }))}
          activeFilter={filter}
          onFilterChange={setFilter}
          searchValue={query}
          onSearchChange={setQuery}
          onSearchClear={() => setQuery('')}
          searchPlaceholder="Search by title"
          searchAriaLabel="Search posts by title"
        />

        <DataView
          isLoading={isLoading}
          skeleton={<TableSkeleton rows={6} hasCheckbox hasBadge />}
          isEmpty={visible.length === 0}
          emptyIcon={FileText}
          emptyTitle="Nothing here"
          emptyDescription={
            query || filter !== 'all'
              ? 'No posts match that filter. Try another one, or clear the search.'
              : 'Nobody has written anything yet.'
          }
        >
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
        </DataView>
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
