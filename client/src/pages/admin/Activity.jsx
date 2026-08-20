import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import { Activity as ActivityIcon } from 'lucide-react';

import { activityService } from '../../services/activityService';
import { PageHeader, Section } from '../../components/layout/PageShell';
import {
  Card,
  Tabs,
  Table,
  EmptyState,
  ErrorState,
  Skeleton,
  StatTile,
  Pagination,
  Badge,
} from '../../components/ui';
import { text, clamp, media } from '../../styles/theme/mixins';
import { queryKeys } from '../../services/queryKeys';

/**
 * What is actually happening on the site.
 *
 * `GET /user-activity/all` and `GET /user-activity/moderation-log` have existed on the server
 * from the start with nothing calling them — no service module, no query, no screen. An
 * administrator could see totals on the overview and individual accounts in the people table,
 * and had no way to look at the events behind either: which responses were being written,
 * what was being liked, or which stories had been edited after publication.
 */

const PAGE_SIZE = 20;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  ${media.down('sm')`
    grid-template-columns: repeat(2, 1fr);
  `}
`;

const Who = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Target = styled(Link)`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.accentText};
  ${clamp(1)}
  max-width: 280px;

  &:hover {
    text-decoration: underline;
  }
`;

const Gone = styled.span`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
`;

/**
 * The story an event points at, as a link — or as plain text when it has been deleted.
 *
 * A like or a view whose post is gone populates to null. Rendering that as a link produced
 * `/post/`, which matches no route and drops the administrator on the 404 page.
 */
const PostRef = ({ post }) =>
  post?._id ? <Target to={`/post/${post._id}`}>{post.title}</Target> : <Gone>A deleted story</Gone>;

const Message = styled.span`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  ${clamp(2)}
  max-width: 420px;
`;

const When = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const TONE = { public: 'success', draft: 'warning', private: 'neutral' };
const LABEL = { public: 'Published', draft: 'Draft', private: 'Private' };

/** Renders a timestamp that may be missing or malformed without printing "Invalid Date". */
const ago = (value) => {
  const date = value ? new Date(value) : null;
  return date && !isNaN(date.getTime()) ? formatDistanceToNow(date, { addSuffix: true }) : '—';
};

const TABS = [
  { id: 'comments', label: 'Responses' },
  { id: 'posts', label: 'Stories' },
  { id: 'likes', label: 'Likes' },
  { id: 'views', label: 'Opens' },
  { id: 'edits', label: 'Edited' },
];

function RowsSkeleton() {
  return (
    <Card tone="low" radius="xl" style={{ padding: 20 }} aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', alignItems: 'center' }}>
          <Skeleton $width="20%" $height={14} $radius="xs" />
          <Skeleton $width="45%" $height={14} $radius="xs" />
          <Skeleton $width="15%" $height={12} $radius="xs" />
        </div>
      ))}
    </Card>
  );
}

export function AdminActivity() {
  const [tab, setTab] = useState('comments');
  const [page, setPage] = useState(1);

  /*
    Changing tab returns to the first page: each stream is paged independently on the server,
    so page 4 of the responses is not page 4 of anything else.
  */
  const [syncedTab, setSyncedTab] = useState(tab);
  if (syncedTab !== tab) {
    setSyncedTab(tab);
    setPage(1);
  }

  // The "Edited" tab is a different endpoint; the other four are sections of one response.
  const showingEdits = tab === 'edits';

  const {
    data: activityResponse,
    isLoading: activityLoading,
    isError: activityFailed,
    error: activityError,
    refetch: refetchActivity,
  } = useQuery({
    queryKey: queryKeys.admin.activity(page),
    queryFn: () => activityService.getAllActivity({ page, limit: PAGE_SIZE }),
    enabled: !showingEdits,
    placeholderData: (previous) => previous,
  });

  const {
    data: editsResponse,
    isLoading: editsLoading,
    isError: editsFailed,
    error: editsError,
    refetch: refetchEdits,
  } = useQuery({
    queryKey: queryKeys.admin.moderationLog(page),
    queryFn: () => activityService.getModerationLog({ page, limit: PAGE_SIZE }),
    enabled: showingEdits,
    placeholderData: (previous) => previous,
  });

  const activity = activityResponse?.data;
  const isLoading = showingEdits ? editsLoading : activityLoading;
  const isError = showingEdits ? editsFailed : activityFailed;

  const section = showingEdits
    ? {
        data: editsResponse?.data ?? [],
        page: editsResponse?.pagination?.page ?? 1,
        totalPages: editsResponse?.pagination?.pages ?? 1,
        total: editsResponse?.pagination?.total ?? 0,
      }
    : (activity?.[tab] ?? { data: [], page: 1, totalPages: 1, total: 0 });

  const rows = section.data ?? [];

  return (
    <>
      <PageHeader
        title="Activity"
        subtitle="Responses, likes and opens across the site, newest first."
      />

      <Section>
        <Stats>
          <StatTile label="Active this month" value={activity?.activeUsers ?? '—'} />
          <StatTile label="Responses" value={activity?.comments?.total ?? '—'} />
          <StatTile label="Likes" value={activity?.likes?.total ?? '—'} />
          <StatTile label="Opens" value={activity?.views?.total ?? '—'} />
        </Stats>

        {/* The parts rather than the whole: each stream is paged independently and rendered
            below the tab strip, so there is no per-tab content panel to hand to <Tabs>. */}
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List aria-label="Activity streams">
            {TABS.map((item) => (
              <Tabs.Trigger key={item.id} value={item.id}>
                {item.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        {isError ? (
          <ErrorState
            title="Could not load activity"
            error={showingEdits ? editsError : activityError}
            onRetry={showingEdits ? refetchEdits : refetchActivity}
          />
        ) : isLoading && rows.length === 0 ? (
          <RowsSkeleton />
        ) : rows.length === 0 ? (
          <EmptyState icon={ActivityIcon} title="Nothing here yet">
            {tab === 'edits'
              ? 'No story has been edited since it was written.'
              : 'Activity will show up here as people read and respond.'}
          </EmptyState>
        ) : (
          <Card tone="low" radius="xl" padding="sm">
            <Table>
              <Table.Head>
                <tr>
                  <th>{tab === 'views' || tab === 'likes' ? 'Reader' : 'Who'}</th>
                  <th>{tab === 'comments' ? 'Said' : 'Story'}</th>
                  {tab === 'comments' && <th>On</th>}
                  {(tab === 'posts' || tab === 'edits') && <th>Status</th>}
                  <th>When</th>
                </tr>
              </Table.Head>
              <Table.Body>
                {rows.map((row) => (
                  <tr key={row._id}>
                    <td>
                      <Who>{row.user?.username || 'A signed-out visitor'}</Who>
                    </td>

                    <td>
                      {tab === 'comments' ? (
                        <Message>{row.message}</Message>
                      ) : tab === 'posts' || tab === 'edits' ? (
                        <PostRef post={row} />
                      ) : (
                        <PostRef post={row.post} />
                      )}
                    </td>

                    {tab === 'comments' && (
                      <td>
                        <PostRef post={row.post} />
                      </td>
                    )}

                    {(tab === 'posts' || tab === 'edits') && (
                      <td>
                        <Badge variant={TONE[row.visibility] || 'neutral'}>
                          {LABEL[row.visibility] || row.visibility}
                        </Badge>
                      </td>
                    )}

                    <td>
                      {/* The moderation log is ordered by when a story was edited, so that is
                          the time worth showing there rather than when it was written. */}
                      <When>{ago(tab === 'edits' ? row.updatedAt : row.createdAt)}</When>
                    </td>
                  </tr>
                ))}
              </Table.Body>
            </Table>

            <Pagination
              page={section.page}
              pages={section.totalPages}
              total={section.total}
              noun="events"
              onChange={setPage}
            />
          </Card>
        )}
      </Section>
    </>
  );
}
