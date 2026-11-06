import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { postService } from '../services/postService';
import { useTags } from '../hooks/useTags';
import { useAuth } from '../../../features/auth';
import { TopicMarquee } from '../components/Topics';
import { HomeHero } from '../components/HomeHero';
import { TrendingSection } from '../components/TrendingSection';
import { HomeFeatures } from '../components/HomeFeatures';
import { queryKeys } from '../../../config/queryKeys';

export function Home() {
  const { isAuthenticated } = useAuth();

  const { data: trendingResponse, isLoading } = useQuery({
    queryKey: queryKeys.posts.trending(),
    queryFn: () => postService.getTrending({ limit: 12 }),
  });

  const { names: tags, isLoading: tagsLoading } = useTags({ withPostsOnly: true });

  const posts = useMemo(() => trendingResponse?.data ?? [], [trendingResponse]);
  const isRanked = trendingResponse?.trendedBy === 'engagement';
  const trendingWindow = trendingResponse?.window ?? 14;

  const startHref = isAuthenticated ? '/write' : '/register';
  const startLabel = isAuthenticated ? 'Open Creator Studio' : 'Start Writing for Free';

  return (
    <div className="overflow-x-clip flex flex-col gap-12 sm:gap-16 pb-16 sm:pb-24">
      {/* ── 1. Hero Section ── */}
      <HomeHero startHref={startHref} startLabel={startLabel} />

      {/* ── 2. Live Topic Discovery Strip ── */}
      <section className="py-2 w-full">
        <TopicMarquee topics={tags} loading={tagsLoading} />
      </section>

      {/* ── 3. Main Feed Section ── */}
      <TrendingSection
        posts={posts}
        isLoading={isLoading}
        isRanked={isRanked}
        trendingWindow={trendingWindow}
        startHref={startHref}
      />

      {/* ── 4. "Why BlogHub?" Bento & Closing CTA ── */}
      <HomeFeatures startHref={startHref} startLabel={startLabel} />
    </div>
  );
}
