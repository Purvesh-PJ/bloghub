import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Users, Hash, PenLine, ArrowRight } from 'lucide-react';

import { postService } from '../../services/postService';
import { analyticsService } from '../../services/analyticsService';
import { Section } from '../../components/layout/PageShell';
import { ReadRateHeadline } from '../../components/stats/ReadRateBar';
import { Button, Card, Surface, Badge, EmptyState, Skeleton, StatTile } from '../../components/ui';
import { text, media, clamp } from '../../styles/theme/mixins';
import { queryKeys } from '../../services/queryKeys';

/**
 * Admin overview.
 *
 * Had the same defect as the author analytics page: it fetched getAdminAnalytics — which
 * returns site-wide views, reads, read rate, top posts and top writers — and used exactly
 * one field from it, totalUsers. Everything else was recomputed from the first fifty posts,
 * so "Total Likes" silently meant "likes on the fifty most recent posts".
 *
 * Its "Top Posts" panel was also mislabelled: it rendered `recentPosts.slice(0, 4)`, which
 * is the four newest, not the four best.
 */

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  ${media.down('md')`grid-template-columns: repeat(2, 1fr);`}
`;

const Stat = styled(Surface).attrs({ $tone: 'low', $radius: 'lg', $padding: 'xl' })`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  ${media.down('lg')`grid-template-columns: 1fr;`}
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md} 0;

  & + & {
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.lineSubtle};
  }
`;

const ItemTitle = styled(Link)`
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(1)}

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const ItemMeta = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`;

const CardTitle = styled.h2`
  ${text('md', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const format = (n) => new Intl.NumberFormat().format(n ?? 0);

export function AdminDashboard() {
  // Moderation view — includes drafts and private posts, unlike the public ['posts'] key.
  const { data: postsResponse, isLoading } = useQuery({
    queryKey: queryKeys.posts.moderation(),
    queryFn: () => postService.getAllPosts({ limit: 50 }),
  });

  const { data: analyticsResponse } = useQuery({
    queryKey: queryKeys.analytics.site(),
    queryFn: analyticsService.getAdminAnalytics,
    retry: false,
  });

  // `.data` — the endpoint now answers in the same { success, data } envelope as the rest of
  // the API. It used to return a bare object, which made this the one screen reading a
  // different shape from every other.
  const analytics = analyticsResponse?.data;

  if (isLoading) {
    return (
      <div aria-hidden="true">
        <Stats>
          {Array.from({ length: 4 }).map((_, i) => (
            <Stat key={i}>
              <Skeleton $width={48} $height={32} $radius="xs" />
              <Skeleton $width={60} $height={14} $radius="xs" />
            </Stat>
          ))}
        </Stats>
        <div style={{ marginTop: 24 }}>
          <Card tone="low" padding="2xl" radius="xl">
            <Skeleton $width="40%" $height={28} $radius="xs" />
            <div style={{ marginTop: 12 }}>
              <Skeleton $width="100%" $height={12} $radius="full" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const posts = postsResponse?.data || [];
  const recent = posts.slice(0, 6);

  // Totals count the whole site, not the page of posts loaded above.
  const stats = [
    { label: 'Posts', value: format(analytics?.totalPosts ?? posts.length), icon: FileText },
    { label: 'Published', value: format(analytics?.publishedPosts), icon: FileText },
    { label: 'People', value: format(analytics?.totalUsers), icon: Users },
    { label: 'Opened', value: format(analytics?.totalViews), icon: FileText },
    { label: 'Finished', value: format(analytics?.totalReads), icon: FileText },
  ];

  const topPosts = (analytics?.topPosts || []).filter((entry) => entry.viewCount > 0);
  const topUsers = (analytics?.topUsers || []).filter((entry) => entry.postCount > 0);

  return (
    <>
      <Stats>
        {stats.map((stat) => (
          <Card key={stat.label} tone="low" radius="lg" padding="lg">
            <StatTile label={stat.label} value={stat.value} icon={stat.icon} padded={false} />
          </Card>
        ))}
      </Stats>

      <Card tone="low" padding="2xl" radius="xl">
        <ReadRateHeadline
          views={analytics?.totalViews}
          reads={analytics?.totalReads}
          rate={analytics?.readRate}
        />
      </Card>

      <Columns>
        <Section
          title="Most opened"
          aside={
            <Button as={Link} to="/admin/posts" variant="ghost" size="sm">
              All posts <ArrowRight />
            </Button>
          }
        >
          <Card tone="low" radius="xl">
            {topPosts.length === 0 ? (
              <ItemMeta>Nothing has been opened yet.</ItemMeta>
            ) : (
              <List>
                {topPosts.map((entry) => (
                  <Item key={entry._id}>
                    <ItemTitle to={`/post/${entry._id}`}>{entry.title}</ItemTitle>
                    <ItemMeta>{format(entry.viewCount)} opened</ItemMeta>
                  </Item>
                ))}
              </List>
            )}
          </Card>
        </Section>

        <Section
          title="Most published"
          aside={
            <Button as={Link} to="/admin/users" variant="ghost" size="sm">
              All people <ArrowRight />
            </Button>
          }
        >
          <Card tone="low" radius="xl">
            {topUsers.length === 0 ? (
              <ItemMeta>Nobody has published yet.</ItemMeta>
            ) : (
              <List>
                {topUsers.map((entry) => (
                  <Item key={entry._id}>
                    <ItemTitle to={`/user/${entry._id}`}>{entry.username}</ItemTitle>
                    <ItemMeta>
                      {entry.postCount} {entry.postCount === 1 ? 'story' : 'stories'}
                    </ItemMeta>
                  </Item>
                ))}
              </List>
            )}
          </Card>
        </Section>

        <Section title="Latest">
          <Card tone="low" radius="xl">
            {recent.length === 0 ? (
              <EmptyState icon={FileText} title="Nothing published yet" tone="transparent">
                Posts will appear here as people write them.
              </EmptyState>
            ) : (
              <List>
                {recent.map((post) => (
                  <Item key={post._id}>
                    <div style={{ minWidth: 0 }}>
                      <ItemTitle to={`/post/${post._id}`}>{post.title}</ItemTitle>
                      <ItemMeta style={{ display: 'block' }}>
                        {post.user?.username ?? 'Unknown'} ·{' '}
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </ItemMeta>
                    </div>
                    <Badge
                      variant={
                        post.visibility === 'public'
                          ? 'success'
                          : post.visibility === 'draft'
                            ? 'warning'
                            : 'neutral'
                      }
                    >
                      {post.visibility}
                    </Badge>
                  </Item>
                ))}
              </List>
            )}
          </Card>
        </Section>

        <Section title="Jump to">
          <Card tone="low" radius="xl">
            <CardTitle>Common tasks</CardTitle>
            <Actions>
              <Button as={Link} to="/write" variant="tonal">
                <PenLine /> Write
              </Button>
              <Button as={Link} to="/admin/tags" variant="tonal">
                <Hash /> Tags & Topics
              </Button>
              <Button as={Link} to="/admin/posts" variant="tonal">
                <FileText /> Posts
              </Button>
              <Button as={Link} to="/admin/users" variant="tonal">
                <Users /> People
              </Button>
            </Actions>
          </Card>
        </Section>
      </Columns>
    </>
  );
}
