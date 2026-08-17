import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import {
  PenLine,
  BookOpen,
  Search as SearchIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  TrendingUp,
  Eye,
  EyeOff,
  Globe,
  Share2,
  CheckCircle2,
  Heart,
  BarChart2,
  FileText,
  User,
  Sparkles,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { useDebounced } from '../hooks/useDebounced';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { postService } from '../services/postService';
import { analyticsService } from '../services/analyticsService';
import { PageShell, Section } from '../components/layout/PageShell';
import { ReadRateBar } from '../components/stats/ReadRateBar';
import {
  Button,
  Surface,
  Card,
  Input,
  Chip,
  Badge,
  Modal,
  Loading,
  EmptyState,
  ErrorState,
  DropdownMenu,
  Spinner,
  Avatar,
} from '../components/ui';
import { text, label as labelStyle, media, clamp, display } from '../styles/theme/mixins';

/* ── Executive Metrics Grid ─────────────────────────────────────────────── */

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  ${media.down('lg')`grid-template-columns: repeat(2, 1fr);`}
  ${media.down('sm')`grid-template-columns: 1fr;`}
`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentLine};
    box-shadow: 0 6px 20px -4px rgba(14, 165, 233, 0.12);
    transform: translateY(-2px);
  }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const MetricValue = styled.div`
  ${display('sm')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  margin-top: 4px;
`;

const MetricSub = styled.div`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* ── Creator Profile Banner ─────────────────────────────────────────────── */

const CreatorBanner = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surfaceContainerLow} 0%,
    ${({ theme }) => theme.colors.accentContainer} 100%
  );
  border: 1px solid ${({ theme }) => theme.colors.accentLine};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CreatorDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const CreatorName = styled.h2`
  ${text('xl', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CreatorBio = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 520px;
`;

const BannerActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

/* ── Stories Table ───────────────────────────────────────────────────────── */

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SearchField = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  margin-left: auto;

  ${media.down('sm')`
    margin-left: 0;
    max-width: 100%;
  `}
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: grid;
  /*
    The title takes the slack. It used to sit in a 1fr beside 380px of fixed columns inside a
    two-thirds-width panel, which left it roughly 120px — every story rendered as "The
    Chemistry of…" and none could be told apart. The panel is full width now and these
    columns are tighter.
  */
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

/* Fixed width, so the publish shortcut cannot spill left over the engagement figures. */
const ActionsCell = styled.div`
  grid-area: actions;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SelectCell = styled.div`
  grid-area: select;
  display: flex;
  align-items: center;
`;

/* Sits over the table's top edge while a refetch is in flight. */
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

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.accentSolid};
  cursor: pointer;
`;

/* Sits above the table when something is selected, replacing the filter row. */
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

const Pager = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const PagerLabel = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`;

const SortSelect = styled.select`
  height: 36px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  color: ${({ theme }) => theme.colors.textPrimary};
  ${text('sm')}
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accentSolid};
    outline-offset: 1px;
  }
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

  /* "about 1 month ago" was breaking across three lines and doubling the row height. */
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

/*
  The insight cards sit under the table rather than in a sidebar beside it. As a column they
  took a third of the width from the one thing this page is for — managing stories — which is
  what squeezed every title down to an ellipsis.
*/
const Aside = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;
  margin-top: ${({ theme }) => theme.spacing['2xl']};

  ${media.down('md')`grid-template-columns: 1fr;`}
`;

const AsideLabel = styled.span`
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const TopPost = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: ${({ theme }) => theme.spacing.md} 0;
  color: inherit;
  text-decoration: none;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  }

  &:hover h4 {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const TopPostTitle = styled.h4`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(1)}
`;

/* ── Reading Grid ────────────────────────────────────────────────────────── */

const ReadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  ${media.down('lg')`grid-template-columns: 1fr 1fr;`}
  ${media.down('sm')`grid-template-columns: 1fr;`}
`;

const ReadingItem = styled(Link)`
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentLine};
    transform: translateY(-2px);
  }
`;

const ReadingTitle = styled.h4`
  ${text('md', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(2)}
`;

const ReadingMeta = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: auto;
`;

/* Replaces the metric grid until the account has written something worth measuring. */
const FirstRun = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px dashed ${({ theme }) => theme.colors.accentLine};
`;

const FirstRunTitle = styled.h2`
  ${display('xs')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FirstRunBody = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 62ch;
  line-height: 1.6;
`;

const TipText = styled.p`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-top: 8px;
`;

/* ── Row Component ───────────────────────────────────────────────────────── */

function PostRow({ post, stats, onDelete, onSetVisibility, selected, onToggleSelected }) {
  const navigate = useNavigate();

  const isPublic = post.visibility === 'public';

  // The link works for the author either way, but for anyone else an unpublished post is a
  // 404. Calling it a "public link" and reporting success made that a trap: a writer would
  // send it to somebody and be told the story does not exist.
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

  // Every visibility the post is not currently in, so "private" is reachable from the table.
  // The menu previously toggled only between public and draft, which left the Private tab
  // filtering for a state nothing here could produce.
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
            variant={
              post.visibility === 'public'
                ? 'success'
                : post.visibility === 'private'
                  ? 'warning'
                  : 'neutral'
            }
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
          {post.categories?.[0] && <span>· {post.categories[0]?.name ?? post.categories[0]}</span>}
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
        {/*
          DropdownMenu takes children — it never had an `items` prop. Passing one meant the
          menu rendered empty, so Edit, Delete, every visibility change, copy link and preview
          were all unreachable: a story could be written and then never managed. Header and
          the admin table had always used the children form; only this table had not.
        */}
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

/* ── Main Dashboard ──────────────────────────────────────────────────────── */

const FILTERS = [
  { id: 'all', label: 'All Stories' },
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

export function Dashboard() {
  const { user } = useAuth();
  const { avatarUrl, bio } = useCurrentUser();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingBulk, setPendingBulk] = useState(null);

  // Typing in the search box should not fire a request per keystroke.
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
    isLoading: postsLoading,
    // isFetching, not isLoading: a filter or search change refetches with the previous rows
    // still on screen, so isLoading is false and nothing would otherwise indicate the wait.
    isFetching: postsFetching,
    isError: postsFailed,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ['myPosts', listParams],
    queryFn: () => postService.getMyPosts(listParams),
    placeholderData: (previous) => previous, // keeps the table on screen while paging
  });

  /*
    These two used to name service methods that did not exist — `analyticsService.getMyAnalytics`
    and `userService.getReadingList` were both undefined, so every metric read zero, every
    read-rate bar sat empty, and "Continue Reading" never showed anything. The data was being
    computed and returned by the server the whole time; nothing was asking for it.
  */
  const {
    data: analyticsData,
    isPending: analyticsPending,
    isError: analyticsFailed,
  } = useQuery({
    queryKey: ['myAnalytics'],
    queryFn: analyticsService.getMyAnalytics,
  });

  const {
    data: readingData,
    isLoading: readingLoading,
    isError: readingFailed,
    error: readingError,
    refetch: refetchReading,
  } = useQuery({
    queryKey: ['readingActivity'],
    queryFn: analyticsService.getReadingActivity,
  });

  const refreshLists = () => {
    queryClient.invalidateQueries({ queryKey: ['myPosts'] });
    queryClient.invalidateQueries({ queryKey: ['myAnalytics'] });
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const VISIBILITY_MESSAGE = {
    public: 'Story published live! 🎉',
    draft: 'Story moved to drafts.',
    private: 'Story is now private.',
  };

  const setVisibilityMutation = useMutation({
    // Only the field being changed is sent. Replaying the whole post back meant an edit made
    // in another tab could be overwritten by a stale copy held in this one.
    mutationFn: ({ post, newVisibility }) =>
      postService.updatePost(post._id, { visibility: newVisibility }),
    onSuccess: (_, { newVisibility }) => {
      refreshLists();
      toast.success(VISIBILITY_MESSAGE[newVisibility] ?? 'Story updated.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not update story visibility');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      refreshLists();
      toast.success('Story deleted successfully');
      setPendingDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not delete story');
    },
  });

  const bulkMutation = useMutation({
    mutationFn: ({ ids, action }) => postService.bulkUpdate(ids, action),
    onSuccess: (response) => {
      refreshLists();
      setSelectedIds([]);
      setPendingBulk(null);
      toast.success(response?.message || 'Stories updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not update those stories');
    },
  });

  const posts = useMemo(() => (Array.isArray(postsData?.data) ? postsData.data : []), [postsData]);
  const pagination = postsData?.pagination;
  // Counts come from the server and describe every post, not just the page on screen.
  const counts = postsData?.counts ?? { all: 0, public: 0, draft: 0, private: 0 };

  const analytics = analyticsData?.data;
  const unfinished = useMemo(() => readingData?.data?.unfinished ?? [], [readingData]);

  const statsByPost = useMemo(() => {
    const map = new Map();
    (analytics?.postsAnalytics ?? []).forEach((entry) => map.set(String(entry.postId), entry));
    return map;
  }, [analytics]);

  const topFinished = useMemo(() => {
    return [...(analytics?.postsAnalytics ?? [])]
      .filter((entry) => (entry.views || 0) > 0)
      .sort((a, b) => (b.readRate || 0) - (a.readRate || 0))
      .slice(0, 4);
  }, [analytics]);

  // Selection is per page; leaving the page drops it rather than acting on rows no longer
  // in front of the reader.
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

  const firstName = user?.username?.split(' ')[0] || user?.username || 'Creator';
  // Only once the list has actually loaded — an outage must not be mistaken for a new account.
  const isNewAccount =
    !postsFailed && !postsLoading && counts.all === 0 && !query && filter === 'all';

  if (postsLoading) {
    return (
      <PageShell>
        <Card style={{ height: 110, marginBottom: 24, opacity: 0.6 }} />
        <MetricGrid>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} style={{ height: 110, opacity: 0.6 }} />
          ))}
        </MetricGrid>
        <Card style={{ height: 260, opacity: 0.6 }} />
      </PageShell>
    );
  }

  // Straight from the analytics endpoint. Rendered as em dashes until it resolves rather
  // than as zeroes: the stories query settles first, so a hard 0 would appear in all four
  // cards and then jump to the real figure, reading as "your stats are gone" every load.
  const metric = (value, suffix = '') => {
    if (analyticsFailed) return '—';
    if (analyticsPending) return '…';
    return `${value ?? 0}${suffix}`;
  };

  return (
    <PageShell>
      {/* ── Creator Profile Header ────────────────────────────────────────── */}
      <CreatorBanner>
        <CreatorInfo>
          {/* The real avatar, not initials-only. `bio` likewise comes from the account
              rather than the auth payload, which never carried one. */}
          <Avatar src={avatarUrl} name={user?.username} size="lg" />
          <CreatorDetails>
            <CreatorName>
              Welcome back, {firstName} <Sparkles size={16} />
            </CreatorName>
            <CreatorBio>
              {bio ||
                'Manage your published stories, draft new ideas, and monitor reader engagement.'}
            </CreatorBio>
          </CreatorDetails>
        </CreatorInfo>

        {/*
          "Write New Story" was here as well as in the sidebar and the topbar — three copies
          of one action on a single screen — and Settings twice. What is left is the one thing
          the sidebar does not offer: seeing the profile the way a reader sees it.
        */}
        <BannerActions>
          {(user?._id || user?.user_id) && (
            <Button as={Link} to={`/user/${user._id || user.user_id}`} variant="secondary">
              <User /> View public profile
            </Button>
          )}
        </BannerActions>
      </CreatorBanner>

      {/*
        A brand-new account has nothing to measure, so four cards of zeroes and an empty
        table told it only that it was empty. Until the first story exists, the space says
        what to do instead of reporting nothing.
      */}
      {isNewAccount ? (
        <FirstRun>
          <FirstRunTitle>Publish your first story</FirstRunTitle>
          <FirstRunBody>
            Write in Markdown with a live preview. Save it as a draft while you work — only you can
            see a draft — and publish when you are ready. Views and read-through appear here once
            readers arrive.
          </FirstRunBody>
          <Button as={Link} to="/write">
            <PenLine /> Start writing
          </Button>
        </FirstRun>
      ) : (
        <MetricGrid>
          <MetricCard>
            <MetricHeader>
              <span>Total Story Views</span>
              <Eye />
            </MetricHeader>
            <MetricValue>{metric(analytics?.totalViews)}</MetricValue>
            <MetricSub>
              {analyticsFailed ? 'Could not load' : 'Across all published articles'}
            </MetricSub>
          </MetricCard>

          <MetricCard>
            <MetricHeader>
              <span>Total Reads Finished</span>
              <CheckCircle2 />
            </MetricHeader>
            <MetricValue>{metric(analytics?.totalReads)}</MetricValue>
            <MetricSub>
              {analyticsFailed ? 'Could not load' : 'Readers who reached the conclusion'}
            </MetricSub>
          </MetricCard>

          <MetricCard>
            <MetricHeader>
              <span>Avg Read-Through %</span>
              <BarChart2 />
            </MetricHeader>
            <MetricValue>{metric(analytics?.readRate, '%')}</MetricValue>
            <MetricSub>
              {analyticsFailed ? 'Could not load' : 'True reader engagement score'}
            </MetricSub>
          </MetricCard>

          <MetricCard>
            <MetricHeader>
              <span>Published Stories</span>
              <FileText />
            </MetricHeader>
            <MetricValue>{counts.public}</MetricValue>
            <MetricSub>
              {counts.draft} draft{counts.draft === 1 ? '' : 's'} in progress
            </MetricSub>
          </MetricCard>
        </MetricGrid>
      )}

      <Section title="Your Stories">
        {/*
            The bulk bar sits above the toolbar rather than replacing it. Swapping them out
            hid which filter was active and removed any way to change it without first
            abandoning the selection.
          */}
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
              // Selection is cleared here too. Without it, selecting rows and then
              // searching left the selection pointing at posts no longer on screen —
              // so "Delete" acted on stories the reader could not see.
              onChange={(e) => resetToFirstPage(() => setQuery(e.target.value))}
            />
          </SearchField>
        </Toolbar>

        {/*
            The failure branch comes first and is deliberate. Falling through to the empty
            state meant an outage told a writer with fifty posts that they had never written
            anything, and invited them to start.
          */}
        {postsFailed ? (
          <ErrorState
            title="Your stories did not load"
            error={postsError}
            onRetry={() => refetchPosts()}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title={counts.all === 0 ? 'No stories written yet' : 'No matching stories'}
          >
            {counts.all === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 8,
                }}
              >
                <span>You haven't published or drafted any stories yet. Start writing today!</span>
                <Button as={Link} to="/write" size="sm">
                  <PenLine size={14} /> Start Writing
                </Button>
              </div>
            ) : (
              'No posts match that filter. Try selecting another tab or clear search.'
            )}
          </EmptyState>
        ) : (
          <Surface $tone="low" $radius="xl" $padding="sm" style={{ position: 'relative' }}>
            {/*
                A refetch keeps the previous rows on screen, so without this the list simply
                sat there after a filter or a keystroke with nothing to say it was working.
              */}
            {postsFetching && (
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
                <PostRow
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

            {pagination && pagination.pages > 1 && (
              <Pager>
                <PagerLabel>
                  Page {pagination.page} of {pagination.pages} · {pagination.total} stories
                </PagerLabel>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((n) => n - 1);
                      setSelectedIds([]);
                    }}
                  >
                    <ChevronLeft size={14} /> Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={page >= pagination.pages}
                    onClick={() => {
                      setPage((n) => n + 1);
                      setSelectedIds([]);
                    }}
                  >
                    Next <ChevronRight size={14} />
                  </Button>
                </div>
              </Pager>
            )}
          </Surface>
        )}
      </Section>

      <Aside>
        {topFinished.length > 0 && (
          <Card tone="low" radius="xl">
            <AsideLabel>
              <TrendingUp /> Highest Completion Rate
            </AsideLabel>
            <div style={{ marginTop: 8 }}>
              {topFinished.map((entry) => (
                <TopPost key={String(entry.postId)} to={`/post/${entry.postId}`}>
                  <TopPostTitle>{entry.title}</TopPostTitle>
                  <ReadRateBar views={entry.views} reads={entry.reads} rate={entry.readRate} />
                </TopPost>
              ))}
            </div>
          </Card>
        )}

        <Card tone="low" radius="xl">
          <AsideLabel>
            <Sparkles /> Quick Creator Tip
          </AsideLabel>
          <TipText>
            Articles with a clear table of contents, high-quality cover photo, and 3–5 min read time
            achieve a <strong>24% higher completion rate</strong> on BlogHub.
          </TipText>
        </Card>
      </Aside>

      {/* ── Reading Activity ──────────────────────────────────────────────── */}
      <Section
        title="Continue Reading"
        note={unfinished.length > 0 ? 'Articles you opened and were reading recently.' : undefined}
      >
        {readingLoading ? (
          <Loading text="Loading reading activity…" />
        ) : readingFailed ? (
          <ErrorState
            title="Reading activity did not load"
            error={readingError}
            onRetry={() => refetchReading()}
          />
        ) : unfinished.length === 0 ? (
          <EmptyState icon={BookOpen} title="No articles half-read">
            Stories you open to read will be bookmarked here so you can continue anytime.
          </EmptyState>
        ) : (
          <ReadingGrid>
            {unfinished.map(({ post, lastOpenedAt }) => {
              const d = lastOpenedAt ? new Date(lastOpenedAt) : null;
              const formattedDate =
                d && !isNaN(d.getTime()) ? formatDistanceToNow(d, { addSuffix: true }) : 'recently';
              return (
                <ReadingItem key={post._id} to={`/post/${post._id}`}>
                  <ReadingTitle>{post.title}</ReadingTitle>
                  <ReadingMeta>
                    {post.user?.username ? `${post.user.username} · ` : ''}
                    opened {formattedDate}
                  </ReadingMeta>
                </ReadingItem>
              );
            })}
          </ReadingGrid>
        )}
      </Section>

      {/* ── Delete Modal ──────────────────────────────────────────────────── */}
      <Modal
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this story?"
        description={
          pendingDelete
            ? `"${pendingDelete.title || 'Untitled'}" will be permanently removed. This cannot be undone.`
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

      {/* ── Bulk Delete Modal ─────────────────────────────────────────────── */}
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
