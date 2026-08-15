import { useEffect, useRef, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { readingTime } from '../utils/text';

/**
 * Reading hooks.
 *
 * `trackPostRead` existed in the service layer and was never called from anywhere in the
 * application. Every Read document in the database came from the seed script, which meant
 * read-through rate — the figure the landing page argues from, the dashboard headline, the
 * admin overview and the per-post bars — would have sat at 0% forever in production.
 *
 * A read is recorded when somebody reaches the end of the article *and* has been on the
 * page long enough to plausibly have read it. Either signal alone is worthless: scrolling
 * to the bottom takes a second, and sitting on an open tab is not reading.
 */

/** Point in the article body that counts as having reached the end. */
const END_THRESHOLD = 0.95;

/** Minimum dwell before reaching the end counts as having read it. */
const dwellFor = (content) => {
  const minutes = readingTime(content);
  // A third of the estimated time, floored at 8s so short posts stay countable and capped
  // at 90s so a long one does not become impossible to finish.
  return Math.min(Math.max(minutes * 60 * 1000 * 0.3, 8000), 90000);
};

/** How far through `node` the viewport has scrolled, 0–1. */
const progressThrough = (node) => {
  const { top, height } = node.getBoundingClientRect();
  const scrolled = -top + window.innerHeight;
  if (height <= 0) return 0;
  return Math.min(1, Math.max(0, scrolled / height));
};

/**
 * Records a read for `postId` once the reader has both reached the end of the article
 * element and stayed long enough.
 *
 * Reaching the end is a high-water mark rather than a live check. An earlier version put a
 * sentinel at the end of the body and watched it with an IntersectionObserver, which missed
 * two ordinary cases: jumping straight to the comments scrolled the sentinel past the
 * viewport without it ever being observed, and scrolling back up to re-read cancelled the
 * pending timer.
 */
export function useReadTracking(postId, content, articleRef) {
  const sent = useRef(false);

  useEffect(() => {
    sent.current = false;
  }, [postId]);

  useEffect(() => {
    const node = articleRef.current;
    if (!node || !postId || !content) return undefined;

    const openedAt = Date.now();
    const minimum = dwellFor(content);

    let reachedEnd = false;
    let timer = null;

    const send = () => {
      if (sent.current) return;
      sent.current = true;
      analyticsService.trackPostRead(postId).catch(() => {});
      window.removeEventListener('scroll', onScroll);
    };

    const onScroll = () => {
      if (sent.current || reachedEnd) return;
      if (progressThrough(node) < END_THRESHOLD) return;

      reachedEnd = true;
      const remaining = minimum - (Date.now() - openedAt);
      if (remaining <= 0) send();
      else timer = setTimeout(send, remaining);
    };

    // A post shorter than the viewport is already fully visible, so check once on mount.
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [postId, content, articleRef]);
}

/**
 * How far through the article the reader is, 0–100.
 *
 * Measured against the article element rather than the document, so the comments and the
 * footer do not count as part of the piece.
 */
export function useReadingProgress(articleRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const node = articleRef.current;
      if (!node) return;
      setProgress(progressThrough(node) * 100);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [articleRef]);

  return progress;
}
