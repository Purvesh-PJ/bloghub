import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { Search as SearchIcon, Compass } from 'lucide-react';

import { searchService } from '../services/searchService';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { PageShell, PageHeader, Section } from '../components/layout/PageShell';
import { PostCard } from '../components/posts/PostCard';
import { topicIcon } from '../components/marketing/Topics';
import { Input, Chip, Loading, EmptyState, Card } from '../components/ui';
import { text, clamp, media } from '../styles/theme/mixins';
import { excerpt } from '../utils/text';
import { Link } from 'react-router-dom';

/**
 * Explore.
 *
 * The header's Explore link and its search button both pointed here, and the page had no
 * search field on it — it only read ?q= from the URL. Arriving from either control landed
 * you on a page that said "Enter a search term to find posts" and gave you nowhere to type
 * one. It is now a page you can actually browse from: a field, the topic list, and recent
 * work when you have not asked for anything specific.
 */

const Field = styled.div`
  max-width: 520px;
`;

const Topics = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;
`;

const Result = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }

  & + & {
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.lineSubtle};
  }
`;

const ResultTitle = styled.span`
  ${text('lg', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(1)}
`;

const ResultText = styled.span`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  ${clamp(2)}
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: ${({ theme }) => theme.spacing['2xl']};
  align-items: start;

  ${media.down('lg')`grid-template-columns: 1fr;`}
`;

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const topic = searchParams.get('topic') || '';

  const [draft, setDraft] = useState(query);

  useEffect(() => setDraft(query), [query]);

  // Debounced, so the URL and the request follow typing without a round trip per keystroke.
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
    queryKey: ['posts'],
    queryFn: () => postService.getPosts(),
    enabled: !query,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const categories = categoriesData?.data || [];
  const results = searchData?.data || [];

  const browsePosts = useMemo(() => {
    const posts = postsData?.data || [];
    if (!topic) return posts;
    return posts.filter((post) =>
      (post.categories || []).some((category) => (category?.name ?? category) === topic)
    );
  }, [postsData, topic]);

  const setTopic = (name) => {
    const next = new URLSearchParams(searchParams);
    if (name && name !== topic) next.set('topic', name);
    else next.delete('topic');
    setSearchParams(next, { replace: true });
  };

  return (
    <PageShell>
      <PageHeader
        title="Explore"
        subtitle="Search for something specific, or browse by topic."
        actions={
          <Field>
            <Input
              icon={<SearchIcon />}
              placeholder="Search posts"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Search posts"
            />
          </Field>
        }
      />

      {query ? (
        <Section
          title={`Results for “${query}”`}
          note={
            searching ? undefined : `${results.length} ${results.length === 1 ? 'post' : 'posts'}`
          }
        >
          {searching ? (
            <Loading text="Searching…" />
          ) : results.length === 0 ? (
            <EmptyState icon={SearchIcon} title="Nothing found">
              No post matches “{query}”. Try a shorter phrase, or browse the topics instead.
            </EmptyState>
          ) : (
            <Card tone="low" radius="xl" padding="sm">
              <Results>
                {results.map((result) => (
                  <Result key={result._id} to={`/post/${result._id}`}>
                    <ResultTitle>{result.title}</ResultTitle>
                    <ResultText>
                      {result.truncatedContent
                        ? excerpt(result.truncatedContent, 200)
                        : excerpt(result.content, 200)}
                    </ResultText>
                  </Result>
                ))}
              </Results>
            </Card>
          )}
        </Section>
      ) : (
        <Columns>
          <Section title={topic || 'Recent work'}>
            {loadingPosts ? (
              <Loading text="Loading posts…" />
            ) : browsePosts.length === 0 ? (
              <EmptyState
                icon={Compass}
                title={topic ? `Nothing filed under ${topic} yet` : 'Nothing published yet'}
              >
                {topic
                  ? 'Pick another topic, or clear the filter to see everything.'
                  : 'Posts will appear here as people publish them.'}
              </EmptyState>
            ) : (
              <Feed>
                {browsePosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </Feed>
            )}
          </Section>

          <Section title="Topics">
            <Topics>
              {categories.map((category) => {
                const Icon = topicIcon(category.name);
                return (
                  <Chip
                    key={category._id}
                    size="sm"
                    selected={topic === category.name}
                    onClick={() => setTopic(category.name)}
                  >
                    <Icon />
                    {category.name}
                  </Chip>
                );
              })}
            </Topics>
          </Section>
        </Columns>
      )}
    </PageShell>
  );
}
