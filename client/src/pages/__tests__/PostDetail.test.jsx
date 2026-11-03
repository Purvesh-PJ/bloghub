import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const getPost = vi.fn();
const deletePost = vi.fn();
vi.mock('../../services/postService', () => ({
  postService: {
    getPost: (...args) => getPost(...args),
    deletePost: (...args) => deletePost(...args),
  },
}));

const likePost = vi.fn().mockResolvedValue({ success: true });
const unlikePost = vi.fn().mockResolvedValue({ success: true });
vi.mock('../../services/likeService', () => ({
  likeService: {
    likePost: (...args) => likePost(...args),
    unlikePost: (...args) => unlikePost(...args),
  },
}));

const createComment = vi.fn().mockResolvedValue({ success: true });
const deleteComment = vi.fn().mockResolvedValue({ success: true });
vi.mock('../../services/commentService', () => ({
  commentService: {
    createComment: (...args) => createComment(...args),
    deleteComment: (...args) => deleteComment(...args),
  },
}));

const trackPageView = vi.fn().mockResolvedValue({});
const getPageViewCount = vi.fn().mockResolvedValue({ count: 42 });
const trackPostRead = vi.fn().mockResolvedValue({});
const getPostAnalytics = vi.fn().mockResolvedValue({ data: {} });
vi.mock('../../services/analyticsService', () => ({
  analyticsService: {
    trackPageView,
    getPageViewCount,
    trackPostRead,
    getPostAnalytics,
  },
}));

const { renderWithProviders } = await import('../../test/render');
const { PostDetail } = await import('../PostDetail');

const mockPost = {
  _id: 'post_101',
  title: 'Engineering at Scale with Node and React',
  content: 'Here is a deep dive into building maintainable full-stack software.',
  visibility: 'public',
  createdAt: new Date().toISOString(),
  user: {
    _id: 'author_1',
    username: 'techlead',
    profile: {
      bio: 'Staff Engineer & Architect',
      hasAvatar: false,
    },
  },
  likes: [],
  comments: [
    {
      _id: 'comment_1',
      message: 'Excellent insights on system architecture!',
      user: { _id: 'user_commenter', username: 'reader_dan' },
      createdAt: new Date().toISOString(),
      replies: [],
    },
  ],
};

describe('PostDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    trackPageView.mockReturnValue(Promise.resolve({}));
    getPageViewCount.mockReturnValue(Promise.resolve({ count: 42 }));
    trackPostRead.mockReturnValue(Promise.resolve({}));
    getPostAnalytics.mockReturnValue(Promise.resolve({ data: {} }));
  });

  it('renders post title, content, author, and comments list', async () => {
    getPost.mockResolvedValue({ success: true, data: mockPost });

    renderWithProviders(<PostDetail />, {
      route: '/post/post_101',
      path: '/post/:id',
    });

    expect(await screen.findByText('Engineering at Scale with Node and React')).toBeInTheDocument();
    expect(screen.getByText('techlead')).toBeInTheDocument();
    expect(screen.getByText('Excellent insights on system architecture!')).toBeInTheDocument();
    expect(screen.getByText('reader_dan')).toBeInTheDocument();
  });

  it('renders 404 state when post cannot be found', async () => {
    getPost.mockRejectedValue({
      response: { status: 404, data: { message: 'Post not found' } },
    });

    renderWithProviders(<PostDetail />, {
      route: '/post/non_existent',
      path: '/post/:id',
    });

    expect(await screen.findByText(/This post is not here/i)).toBeInTheDocument();
  });

  it('allows authenticated reader to like the post', async () => {
    const user = userEvent.setup();
    getPost.mockResolvedValue({ success: true, data: mockPost });

    renderWithProviders(<PostDetail />, {
      route: '/post/post_101',
      path: '/post/:id',
      user: { user_id: 'reader_user', username: 'bob', roles: ['user'] },
    });

    expect(await screen.findByText('Engineering at Scale with Node and React')).toBeInTheDocument();

    const likeButtons = screen.getAllByRole('button', { name: /like/i });
    expect(likeButtons.length).toBeGreaterThan(0);
    await user.click(likeButtons[0]);

    expect(likePost).toHaveBeenCalledWith('post_101');
  });

  it('allows authenticated user to submit a response comment', async () => {
    const user = userEvent.setup();
    getPost.mockResolvedValue({ success: true, data: mockPost });

    renderWithProviders(<PostDetail />, {
      route: '/post/post_101',
      path: '/post/:id',
      user: { user_id: 'reader_user', username: 'bob', roles: ['user'] },
    });

    expect(await screen.findByText('Engineering at Scale with Node and React')).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/What did you make of it/i);
    await user.type(textarea, 'Insightful read, thanks!');
    await user.click(screen.getByRole('button', { name: /Respond/i }));

    expect(createComment).toHaveBeenCalledWith({
      userId: 'reader_user',
      postId: 'post_101',
      message: 'Insightful read, thanks!',
    });
  });

  it('displays edit button only when current viewer is the author', async () => {
    getPost.mockResolvedValue({ success: true, data: mockPost });

    // Render as non-author
    const { unmount } = renderWithProviders(<PostDetail />, {
      route: '/post/post_101',
      path: '/post/:id',
      user: { user_id: 'other_user', username: 'other' },
    });

    await screen.findByText('Engineering at Scale with Node and React');
    expect(screen.queryByRole('link', { name: /Edit/i })).not.toBeInTheDocument();

    unmount();

    // Render as author
    renderWithProviders(<PostDetail />, {
      route: '/post/post_101',
      path: '/post/:id',
      user: { user_id: 'author_1', username: 'techlead' },
    });

    await screen.findByText('Engineering at Scale with Node and React');
    expect(screen.getByRole('link', { name: /Edit/i })).toBeInTheDocument();
  });
});
