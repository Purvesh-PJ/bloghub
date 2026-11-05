import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

const getTrending = vi.fn();
const getPosts = vi.fn();
vi.mock('../services/postService', () => ({
  postService: {
    getTrending: (...args) => getTrending(...args),
    getPosts: (...args) => getPosts(...args),
  },
}));

const search = vi.fn();
vi.mock('../services/searchService', () => ({
  searchService: {
    search: (...args) => search(...args),
  },
}));

const getTags = vi.fn();
vi.mock('../services/tagService', () => ({
  tagService: {
    getTags: (...args) => getTags(...args),
  },
}));

const { renderWithProviders } = await import('../../../test/render');
const { Home, Search } = await import('../');

const mockTrendingPosts = [
  {
    _id: 'post_trending_1',
    title: 'The Future of AI and Agentic Systems',
    content: 'Exploring agent workflows and generative patterns.',
    truncatedContent: 'Exploring agent workflows and generative patterns.',
    createdAt: new Date().toISOString(),
    visibility: 'public',
    user: {
      _id: 'user_1',
      username: 'deepdev',
      profile: { hasAvatar: false },
    },
    likesCount: 15,
    viewsCount: 300,
  },
];

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getTags.mockResolvedValue({
      success: true,
      data: [{ _id: 'tag_1', name: 'technology', postCount: 5 }],
    });
    getPosts.mockResolvedValue({
      success: true,
      data: [],
    });
  });

  it('renders hero title and trending posts when loaded', async () => {
    getTrending.mockResolvedValue({
      success: true,
      data: mockTrendingPosts,
      trendedBy: 'engagement',
      window: 14,
    });

    renderWithProviders(<Home />, {
      user: null,
      route: '/',
    });

    // Hero title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Where ideas find their voice/i);
    expect(screen.getAllByText('Start Writing for Free').length).toBeGreaterThan(0);

    // Trending posts
    await waitFor(() => {
      expect(screen.getByText('The Future of AI and Agentic Systems')).toBeInTheDocument();
    });
  });

  it('renders creator studio button when user is authenticated', async () => {
    getTrending.mockResolvedValue({
      success: true,
      data: [],
    });

    renderWithProviders(<Home />, {
      user: { _id: 'u1', username: 'author' },
      route: '/',
    });

    expect(screen.getAllByText('Open Creator Studio').length).toBeGreaterThan(0);
  });
});

describe('Search Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getTags.mockResolvedValue({
      success: true,
      data: [{ _id: 'tag_1', name: 'react', postCount: 10 }],
    });
    getPosts.mockResolvedValue({
      success: true,
      data: [],
    });
  });

  it('renders search input and shows browse heading when no query is provided', async () => {
    renderWithProviders(<Search />, {
      route: '/search',
    });

    const searchInput = screen.getByRole('textbox', { name: 'Search stories' });
    expect(searchInput).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Explore Stories' })).toBeInTheDocument();
  });

  it('executes search and displays returned posts', async () => {
    search.mockResolvedValue({
      success: true,
      data: mockTrendingPosts,
    });

    renderWithProviders(<Search />, {
      route: '/search?q=Agentic',
    });

    await waitFor(() => {
      expect(search).toHaveBeenCalledWith('Agentic');
      expect(screen.getByText('The Future of AI and Agentic Systems')).toBeInTheDocument();
    });
  });

  it('shows no results empty state when query returns empty array', async () => {
    search.mockResolvedValue({
      success: true,
      data: [],
    });

    renderWithProviders(<Search />, {
      route: '/search?q=NonExistentTerm',
    });

    await waitFor(() => {
      expect(screen.getByText('No matching stories found')).toBeInTheDocument();
    });
  });
});
