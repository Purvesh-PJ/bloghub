import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, FileText, MessageSquare, Heart, Eye, ExternalLink } from 'lucide-react';

import { activityService } from '../../services/activityService';
import { analyticsService } from '../../services/analyticsService';
import { Section } from '../../components/layout/PageShell';
import { Card, EmptyState, ErrorState, Skeleton, StatTile, Button } from '../../components/ui';
import { ReadRateHeadline } from '../../components/stats/ReadRateBar';
import { queryKeys } from '../../services/queryKeys';

const ICONS = { post: FileText, comment: MessageSquare, reply: MessageSquare, like: Heart };

const ago = (value) => {
  const date = value ? new Date(value) : null;
  return date && !isNaN(date.getTime()) ? formatDistanceToNow(date, { addSuffix: true }) : '—';
};

export function AdminPersonActivity() {
  const { userId } = useParams();

  const {
    data: activityResponse,
    isLoading: activityLoading,
    isError: activityFailed,
    error: activityError,
    refetch: refetchActivity,
  } = useQuery({
    queryKey: queryKeys.admin.personActivity(userId),
    queryFn: () => activityService.getUserActivity(userId, { limit: 1 }),
    enabled: Boolean(userId),
    retry: false,
  });

  const { data: writingResponse } = useQuery({
    queryKey: queryKeys.analytics.forUser(userId),
    queryFn: () => analyticsService.getUserAnalytics(userId),
    enabled: Boolean(userId),
    retry: false,
  });

  const { data: timelineResponse, isLoading: timelineLoading } = useQuery({
    queryKey: queryKeys.admin.personTimeline(userId),
    queryFn: () => activityService.getUserTimeline(userId, { limit: 50 }),
    enabled: Boolean(userId),
    retry: false,
  });

  if (activityLoading) {
    return (
      <div aria-hidden="true" className="flex flex-col gap-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={78} className="rounded-2xl" />
          ))}
        </div>
        <Card tone="low" radius="xl" padding="lg">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-3 items-center">
              <Skeleton variant="circle" width={30} height={30} />
              <Skeleton width="60%" height={14} className="rounded" />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  if (activityFailed) {
    const missing = activityError?.response?.status === 404;
    return (
      <>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] mb-4 no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to people
        </Link>
        <ErrorState
          title={missing ? 'No such account' : 'Could not load this activity'}
          error={missing ? undefined : activityError}
          onRetry={missing ? undefined : refetchActivity}
        >
          {missing ? 'This account may have been deleted.' : undefined}
        </ErrorState>
      </>
    );
  }

  const activity = activityResponse?.data;
  const person = activity?.user;
  const timeline = timelineResponse?.data ?? [];
  const writing = writingResponse?.data;

  return (
    <>
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 px-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))/0.6] mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] no-underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <div>
            <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">
              {person?.username ?? 'Activity'}
            </h3>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              {person?.createdAt
                ? `${person.email} · joined ${ago(person.createdAt)}`
                : 'Account timeline and metrics'}
            </span>
          </div>
        </div>

        <Button as={Link} to={`/user/${userId}`} variant="secondary" size="sm">
          <ExternalLink className="w-3.5 h-3.5 mr-1" /> View public page
        </Button>
      </div>

      <Section>
        {/* Metric stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatTile label="Stories" value={activity?.posts?.total ?? 0} icon={FileText} />
          <StatTile label="Responses" value={activity?.comments?.total ?? 0} icon={MessageSquare} />
          <StatTile label="Likes given" value={activity?.likes?.total ?? 0} icon={Heart} />
          <StatTile label="Stories opened" value={activity?.views?.total ?? 0} icon={Eye} />
        </div>

        {writing?.totalViews > 0 && (
          <div className="mb-6">
            <Card tone="low" radius="xl" padding="lg">
              <ReadRateHeadline
                views={writing.totalViews}
                reads={writing.totalReads}
                rate={writing.readRate}
              />
            </Card>
          </div>
        )}

        {timelineLoading ? (
          <Card tone="low" radius="xl" padding="lg" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 py-3 items-center">
                <Skeleton variant="circle" width={30} height={30} />
                <Skeleton width="60%" height={14} className="rounded" />
              </div>
            ))}
          </Card>
        ) : timeline.length === 0 ? (
          <EmptyState icon={MessageSquare} title="Nothing yet">
            This account has not written, replied to or liked anything.
          </EmptyState>
        ) : (
          <Card tone="low" radius="xl" padding="none" className="overflow-hidden">
            <div className="flex flex-col divide-y divide-[hsl(var(--border))/0.4]">
              {timeline.map((event) => {
                const Icon = ICONS[event.type] ?? FileText;
                const target = event.type === 'post' ? event : event.post;

                return (
                  <div
                    key={`${event.type}-${event._id}`}
                    className="grid grid-cols-[auto_1fr_auto] gap-4 items-start p-4 hover:bg-[hsl(var(--muted))/0.5] transition-colors"
                  >
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="text-sm text-[hsl(var(--muted-foreground))] min-w-0">
                      <strong className="text-[hsl(var(--foreground))] font-semibold">
                        {person?.username ?? 'This account'}
                      </strong>{' '}
                      {event.action}{' '}
                      {target?._id ? (
                        <Link
                          to={`/post/${target._id}`}
                          className="text-[hsl(var(--primary))] hover:underline"
                        >
                          {target.title}
                        </Link>
                      ) : (
                        <em className="text-[hsl(var(--muted-foreground))]">a story since deleted</em>
                      )}
                      {event.message && (
                        <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 mt-0.5">
                          “{event.message}”
                        </p>
                      )}
                    </div>

                    <span className="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap tabular-nums">
                      {ago(event.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </Section>
    </>
  );
}
