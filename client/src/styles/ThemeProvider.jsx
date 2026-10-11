import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// Theme context
const ThemeContext = createContext(null);

// Custom hook to access theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Two separate things:
 *   preference — what the reader chose: 'light', 'dark' or 'system'
 *   mode       — what is actually painted: 'light' or 'dark'
 */

const STORAGE_KEY = 'theme-preference';

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

const getInitialPreference = () => {
  if (typeof window === 'undefined') return 'system';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && ['light', 'dark', 'system'].includes(saved)) return saved;

  const legacy = localStorage.getItem('theme');
  if (legacy && ['light', 'dark'].includes(legacy)) return legacy;

  return 'system';
};

export const ThemeProvider = ({ children }) => {
  const [preference, setPreference] = useState(getInitialPreference);
  const [systemMode, setSystemMode] = useState(() => (prefersDark() ? 'dark' : 'light'));

  const mode = preference === 'system' ? systemMode : preference;

  const toggleTheme = useCallback(() => setPreference(mode === 'light' ? 'dark' : 'light'), [mode]);

  const setTheme = useCallback((next) => {
    if (['light', 'dark', 'system'].includes(next)) setPreference(next);
  }, []);

  // Persist the choice, not the outcome.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, preference);
    localStorage.removeItem('theme');
  }, [preference]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', mode === 'dark' ? '#0d1117' : '#ffffff');
    }
  }, [mode]);

  // Track the OS setting continuously
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setSystemMode(event.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Context value
  const contextValue = useMemo(
    () => ({
      mode,
      preference,
      isDark: mode === 'dark',
      isLight: mode === 'light',
      toggleTheme,
      setTheme,
    }),
    [mode, preference, toggleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

