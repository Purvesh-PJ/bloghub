// Typography system - clean, professional
export const typography = {
  fonts: {
    body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    heading: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    mono: "'SF Mono', 'Fira Code', 'Consolas', monospace",
  },

  fontSizes: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
    '5xl': '32px',
    '6xl': '40px',
  },

  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    none: 1,
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.75,
  },

  letterSpacing: {
    tighter: '-0.03em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.01em',
  },

  // Pre-defined text styles
  textStyles: {
    // Display - for hero sections
    display: {
      fontSize: '40px',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
    },
    // Headings
    h1: {
      fontSize: '32px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    // Body text
    body: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    bodySmall: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    // UI text
    label: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    small: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '11px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    },
  },
};
