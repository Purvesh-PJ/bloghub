import { useState, useEffect } from 'react';

/**
 * Trails a value by `delay`, settling only once it stops changing.
 *
 * Used for search boxes whose value drives a server request: without it, "react" is five
 * requests, and the answers can arrive out of order so the list ends up showing results for
 * a prefix the reader has already typed past.
 *
 * @param {T} value
 * @param {number} delay milliseconds of quiet before the value is passed on
 * @returns {T}
 * @template T
 */
export function useDebounced(value, delay = 300) {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    // Clearing on every change is what makes this a debounce rather than a queue of timers.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return settled;
}
