import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const getMyAnalytics = vi.fn();
const getReadingActivity = vi.fn();
vi.mock('../../analytics/services/analyticsService', () => ({
  analyticsService: {
    getMyAnalytics: (...args) => getMyAnalytics(...args),
    getReadingActivity: (...args) => getReadingActivity(...args),
  },
}));

const getMyPosts = vi.fn();
vi.mock('../../posts/services/postService', () => ({
  postService: {
    getMyPosts: (...args) => getMyPosts(...args),
  },
}));

const getPostComments = vi.fn();
const deleteComment = vi.fn();
vi.mock('../../comments/services/commentService', () => ({
  commentService: {
    getPostComments: (...args) => getPostComments(...args),
    deleteComment: (...args) => deleteComment(...args),
  },
}));

const { renderWithProviders } = await import('../../../test/render');
const { Dashboard } = await import('../');
const { Responses } = await import('../../comments');

const mockUser = {
  _id: 'user_author_1',
  username: 'authorjane',
  name: 'Jane Doe',
  email: 'jane@example.com',
  profile: { bio: 'Author and tech writer' },
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders writer stats and tiles from analytics service', async () => {
    getMyAnalytics.mockResolvedValue({
      success: true,
      data: {
        totalPosts: 3,
        totalViews: 1250,
        totalReads: 850,
        readRate: 68,
        postsAnalytics: [],
      },
    });

    getMyPosts.mockResolvedValue({
      success: true,
      data: [
        {
          _id: 'draft_1',
          title: 'My Upcoming Draft Story',
          visibility: 'draft',
          updatedAt: new Date().toISOString(),
        },
      ],
    });

    getReadingActivity.mockResolvedValue({
      success: true,
      data: { unfinished: [] },
    });

    renderWithProviders(<Dashboard />, {
      user: mockUser,
      route: '/dashboard',
    });

    await waitFor(() => {
      expect(screen.getByText('1250')).toBeInTheDocument();
      expect(screen.getByText('850')).toBeInTheDocument();
      expect(screen.getByText('68%')).toBeInTheDocument();
      expect(screen.getByText('My Upcoming Draft Story')).toBeInTheDocument();
    });
  });

  it('renders first story prompt when user has no published stories', async () => {
    getMyAnalytics.mockResolvedValue({
      success: true,
      data: {
        totalPosts: 0,
        totalViews: 0,
      },
    });
    getMyPosts.mockResolvedValue({ success: true, data: [] });
    getReadingActivity.mockResolvedValue({ success: true, data: { unfinished: [] } });

    renderWithProviders(<Dashboard />, {
      user: mockUser,
      route: '/dashboard',
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Publish your first story' })).toBeInTheDocument();
    });
  });
});

describe('Responses Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when author has no posts', async () => {
    getMyPosts.mockResolvedValue({
      success: true,
      data: [],
    });

    renderWithProviders(<Responses />, {
      user: mockUser,
      route: '/responses',
    });

    await waitFor(() => {
      expect(screen.getByText('Nothing to respond to yet')).toBeInTheDocument();
    });
  });

  it('renders responses for selected post and handles comment deletion', async () => {
    const user = userEvent.setup();

    getMyPosts.mockResolvedValue({
      success: true,
      data: [
        {
          _id: 'post_100',
          title: 'Deep Architecture Guide',
        },
      ],
    });

    getPostComments.mockResolvedValue({
      success: true,
      data: [
        {
          _id: 'comment_1',
          message: 'Fantastic article, learned a lot!',
          createdAt: new Date().toISOString(),
          user: {
            _id: 'reader_1',
            username: 'readerone',
            profile: { hasAvatar: false },
          },
        },
      ],
    });

    deleteComment.mockResolvedValue({ success: true });

    renderWithProviders(<Responses />, {
      user: mockUser,
      route: '/responses',
    });

    await waitFor(() => {
      expect(screen.getByText('Fantastic article, learned a lot!')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole('button', { name: /remove response from readerone/i });
    await user.click(deleteBtn);

    // Confirm modal opens
    expect(screen.getByText(/Remove this response\?/i)).toBeInTheDocument();
    const confirmBtn = screen.getByRole('button', { name: 'Remove' });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(deleteComment).toHaveBeenCalledWith('comment_1');
    });
  });
});
