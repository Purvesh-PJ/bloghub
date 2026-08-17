import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { Search as SearchIcon, Compass, TrendingUp, X, Clock, BookOpen } from 'lucide-react';

import { searchService } from '../services/searchService';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { PageShell, Section } from '../components/layout/PageShell';
import { PostCard } from '../components/posts/PostCard';
import { PostCardSkeleton } from '../components/posts/PostCardSkeleton';
import { topicIcon } from '../components/marketing/Topics';
import { Chip, EmptyState, Card, Skeleton, SkeletonText } from '../components/ui';
import { text, clamp, media } from '../styles/theme/mixins';
import { excerpt, readingTime } from '../utils/text';

/* ── Styled Components ───────────────────────────────────────────────────── */

const SearchHero = styled.div`
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.surfaceContainerLow} 0%,
    transparent 100%
  );
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing['2xl']};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 680px;

  input {
    height: 52px;
    font-size: 16px;
    padding-left: 48px;
    padding-right: 40px;
    border-radius: ${({ theme }) => theme.radii.full};
    border: 1.5px solid ${({ theme }) => theme.colors.lineDefault};
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);

    &:focus {
      border-color: ${({ theme }) => theme.colors.accentSolid};
      box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.18);
    }
  }

  .search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.accentSolid};
    pointer-events: none;
  }

  .clear-btn {
    position: absolute;
    right: 14px;
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

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceContainer};
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const QuickFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const QuickFilterLabel = styled.span`
  ${text('xs', 'semibold')}
  color: ${({ theme }) => theme.colors.textMuted};
  margin-right: 4px;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: ${({ theme }) => theme.spacing['3xl']};
  align-items: start;

  ${media.down('lg')`grid-template-columns: 1fr;`}
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ResultsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ResultCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentLine};
    transform: translateY(-2px);
    box-shadow:
      0 10px 25px -5px rgba(15, 23, 42, 0.06),
      0 0 10px -2px rgba(14, 165, 233, 0.1);
  }
`;

const ResultTitle = styled.h3`
  ${text('lg', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(2)}
  transition: color ${({ theme }) => theme.transitions.fast};

  ${ResultCard}:hover & {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const ResultExcerpt = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  ${clamp(2)}
`;

const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  padding-top: ${({ theme }) => theme.spacing.xs};

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

const TopicSection = styled.div`
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
`;

const TopicTitle = styled.h4`
  ${text('sm', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const TopicChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

/* ── Main Component ──────────────────────────────────────────────────────── */

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const topic = searchParams.get('topic') || '';

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

  // The topic goes to the server. Filtering a fetched page of twenty client-side meant
  // picking a topic showed only the stories in it that happened to be among the twenty most
  // recent — "Programming" returned two while eight published Programming stories existed.
  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts', { topic }],
    queryFn: () => postService.getPosts({ limit: 20, ...(topic && { category: topic }) }),
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
    if (name && name !== topic) next.set('topic', name);
    else next.delete('topic');
    setSearchParams(next, { replace: true });
  };

  const clearSearch = () => {
    setDraft('');
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next, { replace: true });
  };

  return (
    <PageShell>
      {/* ── Search Hero ──────────────────────────────────────────────────── */}
      <SearchHero>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
            Explore Stories & Topics
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Discover top-read articles, engineering insights, and tech tutorials from writers
            worldwide.
          </p>
        </div>

        <SearchInputWrapper>
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search by keywords, tags, or story titles…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Search stories"
          />
          {draft && (
            <button className="clear-btn" onClick={clearSearch} title="Clear search">
              <X size={16} />
            </button>
          )}
        </SearchInputWrapper>

        <QuickFilterRow>
          <QuickFilterLabel>Popular:</QuickFilterLabel>
          {['Technology', 'Design', 'Programming', 'Science', 'Food'].map((name) => (
            <Chip
              key={name}
              size="sm"
              selected={topic.toLowerCase() === name.toLowerCase()}
              onClick={() => setTopic(name)}
            >
              {name}
            </Chip>
          ))}
          {topic && (
            <Chip size="sm" onClick={() => setTopic('')}>
              ✕ Clear Filter
            </Chip>
          )}
        </QuickFilterRow>
      </SearchHero>

      {/* ── Results / Content Section ────────────────────────────────────── */}
      {query ? (
        <Section
          title={`Search Results for “${query}”`}
          note={
            searching
              ? 'Searching…'
              : `${results.length} ${results.length === 1 ? 'result' : 'results'}`
          }
        >
          {searching ? (
            <ResultsGrid>
              {Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
                >
                  <Skeleton $width="80%" $height={22} $radius="xs" />
                  <SkeletonText lines={3} lineHeight="14px" lastLineWidth="60%" gap="xs" />
                  <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <Skeleton $width={60} $height={14} $radius="xs" />
                    <Skeleton $width={70} $height={14} $radius="xs" />
                  </div>
                </Card>
              ))}
            </ResultsGrid>
          ) : results.length === 0 ? (
            <EmptyState icon={SearchIcon} title="No matching stories">
              We couldn't find any stories matching “{query}”. Try searching for different keywords
              or explore the topics below.
            </EmptyState>
          ) : (
            <ResultsGrid>
              {results.map((result) => (
                <ResultCard key={result._id} to={`/post/${result._id}`}>
                  <ResultTitle>{result.title}</ResultTitle>
                  <ResultExcerpt>
                    {result.truncatedContent
                      ? excerpt(result.truncatedContent, 220)
                      : excerpt(result.content, 220)}
                  </ResultExcerpt>
                  <ResultMeta>
                    <span>
                      <Clock size={13} /> {readingTime(result.content || '')}
                    </span>
                    <span>
                      <BookOpen size={13} /> Read story
                    </span>
                  </ResultMeta>
                </ResultCard>
              ))}
            </ResultsGrid>
          )}
        </Section>
      ) : (
        <Columns>
          <Section
            title={topic ? `Stories in ${topic}` : 'Featured & Recent Stories'}
            note={loadingPosts ? 'Loading…' : `${browsePosts.length} stories`}
          >
            {loadingPosts ? (
              <Feed>
                {Array.from({ length: 4 }).map((_, i) => (
                  <PostCardSkeleton key={i} layout="row" />
                ))}
              </Feed>
            ) : browsePosts.length === 0 ? (
              <EmptyState
                icon={Compass}
                title={topic ? `Nothing published in ${topic} yet` : 'No stories found'}
              >
                {topic
                  ? 'Be the first to publish a story in this topic!'
                  : 'Stories will show up here as creators write them.'}
              </EmptyState>
            ) : (
              <Feed>
                {browsePosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </Feed>
            )}
          </Section>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <TopicSection>
              <TopicTitle>
                <TrendingUp /> Browse All Categories
              </TopicTitle>
              <TopicChipList>
                {categories.map((category) => {
                  const Icon = topicIcon(category.name);
                  const isSelected = topic.toLowerCase() === category.name.toLowerCase();
                  return (
                    <Chip
                      key={category._id}
                      size="sm"
                      selected={isSelected}
                      onClick={() => setTopic(category.name)}
                    >
                      <Icon size={13} />
                      {category.name}
                    </Chip>
                  );
                })}
              </TopicChipList>
            </TopicSection>
          </aside>
        </Columns>
      )}
    </PageShell>
  );
}
