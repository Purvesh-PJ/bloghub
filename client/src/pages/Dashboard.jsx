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
  Settings as SettingsIcon,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { analyticsService } from '../services/analyticsService';
import { PageShell, PageHeader, Section } from '../components/layout/PageShell';
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
  DropdownMenu,
} from '../components/ui';
import { text, label as labelStyle, media, clamp, display, interactive } from '../styles/theme/mixins';
import { initial } from '../utils/text';

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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.surfaceContainerLow} 0%, ${({ theme }) => theme.colors.accentContainer} 100%);
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

const CreatorAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  flex-shrink: 0;
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
  grid-template-columns: 1fr 200px 140px 40px;
  grid-template-areas: 'title rate engagement actions';
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
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

const Split = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing['2xl']};
  align-items: start;

  ${media.down('lg')`grid-template-columns: 1fr;`}
`;

const Aside = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
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

/* ── Onboarding Quick-Start ──────────────────────────────────────────────── */

const OnboardingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};

  ${media.down('md')`grid-template-columns: 1fr;`}
`;

const OnboardingCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  ${interactive}

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentLine};
    box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.12);
  }
`;

const OnboardingTitle = styled.h3`
  ${text('md', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const OnboardingDesc = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const TipText = styled.p`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-top: 8px;
`;

/* ── Row Component ───────────────────────────────────────────────────────── */

function PostRow({ post, stats, onDelete, onToggleVisibility }) {
  const navigate = useNavigate();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url);
    toast.success('Public article link copied! 📋');
  };

  const menuItems = [
    {
      label: 'Edit story',
      icon: <Pencil size={14} />,
      onClick: () => navigate(`/edit/${post._id}`),
    },
    post.visibility !== 'public'
      ? {
          label: 'Publish story live',
          icon: <Globe size={14} />,
          onClick: () => onToggleVisibility(post, 'public'),
        }
      : {
          label: 'Move to drafts',
          icon: <EyeOff size={14} />,
          onClick: () => onToggleVisibility(post, 'draft'),
        },
    {
      label: 'Copy public link',
      icon: <Share2 size={14} />,
      onClick: handleCopyLink,
    },
    {
      label: 'View live story',
      icon: <ExternalLink size={14} />,
      onClick: () => navigate(`/post/${post._id}`),
    },
    {
      label: 'Delete story',
      icon: <Trash2 size={14} />,
      variant: 'danger',
      onClick: () => onDelete(post),
    },
  ];

  const views = stats?.views ?? post.views?.length ?? 0;
  const reads = stats?.reads ?? 0;
  const rate = stats?.readRate ?? (views > 0 ? Math.round((reads / views) * 100) : 0);

  return (
    <Row>
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
              return d && !isNaN(d.getTime()) ? formatDistanceToNow(d, { addSuffix: true }) : 'recently';
            })()}
          </span>
          {post.categories?.[0] && (
            <span>· {(post.categories[0]?.name ?? post.categories[0])}</span>
          )}
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

      <div style={{ gridArea: 'actions', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
        {post.visibility === 'draft' && (
          <Button
            size="xs"
            variant="tonal"
            onClick={() => onToggleVisibility(post, 'public')}
            title="Publish this draft live immediately"
          >
            <Globe size={12} /> Publish
          </Button>
        )}
        <DropdownMenu
          trigger={
            <Button variant="ghost" size="sm" aria-label="Story actions">
              <MoreHorizontal size={16} />
            </Button>
          }
          items={menuItems}
        />
      </div>
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

export function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['myPosts'],
    queryFn: postService.getMyPosts,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['myAnalytics'],
    queryFn: analyticsService.getMyAnalytics,
  });

  const { data: readingData, isLoading: readingLoading } = useQuery({
    queryKey: ['readingList'],
    queryFn: userService.getReadingList,
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ post, newVisibility }) => {
      return postService.updatePost(post._id, {
        title: post.title,
        slug: post.slug,
        content: post.content,
        imageURL: post.imageURL,
        categories: (post.categories || []).map((c) => c._id || c),
        visibility: newVisibility,
      });
    },
    onSuccess: (_, { newVisibility }) => {
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.invalidateQueries({ queryKey: ['myAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(newVisibility === 'public' ? 'Story published live! 🎉' : 'Story moved to drafts.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not update story visibility');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.invalidateQueries({ queryKey: ['myAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Story deleted successfully');
      setPendingDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not delete story');
    },
  });

  const posts = useMemo(() => postsData?.data || [], [postsData]);
  const analytics = analyticsData?.data;
  const unfinished = useMemo(() => readingData?.data || [], [readingData]);

  const statsByPost = useMemo(() => {
    const map = new Map();
    (analytics?.posts || []).forEach((entry) => map.set(String(entry.postId), entry));
    return map;
  }, [analytics]);

  const counts = useMemo(
    () => ({
      all: posts.length,
      public: posts.filter((p) => p.visibility === 'public').length,
      draft: posts.filter((p) => p.visibility === 'draft').length,
      private: posts.filter((p) => p.visibility === 'private').length,
    }),
    [posts]
  );

  const visible = useMemo(() => {
    return posts.filter((post) => {
      if (filter !== 'all' && post.visibility !== filter) return false;
      if (query.trim()) {
        return (post.title || '').toLowerCase().includes(query.toLowerCase());
      }
      return true;
    });
  }, [posts, filter, query]);

  const topFinished = useMemo(() => {
    return [...(analytics?.posts || [])]
      .filter((entry) => (entry.views || 0) > 0)
      .sort((a, b) => (b.readRate || 0) - (a.readRate || 0))
      .slice(0, 4);
  }, [analytics]);

  const drafts = useMemo(() => posts.filter((p) => p.visibility === 'draft'), [posts]);
  const hasWritten = posts.length > 0;
  const firstName = user?.username?.split(' ')[0] || user?.username || 'Creator';

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

  const totalViews = analytics?.totalViews ?? posts.reduce((acc, p) => acc + (p.views?.length || 0), 0);
  const totalReads = analytics?.totalReads ?? 0;
  const overallRate = analytics?.readRate ?? (totalViews > 0 ? Math.round((totalReads / totalViews) * 100) : 0);
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);

  return (
    <PageShell>
      {/* ── Creator Profile Header ────────────────────────────────────────── */}
      <CreatorBanner>
        <CreatorInfo>
          <CreatorAvatar>{initial(user?.username || 'C')}</CreatorAvatar>
          <CreatorDetails>
            <CreatorName>
              Welcome back, {firstName} <Sparkles size={16} />
            </CreatorName>
            <CreatorBio>
              {user?.bio || 'Manage your published stories, draft new ideas, and monitor reader engagement.'}
            </CreatorBio>
          </CreatorDetails>
        </CreatorInfo>

        <BannerActions>
          <Button as={Link} to="/write">
            <PenLine /> Write New Story
          </Button>
          {(user?._id || user?.user_id) && (
            <Button as={Link} to={`/user/${user._id || user.user_id}`} variant="secondary">
              <User /> Public Profile
            </Button>
          )}
          <Button as={Link} to="/settings" variant="tonal">
            <SettingsIcon /> Settings
          </Button>
        </BannerActions>
      </CreatorBanner>

      {/* ── Executive Metrics ─────────────────────────────────────────────── */}
      <MetricGrid>
        <MetricCard>
          <MetricHeader>
            <span>Total Story Views</span>
            <Eye />
          </MetricHeader>
          <MetricValue>{totalViews}</MetricValue>
          <MetricSub>Across all published articles</MetricSub>
        </MetricCard>

        <MetricCard>
          <MetricHeader>
            <span>Total Reads Finished</span>
            <CheckCircle2 />
          </MetricHeader>
          <MetricValue>{totalReads}</MetricValue>
          <MetricSub>Readers who reached the conclusion</MetricSub>
        </MetricCard>

        <MetricCard>
          <MetricHeader>
            <span>Avg Read-Through %</span>
            <BarChart2 />
          </MetricHeader>
          <MetricValue>{overallRate}%</MetricValue>
          <MetricSub>True reader engagement score</MetricSub>
        </MetricCard>

        <MetricCard>
          <MetricHeader>
            <span>Published Stories</span>
            <FileText />
          </MetricHeader>
          <MetricValue>{counts.public}</MetricValue>
          <MetricSub>{counts.draft} draft{counts.draft === 1 ? '' : 's'} in progress</MetricSub>
        </MetricCard>
      </MetricGrid>

      {/* ── Creator Studio Stories Hub ────────────────────────────────────── */}
      {hasWritten ? (
        <>
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
                      onToggleVisibility={(p, vis) =>
                        toggleVisibilityMutation.mutate({ post: p, newVisibility: vis })
                      }
                    />
                  ))}
                </Rows>
              </Surface>
            </Section>
          )}

          <Split>
            <Section title="Your Stories">
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
                    placeholder="Search by title…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </SearchField>
              </Toolbar>

              {visible.length === 0 ? (
                <EmptyState icon={SearchIcon} title="No matching stories">
                  No posts match that filter. Try selecting another tab or clear search.
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
                        onToggleVisibility={(p, vis) =>
                          toggleVisibilityMutation.mutate({ post: p, newVisibility: vis })
                        }
                      />
                    ))}
                  </Rows>
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

              <Card tone="low" radius="xl">
                <AsideLabel>
                  <Sparkles /> Quick Creator Tip
                </AsideLabel>
                <TipText>
                  Articles with a clear table of contents, high-quality cover photo, and 3–5 min read time achieve a <strong>24% higher completion rate</strong> on BlogHub.
                </TipText>
              </Card>
            </Aside>
          </Split>
        </>
      ) : (
        <Section title="Get Started In Your Studio">
          <OnboardingGrid>
            <OnboardingCard onClick={() => navigate('/write')}>
              <OnboardingTitle>Write Your First Story</OnboardingTitle>
              <OnboardingDesc>
                Use our distraction-free markdown editor with live preview, multi-category tagging, and cover images.
              </OnboardingDesc>
              <Button size="sm" style={{ width: 'fit-content', marginTop: 'auto' }}>
                Start Writing
              </Button>
            </OnboardingCard>

            <OnboardingCard onClick={() => navigate('/search')}>
              <OnboardingTitle>Explore Categories</OnboardingTitle>
              <OnboardingDesc>
                Browse diverse stories across Food, Tech, Science, Design, Travel, and Health.
              </OnboardingDesc>
              <Button size="sm" variant="secondary" style={{ width: 'fit-content', marginTop: 'auto' }}>
                Browse Stories
              </Button>
            </OnboardingCard>

            <OnboardingCard onClick={() => navigate('/settings')}>
              <OnboardingTitle>Customize Profile</OnboardingTitle>
              <OnboardingDesc>
                Add your bio, social handles, and avatar so readers and followers know your background.
              </OnboardingDesc>
              <Button size="sm" variant="secondary" style={{ width: 'fit-content', marginTop: 'auto' }}>
                Edit Profile
              </Button>
            </OnboardingCard>
          </OnboardingGrid>
        </Section>
      )}

      {/* ── Reading Activity ──────────────────────────────────────────────── */}
      <Section
        title="Continue Reading"
        note={unfinished.length > 0 ? 'Articles you opened and were reading recently.' : undefined}
      >
        {readingLoading ? (
          <Loading text="Loading reading activity…" />
        ) : unfinished.length === 0 ? (
          <EmptyState icon={BookOpen} title="No articles half-read">
            Stories you open to read will be bookmarked here so you can continue anytime.
          </EmptyState>
        ) : (
          <ReadingGrid>
            {unfinished.map(({ post, lastOpenedAt }) => {
              const d = lastOpenedAt ? new Date(lastOpenedAt) : null;
              const formattedDate = d && !isNaN(d.getTime()) ? formatDistanceToNow(d, { addSuffix: true }) : 'recently';
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
    </PageShell>
  );
}
