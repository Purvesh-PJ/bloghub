import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { PenLine, BookOpen, Eye, CheckCircle2, BarChart2, FileText } from 'lucide-react';

import { useAuth } from '../../../features/auth';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { postService } from '../../posts/services/postService';
import { analyticsService } from '../../analytics/services/analyticsService';
import { PageShell, Section } from '../../../components/layout/PageShell';
import { Button, Card, EmptyState, ErrorState, Skeleton } from '../../../components/ui';
import { StatsGrid } from '../../../components/patterns';
import { DashboardBanner, TopStoriesSection, DraftsAndReadingSection } from '../components';
import { queryKeys } from '../../../config/queryKeys';

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

  const metric = (value, suffix = '') => {
    if (analyticsFailed) return '—';
    if (analyticsPending) return '…';
    return `${value ?? 0}${suffix}`;
  };

  const userStats = [
    {
      label: 'Total story views',
      icon: Eye,
      value: metric(analytics?.totalViews),
      hint: analyticsFailed ? 'Could not load' : 'Across all published stories',
    },
    {
      label: 'Reads finished',
      icon: CheckCircle2,
      value: metric(analytics?.totalReads),
      hint: analyticsFailed ? 'Could not load' : 'Readers who reached the end',
    },
    {
      label: 'Read-through',
      icon: BarChart2,
      value: metric(analytics?.readRate, '%'),
      hint: analyticsFailed ? 'Could not load' : 'Finished as a share of opened',
    },
    {
      label: 'Stories',
      icon: FileText,
      value: metric(analytics?.totalPosts),
      hint: drafts.length > 0 ? `${drafts.length} unfinished` : 'All published',
    },
  ];

  return (
    <PageShell>
      {/* Creator Banner */}
      <DashboardBanner user={user} avatarUrl={avatarUrl} bio={bio} firstName={firstName} />

      {/* Nothing to measure yet */}
      {!analyticsPending && !analyticsFailed && !hasWritten ? (
        <div className="flex flex-col items-start gap-4 p-8 rounded-2xl bg-card border border-dashed border-primary/40">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Publish your first story
          </h2>
          <p className="text-sm text-muted-foreground max-w-[62ch] leading-relaxed">
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
            <StatsGrid items={userStats} columns={4} inCard={false} />
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
            <TopStoriesSection topFinished={topFinished} />
            <DraftsAndReadingSection drafts={drafts} />
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
              <Card key={i} tone="low" radius="xl" className="p-4 flex flex-col gap-3">
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
                  className="bg-card border border-border/60 rounded-lg p-5 flex flex-col gap-2 no-underline hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm transition-all"
                >
                  <h4 className="text-base font-semibold text-foreground line-clamp-2">
                    {post.title}
                  </h4>
                  <span className="text-xs text-muted-foreground mt-auto pt-2">
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
