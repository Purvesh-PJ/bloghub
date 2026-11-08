import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity as ActivityIcon } from 'lucide-react';

import { activityService } from '../../analytics/services/activityService';
import { Section } from '../../../components/layout/PageShell';
import {
  Tabs,
  Table,
  EmptyState,
  ErrorState,
  Skeleton,
  TableSkeleton,
  Pagination,
} from '../../../components/ui';
import { StatsGrid, DataTableCard } from '../../../components/patterns';
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
  return <TableSkeleton rows={6} hasBadge={false} />;
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
        <StatsGrid
          inCard={false}
          columns={4}
          items={[
            { label: 'Active this month', value: activity?.activeUsers ?? '—' },
            { label: 'Responses', value: activity?.comments?.total ?? '—' },
            { label: 'Likes', value: activity?.likes?.total ?? '—' },
            { label: 'Opens', value: activity?.views?.total ?? '—' },
          ]}
          className="mb-6"
        />

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
          <DataTableCard
            pagination={
              <Pagination
                page={section.page}
                pages={section.totalPages}
                total={section.total}
                noun="events"
                onChange={setPage}
              />
            }
          >
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
          </DataTableCard>
        )}
      </Section>
    </>
  );
}
