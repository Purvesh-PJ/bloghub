import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const getMyPosts = vi.fn();
const createPost = vi.fn().mockResolvedValue({ success: true, postId: 'new_p1' });
const updatePost = vi.fn().mockResolvedValue({ success: true });
const deletePost = vi.fn().mockResolvedValue({ success: true });
const getPost = vi.fn().mockResolvedValue({ success: true, data: null });

vi.mock('../services/postService', () => ({
  postService: {
    getMyPosts: (...args) => getMyPosts(...args),
    createPost: (...args) => createPost(...args),
    updatePost: (...args) => updatePost(...args),
    deletePost: (...args) => deletePost(...args),
    getPost: (...args) => getPost(...args),
  },
}));

const getTags = vi.fn();
vi.mock('../services/tagService', () => ({
  tagService: { getTags: (...args) => getTags(...args) },
}));

const getMyAnalytics = vi.fn();
vi.mock('../../analytics/services/analyticsService', () => ({
  analyticsService: { getMyAnalytics: (...args) => getMyAnalytics(...args) },
}));

// Mock useNavigationGuard to avoid requiring Data Router in unit tests
vi.mock('../hooks/useDraftRecovery', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigationGuard: () => {},
  };
});

const { renderWithProviders } = await import('../../../test/render');
const { WritePost, Stories } = await import('../');

describe('WritePost Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    getTags.mockResolvedValue({ data: [{ name: 'javascript' }, { name: 'react' }] });
    getMyAnalytics.mockResolvedValue({ data: { postsAnalytics: [] } });
  });

  it('renders blank editor inputs and heading', () => {
    renderWithProviders(<WritePost />, {
      route: '/write',
      path: '/write',
      user: { user_id: 'writer_1', username: 'author' },
    });

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('shows draft recovery banner if an unsaved draft was stored', async () => {
    const savedDraft = {
      title: 'Recovered Draft Story',
      content: 'Important unsaved article thoughts',
      savedAt: Date.now() - 5000,
    };
    localStorage.setItem('bloghub:draft:new', JSON.stringify(savedDraft));

    renderWithProviders(<WritePost />, {
      route: '/write',
      path: '/write',
      user: { user_id: 'writer_1', username: 'author' },
    });

    expect(await screen.findByRole('button', { name: 'Restore it' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
  });

  it('restores draft into inputs when Restore it is clicked', async () => {
    const user = userEvent.setup();
    const savedDraft = {
      title: 'Recovered Draft Story',
      content: 'Important unsaved article thoughts',
      savedAt: Date.now() - 5000,
    };
    localStorage.setItem('bloghub:draft:new', JSON.stringify(savedDraft));

    renderWithProviders(<WritePost />, {
      route: '/write',
      path: '/write',
      user: { user_id: 'writer_1', username: 'author' },
    });

    await user.click(await screen.findByRole('button', { name: 'Restore it' }));

    expect(screen.getByPlaceholderText('Title')).toHaveValue('Recovered Draft Story');
  });

  it('creates a new post when restored draft is saved', async () => {
    const user = userEvent.setup();
    const savedDraft = {
      title: 'Mastering React 19 Testing',
      content: 'Comprehensive testing guide with Vitest...',
      savedAt: Date.now() - 5000,
    };
    localStorage.setItem('bloghub:draft:new', JSON.stringify(savedDraft));

    renderWithProviders(<WritePost />, {
      route: '/write',
      path: '/write',
      user: { user_id: 'writer_1', username: 'author' },
    });

    await user.click(await screen.findByRole('button', { name: 'Restore it' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(createPost).toHaveBeenCalled();
    expect(createPost.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        title: 'Mastering React 19 Testing',
        content: 'Comprehensive testing guide with Vitest...',
        visibility: 'draft',
      })
    );
  });
});

describe('Stories Workspace Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMyAnalytics.mockResolvedValue({ data: { postsAnalytics: [] } });
  });

  it('renders stories list with titles and stats', async () => {
    getMyPosts.mockResolvedValue({
      data: [
        {
          _id: 'story_1',
          title: 'First Workspace Story',
          visibility: 'public',
          createdAt: new Date().toISOString(),
          views: 120,
          likes: ['u1', 'u2'],
          comments: [],
        },
      ],
      pagination: { total: 1, page: 1, limit: 10, pages: 1 },
      counts: { all: 1, public: 1, draft: 0, private: 0 },
    });

    renderWithProviders(<Stories />, {
      route: '/stories',
      path: '/stories',
      user: { user_id: 'author_1', username: 'author' },
    });

    expect(await screen.findByText('First Workspace Story')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All (1)' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by title…')).toBeInTheDocument();
  });

  it('renders empty state when user has not written any stories', async () => {
    getMyPosts.mockResolvedValue({
      data: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 0 },
      counts: { all: 0, public: 0, draft: 0, private: 0 },
    });

    renderWithProviders(<Stories />, {
      route: '/stories',
      path: '/stories',
      user: { user_id: 'author_1', username: 'author' },
    });

    expect(await screen.findByText(/Nothing written yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Write your first story/i })).toBeInTheDocument();
  });
});
