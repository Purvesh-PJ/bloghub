import { Link } from 'react-router-dom';
import { PenLine, Search as SearchIcon } from 'lucide-react';

import { useStoriesManagement } from '../hooks/useStoriesManagement';
import { PageShell } from '../../../components/layout/PageShell';
import { StoryRow } from '../components/StoryRow';
import { ConfirmDialog, BulkActionBar } from '../../../components/shared';
import { FilterToolbar, DataView } from '../../../components/patterns';
import { Button, Card, Spinner, TableSkeleton, Pagination, Checkbox } from '../../../components/ui';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'public', label: 'Published' },
  { id: 'draft', label: 'Drafts' },
  { id: 'private', label: 'Private' },
];

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'title', label: 'Title A–Z' },
];

export function Stories() {
  const {
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
  } = useStoriesManagement();

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
      <FilterToolbar
        filters={FILTERS.map((f) => ({ ...f, count: counts[f.id] }))}
        activeFilter={filter}
        onFilterChange={(next) => resetToFirstPage(() => setFilter(next))}
        sortOptions={SORTS}
        sortValue={sort}
        onSortChange={(val) => resetToFirstPage(() => setSort(val))}
        sortAriaLabel="Sort stories"
        searchValue={query}
        onSearchChange={(val) => resetToFirstPage(() => setQuery(val))}
        onSearchClear={() => resetToFirstPage(() => setQuery(''))}
        searchPlaceholder="Search by title…"
      />

      <DataView
        isLoading={isLoading}
        skeleton={<TableSkeleton rows={5} hasCheckbox hasBadge />}
        isError={isError}
        error={error}
        errorTitle="Your stories did not load"
        onRetry={() => refetch()}
        isEmpty={posts.length === 0}
        emptyIcon={SearchIcon}
        emptyTitle={counts.all === 0 ? 'Nothing written yet' : 'No matching stories'}
        emptyDescription={
          counts.all === 0
            ? 'Drafts stay private until you publish them, so there is no risk in starting one.'
            : 'No stories match that filter. Try another tab, or clear the search.'
        }
        emptyAction={
          counts.all === 0 ? (
            <Button as={Link} to="/write" size="sm">
              <PenLine className="w-3.5 h-3.5 mr-1" /> Write your first story
            </Button>
          ) : undefined
        }
      >
        <Card tone="low" radius="xl" padding="sm" className="relative p-2">
          {isFetching && (
            <div
              role="status"
              aria-live="polite"
              className="absolute top-2 right-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold"
            >
              <Spinner size="12px" /> Updating…
            </div>
          )}

          {/* Select all row */}
          <div className="flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground border-b border-border/40">
            <Checkbox
              checked={allOnPageSelected}
              onChange={() =>
                setSelectedIds(
                  allOnPageSelected
                    ? selectedIds.filter((id) => !visibleIds.includes(id))
                    : [...new Set([...selectedIds, ...visibleIds])]
                )
              }
              aria-label="Select every story on this page"
              label="Select all on this page"
            />
          </div>

          <div className="divide-y divide-border/40">
            {posts.map((post) => (
              <StoryRow
                key={post._id}
                post={post}
                stats={statsByPost.get(String(post._id))}
                selected={selectedIds.includes(post._id)}
                onToggleSelected={toggleSelected}
                onDelete={() => setPendingDelete(post)}
                onSetVisibility={(newVisibility) =>
                  setVisibilityMutation.mutate({ post, newVisibility })
                }
              />
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="p-3 border-t border-border/40">
              <Pagination
                page={page}
                totalPages={pagination.pages}
                onPageChange={(next) => {
                  setPage(next);
                  setSelectedIds([]);
                }}
              />
            </div>
          )}
        </Card>
      </DataView>

      {/* Delete One Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this story?"
        description={
          pendingDelete ? (
            <>
              You are about to delete <strong>&ldquo;{pendingDelete.title}&rdquo;</strong>. This
              action cannot be undone and all reads, claps, and responses will be removed.
            </>
          ) : undefined
        }
        confirmText="Delete permanently"
        confirmVariant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete._id)}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(pendingBulk)}
        onOpenChange={(open) => !open && setPendingBulk(null)}
        title={`Delete ${pendingBulk?.length ?? 0} stories?`}
        description="Every selected story will be removed permanently, including their claps, views, and responses. This action cannot be undone."
        confirmText="Delete selected"
        confirmVariant="danger"
        isLoading={bulkMutation.isPending}
        onConfirm={() => pendingBulk && bulkMutation.mutate({ ids: pendingBulk, action: 'delete' })}
      />
    </PageShell>
  );
}
