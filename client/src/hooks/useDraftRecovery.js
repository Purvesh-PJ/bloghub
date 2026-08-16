import { useState, useEffect, useRef, useCallback } from 'react';
import { useBlocker } from 'react-router-dom';

const STORAGE_PREFIX = 'bloghub:draft:';
// Long enough to survive a crash and a reboot; short enough that a recovered draft is still
// something the writer recognises.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const keyFor = (id) => `${STORAGE_PREFIX}${id ?? 'new'}`;

/**
 * Keeps a local copy of whatever is in the editor, and offers it back after an interruption.
 *
 * Nothing was saved anywhere until the writer pressed a button, so closing the tab, a crash,
 * or a mis-click on a link lost the piece entirely. This is deliberately local-only: sending
 * half-written text to the server on a timer would publish revisions nobody asked for, and
 * would make "unsaved" meaningless.
 *
 * @param {object} options
 * @param {string} [options.id] post id when editing; absent for a new story
 * @param {object} options.values current editor values
 * @param {boolean} options.dirty whether the editor differs from what the server has
 * @param {boolean} [options.enabled] pause saving, e.g. while the post is still loading
 */
export function useDraftRecovery({ id, values, dirty, enabled = true }) {
  const [recovered, setRecovered] = useState(null);
  // Read once, before the first save can overwrite what was there from last time.
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    try {
      const stored = localStorage.getItem(keyFor(id));
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (!parsed?.savedAt || Date.now() - parsed.savedAt > MAX_AGE_MS) {
        localStorage.removeItem(keyFor(id));
        return;
      }
      setRecovered(parsed);
    } catch {
      // Corrupt or unavailable storage is not worth interrupting the writer over.
    }
  }, [id]);

  useEffect(() => {
    if (!enabled || !dirty || !checkedRef.current) return;

    // Trails the keystrokes rather than writing on each one.
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(keyFor(id), JSON.stringify({ ...values, savedAt: Date.now() }));
      } catch {
        // Quota exceeded, or storage disabled. Losing the local copy is survivable; breaking
        // the editor is not.
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [id, values, dirty, enabled]);

  /** Called once the work is safely on the server. */
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(keyFor(id));
    } catch {
      // See above.
    }
    setRecovered(null);
  }, [id]);

  /** Called when the writer would rather keep what is on screen. */
  const discard = useCallback(() => {
    clear();
  }, [clear]);

  return { recovered, clear, discard };
}

/**
 * Warns before the page is closed or reloaded with unsaved work in it.
 *
 * Only covers leaving the site. In-app navigation is handled separately, because React Router
 * moves between pages without the browser ever firing this event.
 *
 * @param {boolean} when
 */
export function useBeforeUnload(when) {
  useEffect(() => {
    if (!when) return;

    const handler = (event) => {
      event.preventDefault();
      // Browsers ignore any custom message now and show their own wording; assigning
      // returnValue is still what triggers the prompt at all.
      event.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [when]);
}

/**
 * Confirms before an in-app navigation abandons unsaved work.
 *
 * `beforeunload` covers closing the tab, but React Router changes pages without the browser
 * navigating, so clicking "Dashboard" mid-sentence would silently discard the draft. Requires
 * a data router, which is why main.jsx uses `createBrowserRouter`.
 *
 * @param {boolean} when
 * @param {string} [message]
 */
export function useNavigationGuard(
  when,
  message = 'You have unsaved changes. Leave this page and discard them?'
) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state !== 'blocked') return;

    // window.confirm rather than a styled dialog: this has to resolve synchronously against
    // the blocker, and it must work even if the page is mid-unmount.
    if (window.confirm(message)) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker, message]);
}
