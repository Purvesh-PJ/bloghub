import { Link } from 'react-router-dom';
import { PenLine, Search as SearchIcon } from 'lucide-react';

import { useStoriesManagement } from '../hooks/useStoriesManagement';
import { PageShell } from '../../../components/layout/PageShell';
import { StoryRow } from '../components/StoryRow';
import { ConfirmDialog, BulkActionBar } from '../../../components/shared';
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ErrorState,
  Spinner,
  TableSkeleton,
  Pagination,
  Select,
  SearchInput,
  Checkbox,
} from '../../../components/ui';

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
      <div className="flex items-center gap-2.5 flex-wrap p-3 rounded-2xl bg-card border border-border/60 mb-4">
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

        <div className="w-[180px] max-sm:w-full">
          <Select
            options={SORTS}
            value={sort}
            onValueChange={(val) => resetToFirstPage(() => setSort(val))}
            aria-label="Sort stories"
            density="compact"
          />
        </div>

        <div className="flex-1 min-w-[200px] max-w-[320px] ml-auto max-sm:ml-0 max-sm:max-w-full">
          <SearchInput
            placeholder="Search by title…"
            value={query}
            onChange={(e) => resetToFirstPage(() => setQuery(e.target.value))}
            onClear={() => resetToFirstPage(() => setQuery(''))}
            density="compact"
          />
        </div>
      </div>

      {isError ? (
        <ErrorState title="Your stories did not load" error={error} onRetry={() => refetch()} />
      ) : isLoading ? (
        <TableSkeleton rows={5} hasCheckbox hasBadge />
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
      )}

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
