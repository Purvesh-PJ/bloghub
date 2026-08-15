import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import {
  tokens,
  typography,
  typographyAliases,
  lightTheme,
  darkTheme,
  GlobalStyles,
} from './theme';

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
 * Two separate things, which the previous version conflated:
 *
 *   preference — what the reader chose: 'light', 'dark' or 'system'
 *   mode       — what is actually painted: 'light' or 'dark'
 *
 * They only differ under 'system'. Storing just the resolved mode is what broke the
 * system option: the persist effect wrote `theme` on first render, so the
 * "only auto-switch if the reader has not chosen" guard was never true again and
 * following the OS became unreachable. Settings offered a System card that did nothing.
 */

const STORAGE_KEY = 'theme-preference';

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

const getInitialPreference = () => {
  if (typeof window === 'undefined') return 'system';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && ['light', 'dark', 'system'].includes(saved)) return saved;

  // Migrate the old key, which only ever held a resolved mode.
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

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', mode === 'dark' ? '#0d1117' : '#ffffff');
    }
  }, [mode]);

  // Track the OS setting continuously. Under 'system' this repaints; otherwise it is
  // simply kept current so switching to 'system' later lands on the right mode.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setSystemMode(event.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Flatten colours, tokens and typography into the single object styled-components reads.
  // typographyAliases is spread last so the flat fontSizes/lineHeights API the existing
  // pages rely on stays available alongside the new ui/reading/display scales.
  const theme = useMemo(() => {
    const colorTheme = mode === 'light' ? lightTheme : darkTheme;
    return {
      ...colorTheme,
      ...tokens,
      ...typography,
      ...typographyAliases,
    };
  }, [mode]);

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
      <StyledThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
