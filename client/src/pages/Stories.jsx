import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  PenLine,
  Search as SearchIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Share2,
  Heart,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useDebounced } from '../hooks/useDebounced';
import { postService } from '../services/postService';
import { analyticsService } from '../services/analyticsService';
import { PageShell } from '../components/layout/PageShell';
import { ReadRateBar } from '../components/stats/ReadRateBar';
import {
  Button,
  Card,
  Input,
  Chip,
  Badge,
  Modal,
  EmptyState,
  ErrorState,
  DropdownMenu,
  Spinner,
  Skeleton,
  Pagination,
} from '../components/ui';
import { queryKeys } from '../services/queryKeys';
import { cn } from '../lib/utils';

function StoryRow({ post, stats, onDelete, onSetVisibility, selected, onToggleSelected }) {
  const navigate = useNavigate();
  const isPublic = post.visibility === 'public';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
    if (isPublic) {
      toast.success('Public link copied');
    } else {
      toast('Link copied — but this story is not published, so only you can open it', {
        icon: '🔒',
      });
    }
  };

  const visibilityActions = [
    { value: 'public', label: 'Publish story live', icon: <Globe className="w-3.5 h-3.5 mr-2" /> },
    { value: 'draft', label: 'Move to drafts', icon: <EyeOff className="w-3.5 h-3.5 mr-2" /> },
    { value: 'private', label: 'Make private', icon: <Lock className="w-3.5 h-3.5 mr-2" /> },
  ].filter((option) => option.value !== (post.visibility || 'draft'));

  const views = stats?.views ?? post.views?.length ?? 0;
  const reads = stats?.reads ?? 0;
  const rate = stats?.readRate ?? (views > 0 ? Math.round((reads / views) * 100) : 0);

  return (
    <div
      className={cn(
        'grid grid-cols-[28px_minmax(0,1fr)_44px] sm:grid-cols-[28px_minmax(0,1fr)_170px_96px] lg:grid-cols-[28px_minmax(0,1fr)_170px_110px_96px] items-center gap-4 sm:gap-6 p-4 rounded-xl transition-colors border-b border-[hsl(var(--border))/0.4] last:border-b-0',
        selected
          ? 'bg-[hsl(var(--primary))/0.12]'
          : 'hover:bg-[hsl(var(--muted))/0.5]'
      )}
    >
      {/* Select Cell */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelected(post._id)}
          aria-label={`Select ${post.title || 'Untitled'}`}
          className="w-4 h-4 rounded accent-[hsl(var(--primary))] cursor-pointer"
        />
      </div>

      {/* Title & Metadata Cell */}
      <div className="min-w-0">
        <Link
          to={`/post/${post._id}`}
          className="text-base font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors line-clamp-1 no-underline"
        >
          {post.title || 'Untitled'}
        </Link>
        <div className="flex items-center gap-2 mt-1 text-xs text-[hsl(var(--muted-foreground))] flex-wrap">
          <Badge
            variant={isPublic ? 'success' : post.visibility === 'private' ? 'warning' : 'neutral'}
          >
            {post.visibility || 'draft'}
          </Badge>
          <span>
            {(() => {
              const d = post.createdAt ? new Date(post.createdAt) : null;
              return d && !isNaN(d.getTime())
                ? formatDistanceToNow(d, { addSuffix: true })
                : 'recently';
            })()}
          </span>
          {post.tags?.[0] && <span>· #{post.tags[0]?.name ?? post.tags[0]}</span>}
        </div>
      </div>

      {/* Read Rate Bar Cell */}
      <div className="max-sm:col-start-2 max-sm:col-span-2 max-sm:mt-1">
        <ReadRateBar views={views} reads={reads} rate={rate} />
      </div>

      {/* Engagement Stats Cell */}
      <div className="hidden lg:flex items-center gap-4 text-sm text-[hsl(var(--muted-foreground))] tabular-nums">
        <span title="Total views" className="inline-flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-[hsl(var(--primary))]" /> {views}
        </span>
        <span title="Likes received" className="inline-flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-[hsl(var(--primary))]" /> {post.likes?.length ?? 0}
        </span>
      </div>

      {/* Row Actions Cell */}
      <div className="flex items-center justify-end">
        <DropdownMenu
          trigger={
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Actions for ${post.title || 'Untitled'}`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          }
        >
          <DropdownMenu.Item onSelect={() => navigate(`/edit/${post._id}`)}>
            <Pencil className="w-3.5 h-3.5 mr-2" /> Edit story
          </DropdownMenu.Item>

          <DropdownMenu.Item onSelect={() => navigate(`/post/${post._id}`)}>
            <ExternalLink className="w-3.5 h-3.5 mr-2" /> {isPublic ? 'View live story' : 'Preview as reader'}
          </DropdownMenu.Item>

          <DropdownMenu.Item onSelect={handleCopyLink}>
            <Share2 className="w-3.5 h-3.5 mr-2" /> {isPublic ? 'Copy public link' : 'Copy private link'}
          </DropdownMenu.Item>

          <DropdownMenu.Separator />
          <DropdownMenu.Label>Visibility</DropdownMenu.Label>

          {visibilityActions.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              onSelect={() => onSetVisibility(post, option.value)}
            >
              {option.icon} {option.label}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator />

          <DropdownMenu.Item tone="danger" onSelect={() => onDelete(post)}>
            <Trash2 className="w-3.5 h-3.5 mr-2 text-red-500" /> Delete story
          </DropdownMenu.Item>
        </DropdownMenu>
      </div>
    </div>
  );
}

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

  return (
    <PageShell>
      {/* Bulk actions banner */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap p-3 px-5 mb-4 rounded-2xl bg-[hsl(var(--primary))/0.12] border border-[hsl(var(--primary))/0.2]">
          <span className="text-sm font-semibold text-[hsl(var(--primary))] mr-auto">
            {selectedIds.length} selected on this page
          </span>
          <Button
            size="sm"
            variant="tonal"
            onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'public' })}
            disabled={bulkMutation.isPending}
          >
            <Globe className="w-3.5 h-3.5 mr-1" /> Publish
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'draft' })}
            disabled={bulkMutation.isPending}
          >
            <EyeOff className="w-3.5 h-3.5 mr-1" /> To drafts
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'private' })}
            disabled={bulkMutation.isPending}
          >
            <Lock className="w-3.5 h-3.5 mr-1" /> Make private
          </Button>
          <Button
            size="sm"
            variant="dangerTonal"
            onClick={() => setPendingBulk(selectedIds)}
            disabled={bulkMutation.isPending}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
            Cancel
          </Button>
        </div>
      )}

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
      <Modal
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this story?"
        description={
          pendingDelete
            ? `"${pendingDelete.title || 'Untitled'}" will be permanently removed, along with its comments and likes. This cannot be undone.`
            : ''
        }
      >
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate(pendingDelete._id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        open={Boolean(pendingBulk)}
        onOpenChange={(open) => !open && setPendingBulk(null)}
        title={`Delete ${pendingBulk?.length ?? 0} ${pendingBulk?.length === 1 ? 'story' : 'stories'}?`}
        description="They will be permanently removed, along with their comments and likes. This cannot be undone."
      >
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPendingBulk(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => bulkMutation.mutate({ ids: pendingBulk, action: 'delete' })}
            disabled={bulkMutation.isPending}
          >
            {bulkMutation.isPending ? 'Deleting…' : 'Delete all'}
          </Button>
        </Modal.Footer>
      </Modal>
    </PageShell>
  );
}
