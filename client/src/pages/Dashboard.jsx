import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Avatar,
  Badge,
  Skeleton,
  StatTile,
} from '../components/ui';
import { queryKeys } from '../services/queryKeys';

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
    queryKey: queryKeys.analytics.mine(),
    queryFn: analyticsService.getMyAnalytics,
  });

  // Just enough of the list to show what is unfinished; the full table lives on /stories.
  const { data: draftsData } = useQuery({
    queryKey: queryKeys.posts.mine({ visibility: 'draft', limit: 4, sort: 'updated' }),
    queryFn: () => postService.getMyPosts({ visibility: 'draft', limit: 4, sort: 'updated' }),
  });

  const {
    data: readingData,
    isLoading: readingLoading,
    isError: readingFailed,
    error: readingError,
    refetch: refetchReading,
  } = useQuery({
    queryKey: queryKeys.analytics.reading(),
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
      {/* Creator Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--primary))/0.1] border border-[hsl(var(--primary))/0.2] rounded-[28px] p-6 sm:p-8 flex items-center justify-between gap-6 flex-wrap shadow-sm">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <Avatar src={avatarUrl} name={user?.username} size="lg" />
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2 tracking-tight">
              Welcome back, {firstName}{' '}
              <Sparkles className="w-5 h-5 text-[hsl(var(--primary))]" />
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-[540px] leading-relaxed">
              {bio || 'How your writing is doing. Manage what you have written under Stories.'}
            </p>
          </div>
        </div>

        {(user?._id || user?.user_id) && (
          <Button as={Link} to={`/user/${user._id || user.user_id}`} variant="secondary" size="sm">
            <User className="w-3.5 h-3.5 mr-1" /> View public profile
          </Button>
        )}
      </div>

      {/* Nothing to measure yet, so say what to do instead of reporting four zeroes. */}
      {!analyticsPending && !analyticsFailed && !hasWritten ? (
        <div className="flex flex-col items-start gap-4 p-8 rounded-[28px] bg-[hsl(var(--card))] border border-dashed border-[hsl(var(--primary))/0.4]">
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))] tracking-tight">
            Publish your first story
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-[62ch] leading-relaxed">
            Write in Markdown with a live preview. Save it as a draft while you work — only you can
            see a draft — and publish when you are ready. Views and read-through appear here once
            readers arrive.
          </p>
          <Button as={Link} to="/write">
            <PenLine className="w-4 h-4 mr-1.5" /> Start writing
          </Button>
        </div>
      ) : (
        <>
          <Section
            title="Performance Overview"
            note="Aggregated readership across all your stories"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatTile
                label="Total story views"
                icon={Eye}
                value={metric(analytics?.totalViews)}
                hint={analyticsFailed ? 'Could not load' : 'Across all published stories'}
              />
              <StatTile
                label="Reads finished"
                icon={CheckCircle2}
                value={metric(analytics?.totalReads)}
                hint={analyticsFailed ? 'Could not load' : 'Readers who reached the end'}
              />
              <StatTile
                label="Read-through"
                icon={BarChart2}
                value={metric(analytics?.readRate, '%')}
                hint={analyticsFailed ? 'Could not load' : 'Finished as a share of opened'}
              />
              <StatTile
                label="Stories"
                icon={FileText}
                value={metric(analytics?.totalPosts)}
                hint={drafts.length > 0 ? `${drafts.length} unfinished` : 'All published'}
              />
            </div>
          </Section>

          {analyticsFailed && (
            <div className="mb-6">
              <ErrorState
                title="Your figures did not load"
                error={analyticsError}
                onRetry={() => refetchAnalytics()}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <Card tone="low" radius="xl" padding="xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-[hsl(var(--primary))]" /> Best read-through
              </span>
              {topFinished.length === 0 ? (
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mt-2">
                  Once a published story is opened by a reader, its read-through appears here.
                </p>
              ) : (
                <div className="mt-2 divide-y divide-[hsl(var(--border))/0.5]">
                  {topFinished.map((entry) => (
                    <Link
                      key={String(entry.postId)}
                      to={`/post/${entry.postId}`}
                      className="group flex flex-col gap-1.5 py-3 text-inherit no-underline first:pt-0 last:pb-0"
                    >
                      <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] line-clamp-1 group-hover:text-[hsl(var(--primary))] transition-colors">
                        {entry.title}
                      </h4>
                      <ReadRateBar views={entry.views} reads={entry.reads} rate={entry.readRate} />
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            <Card tone="low" radius="xl" padding="xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 mb-2">
                <Pencil className="w-3.5 h-3.5 text-[hsl(var(--primary))]" /> Pick up where you left off
              </span>
              {drafts.length === 0 ? (
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mt-2">
                  No unfinished drafts. Anything you start and do not publish waits here.
                </p>
              ) : (
                <div className="mt-2 divide-y divide-[hsl(var(--border))/0.5]">
                  {drafts.map((post) => (
                    <Link
                      key={post._id}
                      to={`/edit/${post._id}`}
                      className="group flex items-center justify-between gap-3 py-3 text-inherit no-underline first:pt-0 last:pb-0"
                    >
                      <span className="min-w-0">
                        <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] line-clamp-1 group-hover:text-[hsl(var(--primary))] transition-colors">
                          {post.title || 'Untitled'}
                        </h4>
                        <span className="text-xs text-[hsl(var(--muted-foreground))] block mt-0.5">
                          edited{' '}
                          {post.updatedAt
                            ? formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })
                            : 'recently'}
                        </span>
                      </span>
                      <Badge variant="neutral">draft</Badge>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                to="/stories"
                className="group inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-[hsl(var(--primary))] hover:underline"
              >
                Manage all stories{' '}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Card>
          </div>
        </>
      )}

      <Section
        title="Continue reading"
        note={unfinished.length > 0 ? 'Stories you opened and have not finished.' : undefined}
      >
        {readingLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                tone="low"
                radius="xl"
                className="p-4 flex flex-col gap-3"
              >
                <Skeleton width="85%" height={18} className="rounded" />
                <Skeleton width="45%" height={12} className="rounded" />
              </Card>
            ))}
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {unfinished.map(({ post, lastOpenedAt }) => {
              const d = lastOpenedAt ? new Date(lastOpenedAt) : null;
              const when =
                d && !isNaN(d.getTime()) ? formatDistanceToNow(d, { addSuffix: true }) : 'recently';
              return (
                <Link
                  key={post._id}
                  to={`/post/${post._id}`}
                  className="bg-[hsl(var(--card))] border border-[hsl(var(--border))/0.6] rounded-[20px] p-5 flex flex-col gap-2 no-underline hover:border-[hsl(var(--primary))/0.4] hover:-translate-y-0.5 hover:shadow-sm transition-all"
                >
                  <h4 className="text-base font-semibold text-[hsl(var(--foreground))] line-clamp-2">
                    {post.title}
                  </h4>
                  <span className="text-xs text-[hsl(var(--muted-foreground))] mt-auto pt-2">
                    {post.user?.username ? `${post.user.username} · ` : ''}opened {when}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
