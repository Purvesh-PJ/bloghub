// Centralized theme with light/dark modes and semantic tokens

const paletteCommon = {
  white: '#ffffff',
  black: '#000000',
};

const primary = {
  main: '#3b82f6',
  light: '#60a5fa',
  dark: '#2563eb',
  contrastText: '#ffffff',
};

const secondary = {
  main: '#10b981',
  light: '#34d399',
  dark: '#059669',
  contrastText: '#ffffff',
};

const success = {
  main: '#10b981',
  light: '#34d399',
  dark: '#059669',
  contrastText: '#ffffff',
};

const warning = {
  main: '#f59e0b',
  light: '#fbbf24',
  dark: '#d97706',
  contrastText: '#111827',
};

const error = {
  main: '#ef4444',
  light: '#f87171',
  dark: '#dc2626',
  contrastText: '#ffffff',
};

const info = {
  main: '#3b82f6',
  light: '#60a5fa',
  dark: '#2563eb',
  contrastText: '#ffffff',
};

const grey = {
  25: '#fcfcfd',
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
};

const radii = {
  xs: '2px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  pill: '9999px',
};

const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 2px 8px rgba(0,0,0,0.08)',
  lg: '0 8px 24px rgba(0,0,0,0.12)',
};

const zIndex = {
  navbar: 100,
  sidebar: 99,
  modal: 1300,
  popover: 1200,
  toast: 1400,
};

const spacing = (factor) => `${4 * factor}px`;

const base = {
  radii,
  shadows,
  zIndex,
  spacing,
  borderWidth: {
    hairline: '0.5px',
    thin: '1px',
    thick: '2px',
  },
  motion: {
    duration: {
      fast: '120ms',
      normal: '200ms',
      slow: '320ms',
    },
    easing: {
      standard: 'ease',
      emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    },
  },
  // Typography scale kept minimal; can be extended or imported from existing file
  typography: {
    fontFamily: {
      body: '"Poppins", system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      heading: '"Open Sans", system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    size: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      h3: '24px',
      h2: '30px',
      h1: '36px',
    },
    lineHeight: {
      tight: 1.2,
      snug: 1.35,
      normal: 1.5,
      relaxed: 1.6,
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};

const light = {
  mode: 'light',
  text: {
    primary: grey[900],
    secondary: grey[600],
    muted: grey[500],
    inverse: paletteCommon.white,
  },
  background: {
    default: '#f8fafc',
    surface: paletteCommon.white,
    subtle: grey[50],
  },
  divider: grey[200],
};

const dark = {
  mode: 'dark',
  text: {
    primary: grey[25],
    secondary: grey[300],
    muted: grey[400],
    inverse: paletteCommon.black,
  },
  background: {
    default: '#0b1220',
    surface: '#0f172a',
    subtle: '#111827',
  },
  divider: '#1f2937',
};

export const createTheme = (mode = 'light') => {
  const surfaces = mode === 'dark' ? dark : light;
  return {
    mode,
    palette: {
      common: paletteCommon,
      primary,
      secondary,
      success,
      warning,
      error,
      info,
      grey,
      text: surfaces.text,
      background: surfaces.background,
      divider: surfaces.divider,
    },
    ...base,
  };
};

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

export default lightTheme;
