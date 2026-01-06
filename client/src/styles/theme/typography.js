// Typography system
export const typography = {
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
  },

  fontSizes: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '15px',
    xl: '16px',
    '2xl': '18px',
    '3xl': '20px',
    '4xl': '24px',
    '5xl': '30px',
    '6xl': '36px',
  },

  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 1.75,
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },

  // Pre-defined text styles for consistency
  textStyles: {
    // Headings
    h1: {
      fontSize: '30px',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    // Body text
    body: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    bodyLarge: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.7,
    },
    bodySmall: {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    // UI text
    label: {
      fontSize: '13px',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '11px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    code: {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
};
