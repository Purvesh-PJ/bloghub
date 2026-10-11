import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  PenLine,
  Sparkles,
  Compass,
  Flame,
  BarChart2,
  Layers,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Feather,
  Check,
} from 'lucide-react';

import { postService } from '../services/postService';
import { useTags } from '../hooks/useTags';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';
import { PostCard } from '../components/posts/PostCard';
import { PostCardSkeleton } from '../components/posts/PostCardSkeleton';
import { HeroIllustration } from '../components/marketing/HeroIllustration';
import { TopicMarquee } from '../components/marketing/Topics';
import { queryKeys } from '../services/queryKeys';
import { cn } from '../lib/utils';

export function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <header className="pt-8 sm:pt-12 pb-4 grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] items-center gap-10 lg:gap-14">
          <div className="flex flex-col items-start text-left gap-6 w-full">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[hsl(var(--primary))/0.10] border border-[hsl(var(--primary))/0.25] text-xs font-semibold text-[hsl(var(--primary))] select-none">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              <span>A sanctuary for thoughtful writing</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[hsl(var(--foreground))] leading-[1.15] max-w-[800px]">
              Where ideas find their voice & stories find{' '}
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-sky-600 bg-clip-text text-transparent inline-block">
                curious minds.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[hsl(var(--muted-foreground))] leading-relaxed max-w-[660px]">
              BlogHub is a modern, distraction-free publishing space for writers, thinkers, and
              storytellers. Write effortlessly in Markdown, track genuine reader attention, and
              discover perspectives that broaden your world.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <Button size="lg" onClick={() => navigate(startHref)}>
                <PenLine className="h-4 w-4" /> {startLabel}
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/search')}>
                <Compass className="h-4 w-4" /> Explore stories
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap pt-2 text-xs font-medium text-[hsl(var(--muted-foreground))]">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[hsl(var(--primary))]" /> Pure Markdown Canvas
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[hsl(var(--primary))]" /> True Read Completion Metrics
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[hsl(var(--primary))]" /> 100% Free & Open
              </span>
            </div>
          </div>

          {/* Right Side Illustration */}
          <HeroIllustration />
        </header>
      </div>

      {/* ── 2. Live Topic Discovery Strip ── */}
      <section className="py-2 w-full">
        <TopicMarquee topics={tags} loading={tagsLoading} />
      </section>

      {/* ── 3. Main Feed Section ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))] select-none">
              <Flame className="h-3.5 w-3.5" />
              {isRanked ? 'Community Favorites' : 'Fresh Discoveries'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              {isRanked ? 'Trending stories' : 'Latest stories'}
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {isLoading
                ? 'Fetching stories…'
                : isRanked
                  ? `Ranked by genuine reader engagement over the last ${trendingWindow} days.`
                  : 'Freshly published stories from across the community.'}
            </p>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <PostCardSkeleton key={index} layout="row" />
            ))
          ) : posts.length === 0 ? (
            <div className="col-span-full py-16 px-6 text-center flex flex-col items-center gap-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))/0.4] rounded-[24px]">
              <Feather className="h-10 w-10 text-[hsl(var(--muted-foreground))] opacity-50" />
              <h3 className="text-xl font-bold text-[hsl(var(--foreground))]">No stories published yet</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-md leading-relaxed">
                Be the very first writer to share an insightful article with the community!
              </p>
              <Button size="md" onClick={() => navigate(startHref)}>
                <PenLine className="h-4 w-4" /> Write a story
              </Button>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} layout="row" />)
          )}
        </div>

        {!isLoading && posts.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/search"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold select-none transition-all duration-150',
                'bg-[hsl(var(--card))] text-[hsl(var(--primary))] border border-[hsl(var(--border))] shadow-sm',
                'hover:bg-[hsl(var(--primary))/0.10] hover:-translate-y-0.5 hover:shadow'
              )}
            >
              Explore all stories <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>

      {/* ── 4. "Why BlogHub?" Bento Section ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <div className="text-center flex flex-col items-center gap-1.5 mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))] select-none">
            <Layers className="h-3.5 w-3.5" /> Built for depth & clarity
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            Everything you need to write and connect
          </h2>
          <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] max-w-xl">
            Thoughtfully built tools crafted to honor your words and your readers' time.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3 p-6 sm:p-8 rounded-[24px] bg-[hsl(var(--card))] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <Feather className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[hsl(var(--foreground))] tracking-tight">Pure Markdown Canvas</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              Write in clean, effortless Markdown with live side-by-side preview, code syntax
              highlighting, cover image support, and distraction-free typography.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 sm:p-8 rounded-[24px] bg-[hsl(var(--card))] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <BarChart2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[hsl(var(--foreground))] tracking-tight">Meaningful Read Metrics</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              Go far beyond superficial page clicks. Track how many readers actually finished your
              entire article and understand where your ideas truly resonate.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 sm:p-8 rounded-[24px] bg-[hsl(var(--card))] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[hsl(var(--foreground))] tracking-tight">Thoughtful Discussions</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              Engage with curious readers through threaded responses, meaningful reactions, and
              streamlined creator moderation tools.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 sm:p-8 rounded-[24px] bg-[hsl(var(--card))] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow sm:col-span-2">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[hsl(var(--foreground))] tracking-tight">Complete Creative & Privacy Control</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              Keep works in progress safe with Private Drafts, test ideas privately with direct
              links, or publish publicly to the global feed with curated topics and custom tags.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 sm:p-8 rounded-[24px] bg-[hsl(var(--card))] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[hsl(var(--foreground))] tracking-tight">Serene Reading Sanctuary</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              No intrusive popups, no noisy advertising, and no clickbait algorithms. Just clean,
              fast-loading pages with effortless dark and light mode switching.
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. Closing CTA Section ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <div className="relative rounded-[32px] sm:rounded-[36px] bg-gradient-to-tr from-[hsl(var(--primary))] to-sky-700 py-12 sm:py-16 px-6 sm:px-12 text-center text-white flex flex-col items-center gap-6 overflow-hidden shadow-[0_20px_40px_-15px_rgba(14,165,233,0.35)]">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-xl text-white">
            Have an idea or story worth sharing?
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed">
            Join a growing community of writers, creators, and curious thinkers. Start drafting in
            seconds with our distraction-free editor.
          </p>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate(startHref)}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-base font-bold bg-white text-sky-700 hover:bg-slate-50 transition-transform active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.15)] cursor-pointer"
            >
              <PenLine className="h-4 w-4" /> {startLabel} <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-base font-semibold bg-white/15 text-white border border-white/30 backdrop-blur-md hover:bg-white/20 transition-transform active:scale-95 cursor-pointer"
            >
              <Compass className="h-4 w-4" /> Explore Stories
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center pt-2 text-xs font-medium text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Free to publish
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Markdown & Code native
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Zero intrusive paywalls
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
