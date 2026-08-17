import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import {
  PenLine,
  BookOpen,
  TrendingUp,
  Eye,
  CheckCircle2,
  BarChart2,
  FileText,
  User,
  Sparkles,
  ArrowRight,
  Pencil,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { postService } from '../services/postService';
import { analyticsService } from '../services/analyticsService';
import { PageShell, Section } from '../components/layout/PageShell';
import { ReadRateBar } from '../components/stats/ReadRateBar';
import { Button, Card, Loading, EmptyState, ErrorState, Avatar, Badge } from '../components/ui';
import { text, label as labelStyle, media, clamp, display } from '../styles/theme/mixins';

/**
 * Dashboard — how the writing is doing.
 *
 * Managing stories lives on its own page now. This one used to carry both, under a navigation
 * item honestly labelled "Dashboard & Stories": a filterable, sortable, paginated management
 * table wedged under the metrics and beside a sidebar of insight cards. Neither job was done
 * well, and the table in particular was squeezed into a third of the width, which is why every
 * story title rendered as an ellipsis.
 *
 * What is left answers one question — how am I doing — and hands off to Stories for the rest.
 */

/* ── Metrics ─────────────────────────────────────────────────────────────── */

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};

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
`;

/* ── Banner ──────────────────────────────────────────────────────────────── */

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

/* ── Panels ──────────────────────────────────────────────────────────────── */

const Split = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  ${media.down('md')`grid-template-columns: 1fr;`}
`;

const PanelLabel = styled.span`
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

const Note = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-top: ${({ theme }) => theme.spacing.md};
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

const ItemTitle = styled.h4`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(1)}
`;

const DraftRow = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
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

const Meta = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  display: block;
`;

const SeeAll = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: ${({ theme }) => theme.spacing.lg};
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.accentText};

  svg {
    width: 14px;
    height: 14px;
  }
`;

/* ── Reading ─────────────────────────────────────────────────────────────── */

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

/* ── First run ───────────────────────────────────────────────────────────── */

const FirstRun = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing['2xl']};
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

export function Dashboard() {
  const { user } = useAuth();
  const { avatarUrl, bio } = useCurrentUser();

  const {
    data: analyticsData,
    isPending: analyticsPending,
    isError: analyticsFailed,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ['myAnalytics'],
    queryFn: analyticsService.getMyAnalytics,
  });

  // Just enough of the list to show what is unfinished; the full table lives on /stories.
  const { data: draftsData } = useQuery({
    queryKey: ['myPosts', { visibility: 'draft', limit: 4, sort: 'updated' }],
    queryFn: () => postService.getMyPosts({ visibility: 'draft', limit: 4, sort: 'updated' }),
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

  const analytics = analyticsData?.data;
  const drafts = draftsData?.data ?? [];
  const unfinished = useMemo(() => readingData?.data?.unfinished ?? [], [readingData]);

  const topFinished = useMemo(
    () =>
      [...(analytics?.postsAnalytics ?? [])]
        .filter((entry) => (entry.views || 0) > 0)
        .sort((a, b) => (b.readRate || 0) - (a.readRate || 0))
        .slice(0, 4),
    [analytics]
  );

  const firstName = user?.username?.split(' ')[0] || user?.username || 'Creator';
  const hasWritten = (analytics?.totalPosts ?? 0) > 0;

  // Em dashes until known rather than a hard 0, which would otherwise flash in all four cards
  // and read as "your stats are gone" on every load.
  const metric = (value, suffix = '') => {
    if (analyticsFailed) return '—';
    if (analyticsPending) return '…';
    return `${value ?? 0}${suffix}`;
  };

  return (
    <PageShell>
      <CreatorBanner>
        <CreatorInfo>
          <Avatar src={avatarUrl} name={user?.username} size="lg" />
          <CreatorDetails>
            <CreatorName>
              Welcome back, {firstName} <Sparkles size={16} />
            </CreatorName>
            <CreatorBio>
              {bio || 'How your writing is doing. Manage what you have written under Stories.'}
            </CreatorBio>
          </CreatorDetails>
        </CreatorInfo>

        {(user?._id || user?.user_id) && (
          <Button as={Link} to={`/user/${user._id || user.user_id}`} variant="secondary">
            <User /> View public profile
          </Button>
        )}
      </CreatorBanner>

      {/* Nothing to measure yet, so say what to do instead of reporting four zeroes. */}
      {!analyticsPending && !analyticsFailed && !hasWritten ? (
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
        <>
          <MetricGrid>
            <MetricCard>
              <MetricHeader>
                <span>Total story views</span>
                <Eye />
              </MetricHeader>
              <MetricValue>{metric(analytics?.totalViews)}</MetricValue>
              <MetricSub>
                {analyticsFailed ? 'Could not load' : 'Across all published stories'}
              </MetricSub>
            </MetricCard>

            <MetricCard>
              <MetricHeader>
                <span>Reads finished</span>
                <CheckCircle2 />
              </MetricHeader>
              <MetricValue>{metric(analytics?.totalReads)}</MetricValue>
              <MetricSub>
                {analyticsFailed ? 'Could not load' : 'Readers who reached the end'}
              </MetricSub>
            </MetricCard>

            <MetricCard>
              <MetricHeader>
                <span>Read-through</span>
                <BarChart2 />
              </MetricHeader>
              <MetricValue>{metric(analytics?.readRate, '%')}</MetricValue>
              <MetricSub>
                {analyticsFailed ? 'Could not load' : 'Finished as a share of opened'}
              </MetricSub>
            </MetricCard>

            <MetricCard>
              <MetricHeader>
                <span>Stories</span>
                <FileText />
              </MetricHeader>
              <MetricValue>{metric(analytics?.totalPosts)}</MetricValue>
              <MetricSub>
                {drafts.length > 0 ? `${drafts.length} unfinished` : 'All published'}
              </MetricSub>
            </MetricCard>
          </MetricGrid>

          {analyticsFailed && (
            <div style={{ marginBottom: 24 }}>
              <ErrorState
                title="Your figures did not load"
                error={analyticsError}
                onRetry={() => refetchAnalytics()}
              />
            </div>
          )}

          <Split>
            <Card tone="low" radius="xl">
              <PanelLabel>
                <TrendingUp /> Best read-through
              </PanelLabel>
              {topFinished.length === 0 ? (
                <Note>
                  Once a published story is opened by a reader, its read-through appears here.
                </Note>
              ) : (
                <div style={{ marginTop: 8 }}>
                  {topFinished.map((entry) => (
                    <TopPost key={String(entry.postId)} to={`/post/${entry.postId}`}>
                      <ItemTitle>{entry.title}</ItemTitle>
                      <ReadRateBar views={entry.views} reads={entry.reads} rate={entry.readRate} />
                    </TopPost>
                  ))}
                </div>
              )}
            </Card>

            <Card tone="low" radius="xl">
              <PanelLabel>
                <Pencil /> Pick up where you left off
              </PanelLabel>
              {drafts.length === 0 ? (
                <Note>No unfinished drafts. Anything you start and do not publish waits here.</Note>
              ) : (
                <div style={{ marginTop: 8 }}>
                  {drafts.map((post) => (
                    <DraftRow key={post._id} to={`/edit/${post._id}`}>
                      <span style={{ minWidth: 0 }}>
                        <ItemTitle>{post.title || 'Untitled'}</ItemTitle>
                        <Meta>
                          edited{' '}
                          {post.updatedAt
                            ? formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })
                            : 'recently'}
                        </Meta>
                      </span>
                      <Badge variant="neutral">draft</Badge>
                    </DraftRow>
                  ))}
                </div>
              )}
              <SeeAll to="/stories">
                Manage all stories <ArrowRight />
              </SeeAll>
            </Card>
          </Split>
        </>
      )}

      <Section
        title="Continue reading"
        note={unfinished.length > 0 ? 'Stories you opened and have not finished.' : undefined}
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
          <EmptyState icon={BookOpen} title="Nothing half-read">
            Stories you open and do not finish are kept here so you can come back to them.
          </EmptyState>
        ) : (
          <ReadingGrid>
            {unfinished.map(({ post, lastOpenedAt }) => {
              const d = lastOpenedAt ? new Date(lastOpenedAt) : null;
              const when =
                d && !isNaN(d.getTime()) ? formatDistanceToNow(d, { addSuffix: true }) : 'recently';
              return (
                <ReadingItem key={post._id} to={`/post/${post._id}`}>
                  <ReadingTitle>{post.title}</ReadingTitle>
                  <ReadingMeta>
                    {post.user?.username ? `${post.user.username} · ` : ''}opened {when}
                  </ReadingMeta>
                </ReadingItem>
              );
            })}
          </ReadingGrid>
        )}
      </Section>
    </PageShell>
  );
}
