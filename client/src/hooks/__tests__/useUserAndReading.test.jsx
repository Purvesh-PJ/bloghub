import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCurrentUser } from '../useCurrentUser';
import { useReadingProgress, useReadTracking } from '../useReading';
import { useTags } from '../useTags';
import { userService } from '../../services/userService';
import { analyticsService } from '../../services/analyticsService';
import { tagService } from '../../services/tagService';
import * as AuthModule from '../../context/AuthContext';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCurrentUser hook', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not fetch user profile when unauthenticated', async () => {
    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({ isAuthenticated: false });
    const getUserSpy = vi.spyOn(userService, 'getUser');

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.account).toBeUndefined();
    expect(result.current.avatarUrl).toBeNull();
    expect(result.current.bio).toBe('');
    expect(getUserSpy).not.toHaveBeenCalled();
  });

  it('fetches user profile and constructs avatarUrl when authenticated', async () => {
    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({ isAuthenticated: true });
    vi.spyOn(userService, 'getUser').mockResolvedValue({
      User: {
        _id: 'user_123',
        username: 'alice',
        profile: {
          bio: 'Building reliable software',
          hasAvatar: true,
          avatarUpdatedAt: 1700000000,
        },
      },
    });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.account?.username).toBe('alice');
    expect(result.current.bio).toBe('Building reliable software');
    expect(result.current.avatarUrl).toContain('/api/users/user_123/avatar?v=1700000000');
  });
});

describe('useReading hooks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('useReadingProgress returns 0 when ref is empty', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useReadingProgress(ref));
    expect(result.current).toBe(0);
  });

  it('useReadingProgress updates progress on scroll', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        top: -500,
        height: 1000,
      }),
    };
    const ref = { current: mockElement };
    window.innerHeight = 500; // -(-500) + 500 = 1000 / 1000 = 1.0 -> 100%

    const { result } = renderHook(() => useReadingProgress(ref));

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(100);
  });

  it('useReadTracking calls trackPostRead when reader reaches end and minimum dwell expires', async () => {
    const trackSpy = vi.spyOn(analyticsService, 'trackPostRead').mockResolvedValue({});

    const mockElement = {
      getBoundingClientRect: () => ({
        top: -1000,
        height: 1000,
      }),
    };
    const ref = { current: mockElement };
    window.innerHeight = 1000; // 100% scrolled

    renderHook(() => useReadTracking('post_abc', 'Short content article', ref));

    // Dwell time for 1 minute estimated reading is 18000ms
    act(() => {
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(20000);
    });

    expect(trackSpy).toHaveBeenCalledWith('post_abc');
  });
});

describe('useTags hook', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns all tags and extracted names', async () => {
    vi.spyOn(tagService, 'getTags').mockResolvedValue({
      data: [
        { name: 'react', postCount: 5 },
        { name: 'typescript', postCount: 0 },
      ],
    });

    const { result } = renderHook(() => useTags(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.tags.length).toBe(2);
    expect(result.current.names).toEqual(['react', 'typescript']);
  });

  it('filters out empty tags when withPostsOnly is true', async () => {
    vi.spyOn(tagService, 'getTags').mockResolvedValue({
      data: [
        { name: 'react', postCount: 5 },
        { name: 'empty-topic', postCount: 0 },
      ],
    });

    const { result } = renderHook(() => useTags({ withPostsOnly: true }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.tags.length).toBe(1);
    expect(result.current.names).toEqual(['react']);
  });
});
