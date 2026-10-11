import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Users, Hash, PenLine, ArrowRight } from 'lucide-react';

import { postService } from '../../services/postService';
import { analyticsService } from '../../services/analyticsService';
import { Section } from '../../components/layout/PageShell';
import { ReadRateHeadline } from '../../components/stats/ReadRateBar';
import { Button, Card, Badge, EmptyState, Skeleton, StatTile } from '../../components/ui';
import { queryKeys } from '../../services/queryKeys';

const format = (n) => new Intl.NumberFormat().format(n ?? 0);

export function AdminDashboard() {
  const { data: postsResponse, isLoading } = useQuery({
    queryKey: queryKeys.posts.moderation(),
    queryFn: () => postService.getAllPosts({ limit: 50 }),
  });

  const { data: analyticsResponse } = useQuery({
    queryKey: queryKeys.analytics.site(),
    queryFn: analyticsService.getAdminAnalytics,
    retry: false,
  });

  const analytics = analyticsResponse?.data;

  if (isLoading) {
    return (
      <div aria-hidden="true" className="flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} tone="low" radius="lg" padding="lg">
              <Skeleton width={48} height={32} className="rounded" />
              <Skeleton width={60} height={14} className="rounded mt-2" />
            </Card>
          ))}
        </div>
        <Card tone="low" padding="2xl" radius="xl">
          <Skeleton width="40%" height={28} className="rounded" />
          <div className="mt-3">
            <Skeleton width="100%" height={12} className="rounded-full" />
          </div>
        </Card>
      </div>
    );
  }

  const posts = postsResponse?.data || [];
  const recent = posts.slice(0, 6);

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
    <div className="flex flex-col gap-6">
      {/* Top 5 Stat Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} tone="low" radius="lg" padding="lg">
            <StatTile label={stat.label} value={stat.value} icon={stat.icon} padded={false} />
          </Card>
        ))}
      </div>

      {/* Read-through Headline */}
      <Card tone="low" padding="2xl" radius="xl">
        <ReadRateHeadline
          views={analytics?.totalViews}
          reads={analytics?.totalReads}
          rate={analytics?.readRate}
        />
      </Card>

      {/* 2-Column Section Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Section
          title="Most opened"
          aside={
            <Button as={Link} to="/admin/posts" variant="ghost" size="sm">
              All posts <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          }
        >
          <Card tone="low" radius="xl" padding="lg">
            {topPosts.length === 0 ? (
              <span className="text-xs text-[hsl(var(--muted-foreground))]">
                Nothing has been opened yet.
              </span>
            ) : (
              <div className="flex flex-col divide-y divide-[hsl(var(--border))/0.4]">
                {topPosts.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <Link
                      to={`/post/${entry._id}`}
                      className="text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors line-clamp-1 no-underline"
                    >
                      {entry.title}
                    </Link>
                    <span className="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap tabular-nums">
                      {format(entry.viewCount)} opened
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Section>

        <Section
          title="Most published"
          aside={
            <Button as={Link} to="/admin/users" variant="ghost" size="sm">
              All people <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          }
        >
          <Card tone="low" radius="xl" padding="lg">
            {topUsers.length === 0 ? (
              <span className="text-xs text-[hsl(var(--muted-foreground))]">
                Nobody has published yet.
              </span>
            ) : (
              <div className="flex flex-col divide-y divide-[hsl(var(--border))/0.4]">
                {topUsers.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <Link
                      to={`/user/${entry._id}`}
                      className="text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors line-clamp-1 no-underline"
                    >
                      {entry.username}
                    </Link>
                    <span className="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap tabular-nums">
                      {entry.postCount} {entry.postCount === 1 ? 'story' : 'stories'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Section>

        <Section title="Latest">
          <Card tone="low" radius="xl" padding="lg">
            {recent.length === 0 ? (
              <EmptyState icon={FileText} title="Nothing published yet" tone="transparent">
                Posts will appear here as people write them.
              </EmptyState>
            ) : (
              <div className="flex flex-col divide-y divide-[hsl(var(--border))/0.4]">
                {recent.map((post) => (
                  <div
                    key={post._id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <Link
                        to={`/post/${post._id}`}
                        className="text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors line-clamp-1 no-underline block"
                      >
                        {post.title}
                      </Link>
                      <span className="text-xs text-[hsl(var(--muted-foreground))] block mt-0.5">
                        {post.user?.username ?? 'Unknown'} ·{' '}
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
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
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Section>

        <Section title="Jump to">
          <Card tone="low" radius="xl" padding="lg">
            <h2 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">
              Common tasks
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              <Button as={Link} to="/write" variant="tonal">
                <PenLine className="w-3.5 h-3.5 mr-1" /> Write
              </Button>
              <Button as={Link} to="/admin/tags" variant="tonal">
                <Hash className="w-3.5 h-3.5 mr-1" /> Tags & Topics
              </Button>
              <Button as={Link} to="/admin/posts" variant="tonal">
                <FileText className="w-3.5 h-3.5 mr-1" /> Posts
              </Button>
              <Button as={Link} to="/admin/users" variant="tonal">
                <Users className="w-3.5 h-3.5 mr-1" /> People
              </Button>
            </div>
          </Card>
        </Section>
      </div>
    </div>
  );
}
