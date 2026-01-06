import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { tokens, typography, lightTheme, darkTheme, GlobalStyles } from './theme';

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

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
    return savedTheme;
  }
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialTheme);

  // Toggle between light and dark
  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Set specific theme
  const setTheme = (newMode) => {
    if (['light', 'dark'].includes(newMode)) {
      setMode(newMode);
    }
  };

  // Persist theme and update document attribute
  useEffect(() => {
    localStorage.setItem('theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        mode === 'dark' ? '#0d1117' : '#ffffff'
      );
    }
  }, [mode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Merge theme colors with tokens and typography
  const theme = useMemo(() => {
    const colorTheme = mode === 'light' ? lightTheme : darkTheme;
    return {
      ...colorTheme,
      ...tokens,
      ...typography,
    };
  }, [mode]);

  // Context value
  const contextValue = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      isLight: mode === 'light',
      toggleTheme,
      setTheme,
    }),
    [mode]
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
