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
  Compass,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { analyticsService } from '../services/analyticsService';
import { PageShell, PageHeader, Section } from '../components/layout/PageShell';
import { ReadRateBar, ReadRateHeadline } from '../components/stats/ReadRateBar';
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
  DropdownMenu,
} from '../components/ui';
import { text, label as labelStyle, media, clamp } from '../styles/theme/mixins';

/**
 * Dashboard — the one page for "what am I doing here".
 *
 * This replaces /profile, /my-posts and /analytics, which were three views of the same
 * question. /profile and /my-posts showed the identical four counts and the identical
 * visibility split, one as cards and one as a table; /analytics sat apart from both and
 * showed likes, while discarding the read figures it had already fetched.
 *
 * The numbers now sit *on* the posts they describe, because a read-through rate means
 * nothing without knowing which piece earned it.
 *
 * It also serves an account that only reads. Every panel above the fold used to be built
 * from posts you had written, so a reader signed in and found four empty pages.
 */

/* ── Writer: the posts table ─────────────────────────────────────────────── */

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

/* Pushed to the end of the toolbar so the filters stay left-aligned with the list. */
const SearchField = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  margin-left: auto;
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
`;

/*
  Read rate is the point of this page, so it is the last thing to give way. Wide shows
  everything; below lg the likes column goes; below sm the bar drops under the title rather
  than disappearing, because on a phone it is still the figure worth reading.
*/
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px 132px 40px;
  grid-template-areas: 'title rate engagement actions';
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }

  & + & {
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.lineSubtle};
  }

  ${media.down('lg')`
    grid-template-columns: 1fr 200px 40px;
    grid-template-areas: 'title rate actions';
  `}

  ${media.down('sm')`
    grid-template-columns: 1fr 40px;
    grid-template-areas:
      'title actions'
      'rate  rate';
    gap: ${({ theme }) => theme.spacing.md};
  `}
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
`;

const Stat = styled.span`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  font-variant-numeric: tabular-nums;
`;

const RowActions = styled.div`
  grid-area: actions;
  display: flex;
  justify-content: flex-end;
`;

const MenuTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerHigh};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const VISIBILITY_TONE = { public: 'success', draft: 'warning', private: 'neutral' };
const VISIBILITY_LABEL = { public: 'Published', draft: 'Draft', private: 'Private' };

function PostRow({ post, stats, onDelete }) {
  const navigate = useNavigate();
  const visibility = post.visibility || 'draft';

  return (
    <Row>
      <TitleCell>
        <RowTitle to={visibility === 'public' ? `/post/${post._id}` : `/edit/${post._id}`}>
          {post.title || 'Untitled'}
        </RowTitle>
        <RowMeta>
          <Badge variant={VISIBILITY_TONE[visibility]}>{VISIBILITY_LABEL[visibility]}</Badge>
          <span>
            {post.createdAt
              ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
              : ''}
          </span>
        </RowMeta>
      </TitleCell>

      <RateCell>
        {visibility === 'public' ? (
          <ReadRateBar views={stats?.views} reads={stats?.reads} rate={stats?.readRate} />
        ) : (
          <Stat style={{ opacity: 0.6 }}>Not published</Stat>
        )}
      </RateCell>

      <EngagementCell>
        <Stat>
          {post.likes?.length || 0} likes · {post.comments?.length || 0} replies
        </Stat>
      </EngagementCell>

      <RowActions>
        <DropdownMenu
          trigger={
            <MenuTrigger aria-label={`Actions for ${post.title || 'this post'}`}>
              <MoreHorizontal />
            </MenuTrigger>
          }
        >
          <DropdownMenu.Item onSelect={() => navigate(`/edit/${post._id}`)}>
            <Pencil /> Edit
          </DropdownMenu.Item>
          {visibility === 'public' && (
            <DropdownMenu.Item onSelect={() => navigate(`/post/${post._id}`)}>
              <ExternalLink /> View
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Separator />
          <DropdownMenu.Item $tone="danger" onSelect={() => onDelete(post)}>
            <Trash2 /> Delete
          </DropdownMenu.Item>
        </DropdownMenu>
      </RowActions>
    </Row>
  );
}

/* ── Reader: continue reading ────────────────────────────────────────────── */

const ReadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ReadingItem = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }
`;

const ReadingTitle = styled.p`
  ${text('md', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(2)}
`;

const ReadingMeta = styled.p`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ── Page ────────────────────────────────────────────────────────────────── */

const Split = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${({ theme }) => theme.spacing['2xl']};
  align-items: start;

  ${media.down('lg')`grid-template-columns: 1fr;`}
`;

const Aside = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const AsideLabel = styled.p`
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TopPost = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} 0;

  & + & {
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.lineSubtle};
  }
`;

const TopPostTitle = styled.span`
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(2)}

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'public', label: 'Published' },
  { id: 'draft', label: 'Drafts' },
  { id: 'private', label: 'Private' },
];

export function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [pendingDelete, setPendingDelete] = useState(null);

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts'],
    queryFn: userService.getUserPosts,
  });

  const { data: analytics } = useQuery({
    queryKey: ['userAnalytics', user?.user_id],
    queryFn: () => analyticsService.getUserAnalytics(user?.user_id),
    enabled: !!user?.user_id,
    retry: false,
  });

  const { data: reading, isLoading: readingLoading } = useQuery({
    queryKey: ['readingActivity'],
    queryFn: analyticsService.getReadingActivity,
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => postService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['userAnalytics'] });
      setPendingDelete(null);
      toast.success('Post deleted');
    },
    onError: () => toast.error('Could not delete the post'),
  });

  const allPosts = useMemo(() => posts || [], [posts]);

  /** Per-post figures, keyed so a row can find its own numbers. */
  const statsByPost = useMemo(() => {
    const map = new Map();
    (analytics?.postsAnalytics || []).forEach((entry) => map.set(String(entry.postId), entry));
    return map;
  }, [analytics]);

  const drafts = useMemo(() => allPosts.filter((post) => post.visibility === 'draft'), [allPosts]);

  const visible = useMemo(() => {
    let list = allPosts;
    if (filter !== 'all') list = list.filter((post) => post.visibility === filter);
    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      list = list.filter((post) => post.title?.toLowerCase().includes(needle));
    }
    return list;
  }, [allPosts, filter, query]);

  const counts = useMemo(
    () => ({
      all: allPosts.length,
      public: allPosts.filter((p) => p.visibility === 'public').length,
      draft: drafts.length,
      private: allPosts.filter((p) => p.visibility === 'private').length,
    }),
    [allPosts, drafts]
  );

  /** Only posts somebody actually finished — an all-zero list is noise, not a ranking. */
  const topFinished = useMemo(
    () => (analytics?.topPosts || []).filter((entry) => entry.reads > 0).slice(0, 5),
    [analytics]
  );

  const unfinished = reading?.unfinished || [];
  const hasWritten = allPosts.length > 0;
  const firstName = user?.username?.split(' ')[0] || 'there';

  if (postsLoading) return <Loading text="Loading your dashboard…" />;

  return (
    <PageShell>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle={
          hasWritten
            ? 'Everything you have written, and how far readers got through it.'
            : 'You have not published anything yet. Here is where it will show up.'
        }
        actions={
          <Button as={Link} to="/write">
            <PenLine /> Write
          </Button>
        }
      />

      {/* Writer ───────────────────────────────────────────────────────────── */}
      {hasWritten && (
        <>
          <Card tone="low" padding="2xl" radius="xl">
            <ReadRateHeadline
              views={analytics?.totalViews}
              reads={analytics?.totalReads}
              rate={analytics?.readRate}
            />
          </Card>

          {drafts.length > 0 && (
            <Section
              title="Pick up where you left off"
              note={`${drafts.length} unfinished ${drafts.length === 1 ? 'draft' : 'drafts'}`}
            >
              <Surface $tone="low" $radius="xl" $padding="sm">
                <Rows>
                  {drafts.slice(0, 3).map((post) => (
                    <PostRow
                      key={post._id}
                      post={post}
                      stats={statsByPost.get(String(post._id))}
                      onDelete={setPendingDelete}
                    />
                  ))}
                </Rows>
              </Surface>
            </Section>
          )}

          <Split>
            <Section title="Your posts">
              <Toolbar>
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

                <SearchField>
                  <Input
                    icon={<SearchIcon />}
                    placeholder="Search titles"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    aria-label="Search your posts by title"
                  />
                </SearchField>
              </Toolbar>

              {visible.length === 0 ? (
                <EmptyState icon={SearchIcon} title="Nothing matches">
                  No posts match that filter. Try a different one, or clear the search.
                </EmptyState>
              ) : (
                <Surface $tone="low" $radius="xl" $padding="sm">
                  <Rows>
                    {visible.map((post) => (
                      <PostRow
                        key={post._id}
                        post={post}
                        stats={statsByPost.get(String(post._id))}
                        onDelete={setPendingDelete}
                      />
                    ))}
                  </Rows>
                </Surface>
              )}
            </Section>

            <Aside>
              {topFinished.length > 0 && (
                <Card tone="low" radius="xl">
                  <AsideLabel>Most finished</AsideLabel>
                  <div style={{ marginTop: 8 }}>
                    {topFinished.map((entry) => (
                      <TopPost key={String(entry.postId)} to={`/post/${entry.postId}`}>
                        <TopPostTitle>{entry.title}</TopPostTitle>
                        <ReadRateBar
                          views={entry.views}
                          reads={entry.reads}
                          rate={entry.readRate}
                        />
                      </TopPost>
                    ))}
                  </div>
                </Card>
              )}
            </Aside>
          </Split>
        </>
      )}

      {!hasWritten && (
        <EmptyState
          icon={PenLine}
          title="Your first post starts here"
          actions={
            <>
              <Button as={Link} to="/write">
                <PenLine /> Start writing
              </Button>
              <Button as={Link} to="/search" variant="secondary">
                <Compass /> Browse stories
              </Button>
            </>
          }
        >
          Write in Markdown, publish when you are ready, and this page will tell you how many people
          opened it and how many reached the end.
        </EmptyState>
      )}

      {/* Reader ───────────────────────────────────────────────────────────── */}
      <Section
        title="Continue reading"
        note={unfinished.length > 0 ? 'You opened these but did not finish them.' : undefined}
      >
        {readingLoading ? (
          <Loading text="Loading your reading…" />
        ) : unfinished.length === 0 ? (
          <EmptyState icon={BookOpen} title="Nothing half-read">
            Posts you open but do not finish will wait for you here.
          </EmptyState>
        ) : (
          <ReadingGrid>
            {unfinished.map(({ post, lastOpenedAt }) => (
              <ReadingItem key={post._id} to={`/post/${post._id}`}>
                <ReadingTitle>{post.title}</ReadingTitle>
                <ReadingMeta>
                  {post.user?.username ? `${post.user.username} · ` : ''}
                  opened {formatDistanceToNow(new Date(lastOpenedAt), { addSuffix: true })}
                </ReadingMeta>
              </ReadingItem>
            ))}
          </ReadingGrid>
        )}
      </Section>

      <Modal
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this post?"
        description={
          pendingDelete
            ? `"${pendingDelete.title || 'Untitled'}" and its comments will be removed. This cannot be undone.`
            : ''
        }
      >
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
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
    </PageShell>
  );
}
