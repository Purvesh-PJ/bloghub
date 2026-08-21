import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
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
  Surface,
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
import { text, media, clamp } from '../styles/theme/mixins';
import { queryKeys } from '../services/queryKeys';

/**
 * Stories — everything to do with managing what you have written.
 *
 * This lived inside the dashboard, under the metrics and beside a sidebar of insight cards,
 * on a page the navigation called "Dashboard & Stories". Two jobs on one screen: the
 * dashboard answers "how am I doing", this answers "what do I have and what do I do with
 * it". Splitting them is what lets the table have the whole width, and what makes each page
 * explainable in one sentence.
 */

/* ── Table ───────────────────────────────────────────────────────────────── */

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SearchField = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 320px;
  margin-left: auto;

  ${media.down('sm')`
    margin-left: 0;
    max-width: 100%;
  `}
`;

const SortSelect = styled.select`
  height: 38px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  color: ${({ theme }) => theme.colors.textPrimary};
  ${text('sm')}
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.lineStrong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accentSolid};
    outline-offset: 1px;
  }
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 170px 110px 96px;
  grid-template-areas: 'select title rate engagement actions';
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background ${({ theme }) => theme.transitions.fast};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentContainer : 'transparent'};

  &:hover {
    background: ${({ theme, $selected }) =>
      $selected ? theme.colors.accentContainer : theme.colors.surfaceContainer};
  }

  & + & {
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.lineSubtle};
  }

  ${media.down('lg')`
    grid-template-columns: 28px minmax(0, 1fr) 170px 96px;
    grid-template-areas: 'select title rate actions';
  `}

  ${media.down('sm')`
    grid-template-columns: 28px minmax(0, 1fr) 44px;
    grid-template-areas:
      'select title  actions'
      '.      rate   rate';
    gap: ${({ theme }) => theme.spacing.md};
  `}
`;

const SelectCell = styled.div`
  grid-area: select;
  display: flex;
  align-items: center;
`;

const ActionsCell = styled.div`
  grid-area: actions;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TitleCell = styled.div`
  grid-area: title;
  min-width: 0;
`;

const RateCell = styled.div`
  grid-area: rate;
`;

const EngagementCell = styled.div`
  grid-area: engagement;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  ${media.down('lg')`display: none;`}
`;

const RowTitle = styled(Link)`
  ${text('md', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(1)}

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const RowMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};

  > span {
    white-space: nowrap;
  }
`;

const Stat = styled.span`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  font-variant-numeric: tabular-nums;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.accentSolid};
  cursor: pointer;
`;

const SelectAllRow = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const BulkBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.accentContainer};
  border: 1px solid ${({ theme }) => theme.colors.accentLine};
`;

const BulkCount = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.accentText};
  margin-right: auto;
`;

const FetchingBar = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: 1;

  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};

  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${text('xs')}
  font-weight: 600;
`;

/* ── Row ─────────────────────────────────────────────────────────────────── */

function StoryRow({ post, stats, onDelete, onSetVisibility, selected, onToggleSelected }) {
  const navigate = useNavigate();
  const isPublic = post.visibility === 'public';

  // The link works for the author either way, but for anyone else an unpublished post is a
  // 404 — so saying "public link" and reporting success was a trap.
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
    { value: 'public', label: 'Publish story live', icon: <Globe size={14} /> },
    { value: 'draft', label: 'Move to drafts', icon: <EyeOff size={14} /> },
    { value: 'private', label: 'Make private', icon: <Lock size={14} /> },
  ].filter((option) => option.value !== (post.visibility || 'draft'));

  const views = stats?.views ?? post.views?.length ?? 0;
  const reads = stats?.reads ?? 0;
  const rate = stats?.readRate ?? (views > 0 ? Math.round((reads / views) * 100) : 0);

  return (
    <Row $selected={selected}>
      <SelectCell>
        <Checkbox
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelected(post._id)}
          aria-label={`Select ${post.title || 'Untitled'}`}
        />
      </SelectCell>

      <TitleCell>
        <RowTitle to={`/post/${post._id}`}>{post.title || 'Untitled'}</RowTitle>
        <RowMeta>
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
        </RowMeta>
      </TitleCell>

      <RateCell>
        <ReadRateBar views={views} reads={reads} rate={rate} />
      </RateCell>

      <EngagementCell>
        <Stat title="Total views">
          <Eye /> {views}
        </Stat>
        <Stat title="Likes received">
          <Heart /> {post.likes?.length ?? 0}
        </Stat>
      </EngagementCell>

      <ActionsCell>
        <DropdownMenu
          trigger={
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Actions for ${post.title || 'Untitled'}`}
            >
              <MoreHorizontal size={16} />
            </Button>
          }
        >
          <DropdownMenu.Item onSelect={() => navigate(`/edit/${post._id}`)}>
            <Pencil size={14} /> Edit story
          </DropdownMenu.Item>

          <DropdownMenu.Item onSelect={() => navigate(`/post/${post._id}`)}>
            <ExternalLink size={14} /> {isPublic ? 'View live story' : 'Preview as reader'}
          </DropdownMenu.Item>

          <DropdownMenu.Item onSelect={handleCopyLink}>
            <Share2 size={14} /> {isPublic ? 'Copy public link' : 'Copy private link'}
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

          <DropdownMenu.Item $tone="danger" onSelect={() => onDelete(post)}>
            <Trash2 size={14} /> Delete story
          </DropdownMenu.Item>
        </DropdownMenu>
      </ActionsCell>
    </Row>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

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

  // Filtering, sorting and paging happen on the server, so they belong in the query key —
  // changing any of them is a different request, not a different view of the same data.
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

  // Per-post view and read figures, which the list itself does not carry.
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
    // Only the field being changed is sent, so an edit made in another tab is not overwritten
    // by a stale copy held in this one.
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

  // Selection is per page; leaving the page drops it rather than acting on rows the reader
  // can no longer see.
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
      {selectedIds.length > 0 && (
        <BulkBar>
          <BulkCount>{selectedIds.length} selected on this page</BulkCount>
          <Button
            size="sm"
            variant="tonal"
            onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'public' })}
            disabled={bulkMutation.isPending}
          >
            <Globe size={14} /> Publish
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'draft' })}
            disabled={bulkMutation.isPending}
          >
            <EyeOff size={14} /> To drafts
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'private' })}
            disabled={bulkMutation.isPending}
          >
            <Lock size={14} /> Make private
          </Button>
          <Button
            size="sm"
            variant="dangerTonal"
            onClick={() => setPendingBulk(selectedIds)}
            disabled={bulkMutation.isPending}
          >
            <Trash2 size={14} /> Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
            Cancel
          </Button>
        </BulkBar>
      )}

      <Toolbar>
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

        <SortSelect
          value={sort}
          onChange={(e) => resetToFirstPage(() => setSort(e.target.value))}
          aria-label="Sort stories"
        >
          {SORTS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </SortSelect>

        <SearchField>
          <Input
            icon={<SearchIcon />}
            placeholder="Search by title…"
            value={query}
            onChange={(e) => resetToFirstPage(() => setQuery(e.target.value))}
          />
        </SearchField>
      </Toolbar>

      {/*
        The failure branch is first and deliberate: falling through to the empty state told a
        writer with fifty stories that they had never written anything, and invited them to start.
      */}
      {isError ? (
        <ErrorState title="Your stories did not load" error={error} onRetry={() => refetch()} />
      ) : isLoading ? (
        <Surface $tone="low" $radius="xl" $padding="md" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 8px',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                <Skeleton $width={20} $height={20} $radius="xs" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                  <Skeleton $width="60%" $height={16} $radius="xs" />
                  <Skeleton $width="30%" $height={12} $radius="xs" />
                </div>
              </div>
              <Skeleton $width={60} $height={24} $radius="pill" />
            </div>
          ))}
        </Surface>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title={counts.all === 0 ? 'Nothing written yet' : 'No matching stories'}
          actions={
            counts.all === 0 ? (
              <Button as={Link} to="/write" size="sm">
                <PenLine size={14} /> Write your first story
              </Button>
            ) : undefined
          }
        >
          {counts.all === 0
            ? 'Drafts stay private until you publish them, so there is no risk in starting one.'
            : 'No stories match that filter. Try another tab, or clear the search.'}
        </EmptyState>
      ) : (
        <Surface $tone="low" $radius="xl" $padding="sm" style={{ position: 'relative' }}>
          {/* A refetch keeps the previous rows on screen, so without this the list simply sat
              there after a filter or a keystroke with nothing to say it was working. */}
          {isFetching && (
            <FetchingBar role="status" aria-live="polite">
              <Spinner size="12px" /> Updating…
            </FetchingBar>
          )}

          <SelectAllRow>
            <Checkbox
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
            />
            <span>Select all on this page</span>
          </SelectAllRow>

          <Rows>
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
          </Rows>

          {pagination && (
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
          )}
        </Surface>
      )}

      <Modal
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this story?"
        description={
          pendingDelete
            ? `"${pendingDelete.title || 'Untitled'}" will be permanently removed, along with its comments and likes. This cannot be undone.`
            : ''
        }
      >
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
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
        </div>
      </Modal>

      <Modal
        open={!!pendingBulk}
        onOpenChange={(open) => !open && setPendingBulk(null)}
        title={`Delete ${pendingBulk?.length ?? 0} ${pendingBulk?.length === 1 ? 'story' : 'stories'}?`}
        description="They will be permanently removed, along with their comments and likes. This cannot be undone."
      >
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
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
        </div>
      </Modal>
    </PageShell>
  );
}
