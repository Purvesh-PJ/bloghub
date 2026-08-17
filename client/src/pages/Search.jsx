import { useState, useEffect, useMemo, createElement } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled, { css, keyframes } from 'styled-components';
import {
  Search as SearchIcon,
  Compass,
  X,
  Clock,
  Sparkles,
  LayoutGrid,
  List,
  Flame,
  Feather,
  RotateCcw,
  PenLine,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

import { searchService } from '../services/searchService';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { PageShell } from '../components/layout/PageShell';
import { PostCard } from '../components/posts/PostCard';
import { PostCardSkeleton } from '../components/posts/PostCardSkeleton';
import { topicIcon } from '../components/marketing/Topics';
import { Button } from '../components/ui';
import { display, text, clamp, media, interactive } from '../styles/theme/mixins';
import { excerpt, readingTime } from '../utils/text';

/* ── Keyframes ───────────────────────────────────────────────────────────── */

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.03); }
`;

/* ── Styled Components ───────────────────────────────────────────────────── */

const HeroWrapper = styled.div`
  position: relative;
  background: ${({ theme }) =>
    theme.mode === 'light'
      ? 'linear-gradient(180deg, #f0f9ff 0%, #f8fafc 100%)'
      : 'linear-gradient(180deg, rgba(14, 165, 233, 0.08) 0%, rgba(7, 11, 19, 0.6) 100%)'};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing['2xl']};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  overflow: hidden;
  box-shadow: 0 4px 20px -5px rgba(15, 23, 42, 0.05);

  ${media.down('md')`
    padding: ${({ theme }) => theme.spacing.xl};
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

const AmbientAura = styled.div`
  position: absolute;
  top: -40px;
  right: -40px;
  width: 320px;
  height: 320px;
  background: radial-gradient(
    circle,
    rgba(14, 165, 233, 0.2) 0%,
    rgba(56, 189, 248, 0.05) 60%,
    transparent 80%
  );
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
  animation: ${pulseGlow} 6s ease-in-out infinite;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${text('xs', 'semibold')}
  width: fit-content;
  border: 1px solid ${({ theme }) => theme.colors.accentLine};

  svg {
    width: 13px;
    height: 13px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const HeroTitle = styled.h1`
  ${display('lg')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;

  .gradient-text {
    background: ${({ theme }) => theme.gradients.brandText};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  ${media.down('sm')`font-size: ${({ theme }) => theme.display.md[0]};`}
`;

const HeroSubtitle = styled.p`
  ${text('md')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  line-height: 1.6;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 720px;

  input {
    width: 100%;
    height: 56px;
    font-size: 16px;
    padding-left: 52px;
    padding-right: 44px;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ theme }) => theme.colors.surfaceElevated};
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1.5px solid ${({ theme }) => theme.colors.lineDefault};
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
    transition: all ${({ theme }) => theme.transitions.fast};

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.accentSolid};
      box-shadow:
        0 0 0 4px rgba(14, 165, 233, 0.2),
        0 6px 20px rgba(14, 165, 233, 0.1);
    }
  }

  .search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.accentSolid};
    pointer-events: none;
  }

  .clear-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 50%;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceContainer};
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const QuickSuggestionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};

  span.label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
  }
`;

const SuggestionBadge = styled.button`
  background: ${({ theme }) => theme.colors.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  ${text('xs', 'medium')}
  transition: all ${({ theme }) => theme.transitions.fast};
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.accentContainer};
    color: ${({ theme }) => theme.colors.accentText};
    border-color: ${({ theme }) => theme.colors.accentLine};
    transform: translateY(-1px);
  }
`;

/* ── Topic Filter Pills Row ──────────────────────────────────────────────── */

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TopicPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;
  ${text('sm', 'medium')}
  transition: all ${({ theme }) => theme.transitions.fast};
  ${interactive}

  ${({ $selected, theme }) =>
    $selected
      ? css`
          background: ${theme.gradients.brand};
          color: #ffffff;
          border: 1px solid transparent;
          font-weight: 600;
          box-shadow: 0 4px 12px -2px rgba(14, 165, 233, 0.4);

          svg {
            color: #ffffff;
          }

          span.count {
            background: rgba(255, 255, 255, 0.25);
            color: #ffffff;
          }
        `
      : css`
          background: ${theme.colors.surfaceElevated};
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.lineDefault};
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);

          svg {
            color: ${theme.colors.accentSolid};
          }

          span.count {
            background: ${theme.colors.surfaceContainer};
            color: ${theme.colors.textMuted};
          }

          &:hover {
            background: ${theme.colors.accentContainer};
            color: ${theme.colors.accentText};
            border-color: ${theme.colors.accentLine};
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
          }
        `}

  span.count {
    font-size: 11px;
    padding: 1px 6px;
    border-radius: ${({ theme }) => theme.radii.full};
    margin-left: 2px;
    font-weight: 600;
  }
`;

/* ── Active Topic Spotlight Banner ───────────────────────────────────────── */

const TopicSpotlight = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  border-radius: ${({ theme }) => theme.radii.xl};
  flex-wrap: wrap;
`;

const TopicSpotlightLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TopicIconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentSolid};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);

  svg {
    width: 22px;
    height: 22px;
  }
`;

const TopicName = styled.h2`
  ${display('xs')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
`;

const TopicSub = styled.p`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ── Content Feed Section ────────────────────────────────────────────────── */

const FeedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`;

const FeedTitle = styled.h2`
  ${display('sm')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FeedMeta = styled.span`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 400;
  margin-left: 8px;
`;

const ViewControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ theme }) => theme.colors.surfaceContainer};
  padding: 3px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const ViewButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.surfaceElevated : 'transparent')};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accentSolid : theme.colors.textSecondary};
  box-shadow: ${({ $active }) => ($active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none')};
  ${interactive}

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FeedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const FeedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.down('lg')`grid-template-columns: repeat(2, 1fr);`}
  ${media.down('sm')`grid-template-columns: 1fr;`}
`;

/* ── Search Results Card ─────────────────────────────────────────────────── */

const ResultCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
  ${interactive}

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentLine};
    transform: translateY(-3px);
    box-shadow:
      0 12px 28px -6px rgba(15, 23, 42, 0.08),
      0 0 16px -2px rgba(14, 165, 233, 0.15);
  }
`;

const ResultTitle = styled.h3`
  ${text('lg', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(2)}
  line-height: 1.35;
  transition: color ${({ theme }) => theme.transitions.fast};

  ${ResultCard}:hover & {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const ResultExcerpt = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.65;
  ${clamp(3)}
`;

const ResultFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  border: 1px dashed ${({ theme }) => theme.colors.lineDefault};

  p {
    ${text('md')}
    color: ${({ theme }) => theme.colors.textSecondary};
    max-width: 460px;
    line-height: 1.6;
  }
`;

const POPULAR_SUGGESTIONS = [
  'Web Development',
  'Design Systems',
  'Artificial Intelligence',
  'Productivity',
  'Architecture',
  'React',
];

/* ── Main Component ──────────────────────────────────────────────────────── */

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const topic = searchParams.get('topic') || searchParams.get('category') || '';

  const [draft, setDraft] = useState(query);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  useEffect(() => setDraft(query), [query]);

  // Debounced query update in URL
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
    queryKey: ['search', query],
    queryFn: () => searchService.search(query),
    enabled: Boolean(query),
  });

  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts', { topic }],
    queryFn: () => postService.getPosts({ limit: 24, ...(topic && { category: topic }) }),
    enabled: !query,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const categories = categoriesData?.data || [];
  const results = searchData?.data || [];
  const browsePosts = useMemo(() => postsData?.data || [], [postsData]);

  const setTopic = (name) => {
    const next = new URLSearchParams(searchParams);
    if (name && name !== topic) {
      next.set('topic', name);
      next.delete('category');
    } else {
      next.delete('topic');
      next.delete('category');
    }
    setSearchParams(next, { replace: true });
  };

  const clearSearch = () => {
    setDraft('');
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const TopicIconComp = topicIcon(topic);

  return (
    <PageShell>
      {/* ── 1. Explore Hero & Search Bar ─────────────────────────────────── */}
      <HeroWrapper>
        <AmbientAura />
        <div>
          <HeroBadge>
            <Sparkles /> Curated Discovery & Topics
          </HeroBadge>
          <HeroTitle style={{ marginTop: 10, marginBottom: 8 }}>
            Explore Stories & <span className="gradient-text">Fresh Perspectives</span>
          </HeroTitle>
          <HeroSubtitle>
            Find in-depth technical breakdowns, creative thoughts, and thoughtful essays from
            creators around the globe.
          </HeroSubtitle>
        </div>

        <SearchInputWrapper>
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search stories by title, topic, or keywords…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Search stories"
            autoFocus={Boolean(query)}
          />
          {draft && (
            <button className="clear-btn" onClick={clearSearch} title="Clear search">
              <X size={16} />
            </button>
          )}
        </SearchInputWrapper>

        <QuickSuggestionsRow>
          <span className="label">
            <TrendingUp size={13} /> Trending Searches:
          </span>
          {POPULAR_SUGGESTIONS.map((suggestion) => (
            <SuggestionBadge
              key={suggestion}
              onClick={() => {
                setDraft(suggestion);
                const next = new URLSearchParams(searchParams);
                next.set('q', suggestion);
                setSearchParams(next);
              }}
            >
              {suggestion}
            </SuggestionBadge>
          ))}
        </QuickSuggestionsRow>
      </HeroWrapper>

      {/* ── 2. Topic Filter Bar ──────────────────────────────────────────── */}
      {!query && (
        <FilterRow>
          <TopicPill $selected={!topic} onClick={() => setTopic('')}>
            <Flame size={14} />
            All Stories
          </TopicPill>
          {categories.map((category) => {
            const Icon = topicIcon(category.name);
            const isSelected = topic.toLowerCase() === category.name.toLowerCase();
            return (
              <TopicPill
                key={category._id}
                $selected={isSelected}
                onClick={() => setTopic(category.name)}
              >
                <Icon size={14} />
                {category.name}
                {category.postCount ? <span className="count">{category.postCount}</span> : null}
              </TopicPill>
            );
          })}
        </FilterRow>
      )}

      {/* ── 3. Active Topic Showcase Banner ──────────────────────────────── */}
      {!query && topic && (
        <TopicSpotlight>
          <TopicSpotlightLeft>
            <TopicIconWrap>
              {topic ? createElement(TopicIconComp, { size: 22 }) : <Compass size={22} />}
            </TopicIconWrap>
            <div>
              <TopicName>{topic}</TopicName>
              <TopicSub>
                {loadingPosts
                  ? 'Loading stories…'
                  : `Showing ${browsePosts.length} ${browsePosts.length === 1 ? 'published article' : 'published articles'}`}
              </TopicSub>
            </div>
          </TopicSpotlightLeft>

          <Button size="sm" variant="secondary" onClick={() => setTopic('')}>
            <RotateCcw size={14} /> View All Topics
          </Button>
        </TopicSpotlight>
      )}

      {/* ── 4. Main Feed / Search Results ────────────────────────────────── */}
      <div>
        <FeedHeader>
          <FeedTitle>
            {query ? (
              <>
                Search results for “{query}”
                <FeedMeta>
                  ({searching ? 'Searching…' : `${results.length} found`})
                </FeedMeta>
              </>
            ) : topic ? (
              <>
                {topic}
                <FeedMeta>({browsePosts.length})</FeedMeta>
              </>
            ) : (
              <>
                All Stories
                <FeedMeta>({browsePosts.length})</FeedMeta>
              </>
            )}
          </FeedTitle>

          {!query && (
            <ViewControls>
              <ViewButton
                $active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
                title="List View"
                aria-label="List View"
              >
                <List />
              </ViewButton>
              <ViewButton
                $active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid />
              </ViewButton>
            </ViewControls>
          )}
        </FeedHeader>

        {query ? (
          /* Search Results Mode */
          searching ? (
            <FeedList>
              {Array.from({ length: 4 }).map((_, i) => (
                <PostCardSkeleton key={i} layout="row" />
              ))}
            </FeedList>
          ) : results.length === 0 ? (
            <EmptyContainer>
              <SearchIcon size={40} style={{ opacity: 0.4 }} />
              <h3>No matching stories found</h3>
              <p>
                We couldn't find any articles matching “{query}”. Try different search terms or
                explore popular topics above.
              </p>
              <Button size="md" variant="secondary" onClick={clearSearch}>
                Clear Search
              </Button>
            </EmptyContainer>
          ) : (
            <FeedList>
              {results.map((result) => (
                <ResultCard key={result._id} to={`/post/${result._id}`}>
                  <ResultTitle>{result.title}</ResultTitle>
                  <ResultExcerpt>
                    {result.truncatedContent
                      ? excerpt(result.truncatedContent, 220)
                      : excerpt(result.content, 220)}
                  </ResultExcerpt>
                  <ResultFooter>
                    <span>
                      <Clock size={13} /> {readingTime(result.content || '')} min read
                    </span>
                    <span style={{ color: '#0284c7', fontWeight: 600 }}>
                      Read article <ArrowRight size={13} />
                    </span>
                  </ResultFooter>
                </ResultCard>
              ))}
            </FeedList>
          )
        ) : /* Browse Mode */
        loadingPosts ? (
          viewMode === 'grid' ? (
            <FeedGrid>
              {Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={i} layout="stacked" />
              ))}
            </FeedGrid>
          ) : (
            <FeedList>
              {Array.from({ length: 4 }).map((_, i) => (
                <PostCardSkeleton key={i} layout="row" />
              ))}
            </FeedList>
          )
        ) : browsePosts.length === 0 ? (
          <EmptyContainer>
            <Feather size={40} style={{ opacity: 0.4 }} />
            <h3>No stories published in this category yet</h3>
            <p>
              {topic
                ? `Be the first storyteller to publish an article in ${topic}!`
                : 'Stories will appear here as writers in the community publish them.'}
            </p>
            <Button size="md" onClick={() => navigate('/write')}>
              <PenLine size={15} /> Write a Story
            </Button>
          </EmptyContainer>
        ) : viewMode === 'grid' ? (
          <FeedGrid>
            {browsePosts.map((post) => (
              <PostCard key={post._id} post={post} layout="stacked" />
            ))}
          </FeedGrid>
        ) : (
          <FeedList>
            {browsePosts.map((post) => (
              <PostCard key={post._id} post={post} layout="row" />
            ))}
          </FeedList>
        )}
      </div>
    </PageShell>
  );
}
