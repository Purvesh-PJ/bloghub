import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity as ActivityIcon } from 'lucide-react';

import { activityService } from '../../analytics/services/activityService';
import { Section } from '../../../components/layout/PageShell';
import {
  Card,
  Tabs,
  Table,
  EmptyState,
  ErrorState,
  Skeleton,
  StatTile,
  Pagination,
} from '../../../components/ui';
import { AuditLogRow } from '../components/AuditLogRow';
import { queryKeys } from '../../../config/queryKeys';

const PAGE_SIZE = 20;

const TABS = [
  { id: 'comments', label: 'Responses' },
  { id: 'posts', label: 'Stories' },
  { id: 'likes', label: 'Likes' },
  { id: 'views', label: 'Opens' },
  { id: 'edits', label: 'Edited' },
];

function RowsSkeleton() {
  return (
    <Card tone="low" radius="xl" padding="lg" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-[hsl(var(--border))/0.4] last:border-b-0">
          <Skeleton width="20%" height={14} className="rounded" />
          <Skeleton width="45%" height={14} className="rounded" />
          <Skeleton width="15%" height={12} className="rounded" />
        </div>
      ))}
    </Card>
  );
}

export function AdminActivity() {
  const [tab, setTab] = useState('comments');
  const [page, setPage] = useState(1);

  const [syncedTab, setSyncedTab] = useState(tab);
  if (syncedTab !== tab) {
    setSyncedTab(tab);
    setPage(1);
  }

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
      <Section>
        {/* Metric stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatTile label="Active this month" value={activity?.activeUsers ?? '—'} />
          <StatTile label="Responses" value={activity?.comments?.total ?? '—'} />
          <StatTile label="Likes" value={activity?.likes?.total ?? '—'} />
          <StatTile label="Opens" value={activity?.views?.total ?? '—'} />
        </div>

        {/* Tab selection */}
        <div className="mb-4">
          <Tabs.Root value={tab} onValueChange={setTab}>
            <Tabs.List aria-label="Activity streams">
              {TABS.map((item) => (
                <Tabs.Trigger key={item.id} value={item.id}>
                  {item.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        </div>

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
          <Card tone="low" radius="xl" padding="none" className="overflow-hidden">
            <Table>
              <Table.Head>
                <tr>
                  <th className="pl-6">{tab === 'views' || tab === 'likes' ? 'Reader' : 'Who'}</th>
                  <th>{tab === 'comments' ? 'Said' : 'Story'}</th>
                  {tab === 'comments' && <th>On</th>}
                  {(tab === 'posts' || tab === 'edits') && <th>Status</th>}
                  <th className="pr-6">When</th>
                </tr>
              </Table.Head>
              <Table.Body>
                {rows.map((row) => (
                  <AuditLogRow key={row._id} row={row} tab={tab} />
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
