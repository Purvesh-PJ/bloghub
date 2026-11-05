import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounced } from '../hooks/useDebounced';
import { useDraftRecovery, useBeforeUnload } from '../hooks/useDraftRecovery';

describe('useDebounced hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounced('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('updates the debounced value only after the specified delay', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounced(val, 300), {
      initialProps: { val: 'first' },
    });

    rerender({ val: 'second' });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('second');
  });

  it('resets timer when value changes rapidly within delay window', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounced(val, 300), {
      initialProps: { val: 'a' },
    });

    rerender({ val: 'ab' });
    act(() => {
      vi.advanceTimersByTime(150);
    });

    rerender({ val: 'abc' });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    // Total elapsed is 300ms from start, but only 150ms since last change
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('abc');
  });
});

describe('useDraftRecovery hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('initializes with null when localStorage has no draft', () => {
    const { result } = renderHook(() =>
      useDraftRecovery({
        id: 'post-1',
        values: { title: '', content: '' },
        dirty: false,
      })
    );

    expect(result.current.recovered).toBeNull();
  });

  it('restores stored draft if saved within validity window', () => {
    const savedDraft = {
      title: 'Restored Title',
      content: 'Restored Content',
      savedAt: Date.now() - 1000 * 60, // 1 minute ago
    };
    localStorage.setItem('bloghub:draft:new', JSON.stringify(savedDraft));

    const { result } = renderHook(() =>
      useDraftRecovery({
        values: { title: '', content: '' },
        dirty: false,
      })
    );

    expect(result.current.recovered).toEqual(savedDraft);
  });

  it('discards and removes draft if older than 7 days', () => {
    const expiredDraft = {
      title: 'Ancient Draft',
      content: 'Old text',
      savedAt: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
    };
    localStorage.setItem('bloghub:draft:new', JSON.stringify(expiredDraft));

    const { result } = renderHook(() =>
      useDraftRecovery({
        values: { title: '', content: '' },
        dirty: false,
      })
    );

    expect(result.current.recovered).toBeNull();
    expect(localStorage.getItem('bloghub:draft:new')).toBeNull();
  });

  it('handles corrupt JSON in localStorage without throwing', () => {
    localStorage.setItem('bloghub:draft:new', 'invalid-json{{{');

    const { result } = renderHook(() =>
      useDraftRecovery({
        values: { title: '', content: '' },
        dirty: false,
      })
    );

    expect(result.current.recovered).toBeNull();
  });

  it('autosaves to localStorage after 800ms when dirty and enabled', () => {
    const values = { title: 'Fresh Title', content: 'Fresh Content' };

    renderHook(
      ({ dirty, values }) =>
        useDraftRecovery({
          id: 'post-42',
          values,
          dirty,
          enabled: true,
        }),
      {
        initialProps: { dirty: true, values },
      }
    );

    expect(localStorage.getItem('bloghub:draft:post-42')).toBeNull();

    act(() => {
      vi.advanceTimersByTime(800);
    });

    const stored = JSON.parse(localStorage.getItem('bloghub:draft:post-42'));
    expect(stored.title).toBe('Fresh Title');
    expect(stored.content).toBe('Fresh Content');
    expect(stored.savedAt).toBeTypeOf('number');
  });

  it('does not autosave when dirty is false or enabled is false', () => {
    const values = { title: 'Draft', content: 'Content' };

    renderHook(() =>
      useDraftRecovery({
        id: 'post-10',
        values,
        dirty: false,
        enabled: true,
      })
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(localStorage.getItem('bloghub:draft:post-10')).toBeNull();
  });

  it('clear() removes draft from localStorage and clears recovered state', () => {
    localStorage.setItem(
      'bloghub:draft:test',
      JSON.stringify({ title: 'A', savedAt: Date.now() })
    );

    const { result } = renderHook(() =>
      useDraftRecovery({
        id: 'test',
        values: { title: 'A' },
        dirty: false,
      })
    );

    act(() => {
      result.current.clear();
    });

    expect(result.current.recovered).toBeNull();
    expect(localStorage.getItem('bloghub:draft:test')).toBeNull();
  });
});

describe('useBeforeUnload hook', () => {
  it('adds and removes beforeunload event listener based on when flag', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { rerender, unmount } = renderHook(({ when }) => useBeforeUnload(when), {
      initialProps: { when: false },
    });

    expect(addEventListenerSpy).not.toHaveBeenCalled();

    rerender({ when: true });
    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});

