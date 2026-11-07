import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search as SearchIcon,
  Compass,
  X,
  Clock,
  Flame,
  RotateCcw,
  PenLine,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { searchService } from '../services/searchService';
import { postService } from '../services/postService';
import { useTags } from '../hooks/useTags';
import { PageShell } from '../../../components/layout/PageShell';
import { PostCard } from '../components/PostCard';
import { PostCardSkeleton } from '../components/PostCardSkeleton';
import { topicIcon } from '../../../utils/topicIcons';
import { Button, Chip, EmptyState, SearchInput } from '../../../components/ui';
import { excerpt, readingTimeFromLength } from '../../../utils/text';
import { queryKeys } from '../../../config/queryKeys';

const formatTopicTitle = (text) => {
  if (!text) return '';
  const clean = String(text).replace(/^[#_-]+/, '');
  if (clean.toLowerCase() === 'uiux') return 'UI/UX';
  if (clean.toLowerCase() === 'ai') return 'AI';
  if (clean.toLowerCase() === 'saas') return 'SaaS';
  if (clean.toLowerCase() === 'nodejs') return 'Node.js';
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const topic = searchParams.get('topic') || searchParams.get('category') || '';

  const [draft, setDraft] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);

  /*
    Keep the box in step when the query changes from outside it — clearing a filter, using the
    back button, or arriving on a shared URL. Adjusted during render rather than in an effect
    so the input never paints one frame showing the previous search.
  */
  if (syncedQuery !== query) {
    setSyncedQuery(query);
    setDraft(query);
  }

  // Debounced typing
  useEffect(() => {
    if (draft === query) return undefined;
    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (draft.trim()) next.set('q', draft.trim());
      else next.delete('q');
      setSearchParams(next, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [draft, query, searchParams, setSearchParams]);

  const { data: searchData, isLoading: searching } = useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => searchService.search(query),
    enabled: Boolean(query),
  });

  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: queryKeys.posts.feed({ topic }),
    queryFn: () => postService.getPosts({ limit: 25, ...(topic && { topic }) }),
    enabled: !query,
  });

  // Only topics with something behind them; a chip that leads nowhere is worse than no chip.
  const { tags: activeTags } = useTags({ withPostsOnly: true });

  const results = searchData?.data || [];
  const browsePosts = useMemo(() => postsData?.data || [], [postsData]);

  const setTopic = (name) => {
    const next = new URLSearchParams(searchParams);
    if (name && name !== topic) {
      next.set('topic', name);
      next.delete('category');
      next.delete('tag');
    } else {
      next.delete('topic');
      next.delete('category');
      next.delete('tag');
    }
    setSearchParams(next, { replace: true });
  };

  const clearSearch = () => {
    setDraft('');
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const hasPosts = browsePosts.length > 0;

  return (
    <PageShell>
      {/* ── 1. Top Header: Icon, Title & Subtitle + Search Bar ─── */}
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/12 text-primary shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Explore Stories
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-[54ch]">
              Discover deep-dive breakdowns, engineering essays, and creative perspectives.
            </p>
          </div>
        </div>

        {/* Search input box */}
        <div className="w-full sm:max-w-[360px]">
          <SearchInput
            placeholder="Search titles, stories, tags and authors…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onClear={clearSearch}
            ariaLabel="Search stories"
          />
        </div>
      </div>

      {/* ── 2. Dynamic Topic & Tags Navigation Bar ───────────────────────── */}
      {!query && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none [scrollbar-width:none]">
          <Chip size="md" selected={!topic} onClick={() => setTopic('')}>
            <Flame className="w-3.5 h-3.5 mr-1" /> All Stories
          </Chip>
          {activeTags.map((tag) => {
            const Icon = topicIcon(tag.name);
            const isSelected = topic.toLowerCase() === tag.name.toLowerCase();
            return (
              <Chip
                key={tag._id || tag.name}
                size="md"
                selected={isSelected}
                onClick={() => setTopic(tag.name)}
              >
                <Icon className="w-3.5 h-3.5 mr-1" />
                {formatTopicTitle(tag.name)}
              </Chip>
            );
          })}
        </div>
      )}

      {/* ── 3. Active Topic Filter Reset Indicator ───────────────────────── */}
      {!query && topic && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-muted/50 rounded-2xl">
          <span className="text-sm font-medium text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Filtered by{' '}
            <strong>{formatTopicTitle(topic)}</strong>
            <span className="text-muted-foreground font-normal">
              (
              {loadingPosts
                ? '…'
                : `${browsePosts.length} ${browsePosts.length === 1 ? 'story' : 'stories'}`}
              )
            </span>
          </span>
          <Button size="sm" variant="ghost" onClick={() => setTopic('')}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear filter
          </Button>
        </div>
      )}

      {/* ── 4. Main Editorial Grid / Search Results ───────────────────────── */}
      {query ? (
        /* ── Search Results Grid ── */
        searching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={`search-skel-${i + 1}`} layout="stacked" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <EmptyState icon={SearchIcon} title="No matching stories found">
            We couldn't find any articles matching “{query}”. Try different keywords or browse our
            curated categories above.
            <div className="mt-3">
              <Button size="sm" variant="secondary" onClick={clearSearch}>
                Clear search
              </Button>
            </div>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <Link
                key={result._id}
                to={`/post/${result._id}`}
                className="group flex flex-col justify-between gap-3 p-6 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-md hover:bg-muted/40 transition-all"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {result.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-2 leading-relaxed">
                    {result.truncatedContent
                      ? excerpt(result.truncatedContent, 180)
                      : excerpt(result.content, 180)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {readingTimeFromLength(result.contentLength)} min
                    read
                  </span>
                  {result.user?.username && <span>by {result.user.username}</span>}
                  <span className="text-primary font-semibold inline-flex items-center gap-1">
                    Read story <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : /* ── Browse Mode (Uniform 3-Column Editorial Grid) ── */
      loadingPosts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={`browse-skel-${i + 1}`} layout="stacked" />
          ))}
        </div>
      ) : !hasPosts ? (
        <EmptyState
          icon={Compass}
          title={topic ? `No stories in ${topic} yet` : 'No stories found'}
        >
          {topic
            ? `Be the very first writer to share an article in ${topic}!`
            : 'Stories will show up here as creators in the community publish them.'}
          <div className="mt-3">
            <Button size="sm" onClick={() => navigate('/write')}>
              <PenLine className="w-3.5 h-3.5 mr-1" /> Write a story
            </Button>
          </div>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {browsePosts.map((post) => (
            <PostCard key={post._id} post={post} layout="stacked" />
          ))}
        </div>
      )}
    </PageShell>
  );
}
