import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, FileText, MessageSquare, Heart, Eye, ExternalLink } from 'lucide-react';

import { activityService } from '../../services/activityService';
import { analyticsService } from '../../services/analyticsService';
import { PageHeader, Section } from '../../components/layout/PageShell';
import { Card, EmptyState, ErrorState, Skeleton, StatTile, Button } from '../../components/ui';
import { ReadRateHeadline } from '../../components/stats/ReadRateBar';
import { text, clamp, media } from '../../styles/theme/mixins';
import { queryKeys } from '../../services/queryKeys';

/**
 * One person's activity.
 *
 * `GET /user-activity/user/:userId` and `GET /user-activity/timeline/:userId` have existed on
 * the server with nothing calling them. An administrator looking at a reported account could
 * see its row in the people table — name, email, role, join date — and had no way to see what
 * it had actually been doing, which is the one thing that decides whether to suspend it.
 *
 * The totals come from the activity endpoint and the stream from the timeline endpoint, which
 * merges posts, comments, replies and likes into one time-ordered list.
 */

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  ${media.down('sm')`
    grid-template-columns: repeat(2, 1fr);
  `}
`;

const Entry = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: start;
  padding: ${({ theme }) => theme.spacing.lg};

  & + & {
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.lineSubtle};
  }
`;

const Dot = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 15px;
    height: 15px;
  }
`;

const Action = styled.div`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  min-width: 0;

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
  }

  a {
    color: ${({ theme }) => theme.colors.accentText};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Said = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  ${clamp(2)}
  margin-top: 2px;
`;

const When = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const ICONS = { post: FileText, comment: MessageSquare, reply: MessageSquare, like: Heart };

/** Renders a timestamp that may be missing or malformed without printing "Invalid Date". */
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

  /*
    How much of this account's writing actually gets finished.

    `GET /analytics/user/:userId` is scoped to that account or an administrator, and until now
    only the post page called it — for the caller's own posts. It is the figure that separates
    an account publishing a lot from one worth reading.
  */
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
      <div aria-hidden="true">
        <PageHeader title="Activity" subtitle="Loading…" />
        <Stats>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} $width="100%" $height={78} $radius="lg" />
          ))}
        </Stats>
        <Card tone="low" radius="xl" style={{ padding: 20 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0' }}>
              <Skeleton $variant="circle" $width={30} $height={30} />
              <Skeleton $width="60%" $height={14} $radius="xs" />
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
        <Back to="/admin/users">
          <ArrowLeft /> Back to people
        </Back>
        {/* A deleted account is not a transient failure, so it gets no retry button. */}
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
      <Back to="/admin/users">
        <ArrowLeft /> Back to people
      </Back>

      <PageHeader
        badge="Account Timeline"
        title={person?.username ?? 'Activity'}
        subtitle={
          person?.createdAt
            ? `${person.email} · joined ${ago(person.createdAt)}`
            : 'What this account has been doing.'
        }
        actions={
          <Button as={Link} to={`/user/${userId}`} variant="secondary" size="sm">
            <ExternalLink /> View public page
          </Button>
        }
      />

      <Section>
        {/* Totals count everything the account has done, not the page of the stream below. */}
        <Stats>
          <StatTile label="Stories" value={activity?.posts?.total ?? 0} icon={FileText} />
          <StatTile label="Responses" value={activity?.comments?.total ?? 0} icon={MessageSquare} />
          <StatTile label="Likes given" value={activity?.likes?.total ?? 0} icon={Heart} />
          <StatTile label="Stories opened" value={activity?.views?.total ?? 0} icon={Eye} />
        </Stats>

        {writing?.totalViews > 0 && (
          <Card tone="low" radius="xl" padding="lg" style={{ marginBottom: 24 }}>
            <ReadRateHeadline
              views={writing.totalViews}
              reads={writing.totalReads}
              rate={writing.readRate}
            />
          </Card>
        )}

        {timelineLoading ? (
          <Card tone="low" radius="xl" style={{ padding: 20 }} aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0' }}>
                <Skeleton $variant="circle" $width={30} $height={30} />
                <Skeleton $width="60%" $height={14} $radius="xs" />
              </div>
            ))}
          </Card>
        ) : timeline.length === 0 ? (
          <EmptyState icon={MessageSquare} title="Nothing yet">
            This account has not written, replied to or liked anything.
          </EmptyState>
        ) : (
          <Card tone="low" radius="xl" padding="sm">
            {timeline.map((event) => {
              const Icon = ICONS[event.type] ?? FileText;
              // A post is its own subject; a comment or a like points at somebody else's.
              const target = event.type === 'post' ? event : event.post;

              return (
                <Entry key={`${event.type}-${event._id}`}>
                  <Dot>
                    <Icon />
                  </Dot>

                  <Action>
                    <strong>{person?.username ?? 'This account'}</strong> {event.action}{' '}
                    {target?._id ? (
                      <Link to={`/post/${target._id}`}>{target.title}</Link>
                    ) : (
                      <em>a story since deleted</em>
                    )}
                    {event.message && <Said>“{event.message}”</Said>}
                  </Action>

                  <When>{ago(event.createdAt)}</When>
                </Entry>
              );
            })}
          </Card>
        )}
      </Section>
    </>
  );
}
