import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './themes';

const ThemeModeContext = createContext({
  mode: 'light',
  setMode: () => {},
  toggle: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

const STORAGE_KEY = 'themeMode';

const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === 'dark' || stored === 'light') {
      setMode(stored);
    } else {
      // Prefer system mode initially
      const prefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
      document.documentElement.setAttribute('data-theme', mode);
    } catch (_) {}
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  );

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default AppThemeProvider;
