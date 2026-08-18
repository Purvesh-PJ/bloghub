import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
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
import { tagService } from '../services/tagService';
import { PageShell } from '../components/layout/PageShell';
import { PostCard } from '../components/posts/PostCard';
import { PostCardSkeleton } from '../components/posts/PostCardSkeleton';
import { topicIcon } from '../components/marketing/Topics';
import { Button, Chip, EmptyState } from '../components/ui';
import { display, text, clamp, media, interactive } from '../styles/theme/mixins';
import { excerpt, readingTime } from '../utils/text';

/* ── Styled Components (All using Design Tokens & Primitives) ────────────── */

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  border-bottom: none;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 0;
`;

const HeaderIconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentSolid};
  flex-shrink: 0;

  svg {
    width: 26px;
    height: 26px;
  }
`;

const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Title = styled.h1`
  ${display('sm')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 800;
  letter-spacing: -0.025em;
`;

const Subtitle = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 54ch;
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 360px;

  ${media.down('sm')`
    max-width: 100%;
  `}

  input {
    width: 100%;
    height: 42px;
    font-size: 14px;
    padding-left: 40px;
    padding-right: 36px;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ theme }) => theme.colors.surfaceContainer};
    color: ${({ theme }) => theme.colors.textPrimary};
    border: none;
    transition: all ${({ theme }) => theme.transitions.fast};

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }

    &:focus {
      outline: none;
      background: ${({ theme }) => theme.colors.surfaceElevated};
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.18);
    }
  }

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.accentSolid};
    pointer-events: none;
  }

  .clear-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceContainerHigh};
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const CategoryNav = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing.xs} 2px ${({ theme }) => theme.spacing.sm} 2px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ActiveFilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const ActiveFilterText = styled.span`
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${({ theme }) => theme.colors.accentSolid};
  }

  span.count {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 400;
  }
`;

/* ── Editorial Grid Containers ───────────────────────────────────────────── */

const FeaturedSpotlight = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const EditorialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.down('lg')`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.down('sm')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

/* ── Search Results Card ─────────────────────────────────────────────────── */

const SearchResultCard = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: none;
  text-decoration: none;
  transition: background ${({ theme }) => theme.transitions.fast}, box-shadow ${({ theme }) => theme.transitions.fast};
  box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    box-shadow:
      0 12px 24px -6px rgba(15, 23, 42, 0.06),
      0 0 12px -2px rgba(14, 165, 233, 0.1);
  }
`;

const SearchResultTitle = styled.h3`
  ${text('md', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(2)}
  line-height: 1.35;
  transition: color ${({ theme }) => theme.transitions.fast};

  ${SearchResultCard}:hover & {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const SearchResultExcerpt = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  ${clamp(3)}
`;

const SearchResultFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.xs};
  border-top: none;
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

/* ── Main Component ──────────────────────────────────────────────────────── */

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const topic = searchParams.get('topic') || searchParams.get('category') || '';

  const [draft, setDraft] = useState(query);

  useEffect(() => setDraft(query), [query]);

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
    queryKey: ['search', query],
    queryFn: () => searchService.search(query),
    enabled: Boolean(query),
  });

  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts', { topic }],
    queryFn: () => postService.getPosts({ limit: 25, ...(topic && { topic }) }),
    enabled: !query,
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: tagService.getTags,
  });

  const tags = tagsData?.data || [];
  const activeTags = tags.filter((t) => (t.postCount ?? 0) > 0);
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
  const leadPost = hasPosts ? browsePosts[0] : null;
  const gridPosts = hasPosts ? browsePosts.slice(1) : [];

  return (
    <PageShell>
      {/* ── 1. Clean Top Header: Left Icon, Right Title & Subtitle + Search ─── */}
      <TopBar>
        <HeaderLeft>
          <HeaderIconWrap>
            <Compass />
          </HeaderIconWrap>
          <HeaderTitles>
            <Title>Explore Stories</Title>
            <Subtitle>
              Discover deep-dive breakdowns, engineering essays, and creative perspectives.
            </Subtitle>
          </HeaderTitles>
        </HeaderLeft>

        <SearchBox>
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search stories, tags, or authors…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Search stories"
            autoFocus={Boolean(query)}
          />
          {draft && (
            <button className="clear-btn" onClick={clearSearch} title="Clear search">
              <X size={14} />
            </button>
          )}
        </SearchBox>
      </TopBar>

      {/* ── 2. Dynamic Topic & Tags Navigation Bar ───────────────────────── */}
      {!query && (
        <CategoryNav>
          <Chip size="md" selected={!topic} onClick={() => setTopic('')}>
            <Flame size={14} /> All Stories
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
                <Icon size={14} />
                #{tag.name}
                {tag.postCount ? ` (${tag.postCount})` : ''}
              </Chip>
            );
          })}
        </CategoryNav>
      )}

      {/* ── 3. Active Topic Filter Reset Indicator ───────────────────────── */}
      {!query && topic && (
        <ActiveFilterBar>
          <ActiveFilterText>
            <Sparkles size={16} /> Filtered by <strong>#{topic}</strong>
            <span className="count">
              ({loadingPosts ? '…' : `${browsePosts.length} ${browsePosts.length === 1 ? 'story' : 'stories'}`})
            </span>
          </ActiveFilterText>
          <Button size="sm" variant="ghost" onClick={() => setTopic('')}>
            <RotateCcw size={13} /> Clear filter
          </Button>
        </ActiveFilterBar>
      )}

      {/* ── 4. Main Editorial Grid / Search Results ───────────────────────── */}
      {query ? (
        /* ── Search Results Grid ── */
        searching ? (
          <EditorialGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} layout="stacked" />
            ))}
          </EditorialGrid>
        ) : results.length === 0 ? (
          <EmptyState icon={SearchIcon} title="No matching stories found">
            We couldn't find any articles matching “{query}”. Try different keywords or browse our
            curated categories above.
            <div style={{ marginTop: 12 }}>
              <Button size="sm" variant="secondary" onClick={clearSearch}>
                Clear search
              </Button>
            </div>
          </EmptyState>
        ) : (
          <EditorialGrid>
            {results.map((result) => (
              <SearchResultCard key={result._id} to={`/post/${result._id}`}>
                <div>
                  <SearchResultTitle>{result.title}</SearchResultTitle>
                  <SearchResultExcerpt>
                    {result.truncatedContent
                      ? excerpt(result.truncatedContent, 180)
                      : excerpt(result.content, 180)}
                  </SearchResultExcerpt>
                </div>
                <SearchResultFooter>
                  <span>
                    <Clock size={12} /> {readingTime(result.content || '')} min read
                  </span>
                  <span style={{ color: '#0284c7', fontWeight: 600 }}>
                    Read story <ArrowRight size={12} />
                  </span>
                </SearchResultFooter>
              </SearchResultCard>
            ))}
          </EditorialGrid>
        )
      ) : /* ── Browse Mode (Featured Spotlight + 3-Column Editorial Grid) ── */
      loadingPosts ? (
        <div>
          <FeaturedSpotlight>
            <PostCardSkeleton layout="row" />
          </FeaturedSpotlight>
          <EditorialGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} layout="stacked" />
            ))}
          </EditorialGrid>
        </div>
      ) : !hasPosts ? (
        <EmptyState
          icon={Compass}
          title={topic ? `No stories in ${topic} yet` : 'No stories found'}
        >
          {topic
            ? `Be the very first writer to share an article in ${topic}!`
            : 'Stories will show up here as creators in the community publish them.'}
          <div style={{ marginTop: 12 }}>
            <Button size="sm" onClick={() => navigate('/write')}>
              <PenLine size={13} /> Write a story
            </Button>
          </div>
        </EmptyState>
      ) : (
        <div>
          {/* Lead / Featured Post (Row Layout) */}
          {leadPost && (
            <FeaturedSpotlight>
              <PostCard post={leadPost} layout="row" />
            </FeaturedSpotlight>
          )}

          {/* Remaining Posts (Rich 3-Column Grid with Stacked Layout) */}
          {gridPosts.length > 0 && (
            <EditorialGrid>
              {gridPosts.map((post) => (
                <PostCard key={post._id} post={post} layout="stacked" />
              ))}
            </EditorialGrid>
          )}
        </div>
      )}
    </PageShell>
  );
}
