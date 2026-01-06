// Design tokens - shared values that don't change between themes
export const tokens = {
  // Spacing scale (8px base for better rhythm)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // Border radius - more rounded for modern feel
  radii: {
    none: '0',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
  },

  // Z-index scale
  zIndices: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    toast: 500,
  },

  // Layout
  layout: {
    headerHeight: '60px',
    sidebarWidth: '260px',
    maxContentWidth: '1200px',
    contentWidth: '680px',
  },

  // Transitions - smooth, not too fast
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
    spring: '300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};
