import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

/*
  Shared test setup.

  The auth store reads localStorage at import time and the api module reads
  `import.meta.env.VITE_API_URL`, so both need a stable environment before any module under
  test is loaded — and localStorage has to be emptied between tests or a session persisted by
  one leaks into the next.
*/

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

// jsdom implements neither, and components under test subscribe to both.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

/*
  Radix's menus and dialogs drive themselves from pointer events and capture, which jsdom does
  not implement — without these a click on a dropdown trigger never resolves and the test hangs
  rather than failing. They are environment gaps, not behaviour under test.
*/
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
