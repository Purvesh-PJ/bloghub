/**
 * Typography — Modern Tailwind-inspired sans-serif system.
 *
 * Clean, modern, comfortable typography designed for effortless scanning and long-form reading.
 */

const SANS = "'Inter Variable', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const typography = {
  fonts: {
    ui: SANS,
    display: SANS,
    reading: SANS,
    mono: "'SF Mono', 'Cascadia Code', 'Fira Code', 'Roboto Mono', Menlo, Consolas, monospace",
  },

  /**
   * Display — headlines and section headers. [size, lineHeight, letterSpacing, weight].
   * Modern, tight tracking with crisp bold/semibold weights.
   */
  display: {
    xs: ['1.25rem', '1.35', '-0.02em', 600], // 20px — card titles
    sm: ['1.5rem', '1.3', '-0.022em', 700], // 24px — panel headings
    md: ['2.25rem', '1.2', '-0.025em', 700], // 36px — sub-section
    lg: ['3rem', '1.15', '-0.03em', 800], // 48px — section titles
    xl: ['4rem', '1.1', '-0.035em', 800], // 64px
    '2xl': ['5rem', '1.05', '-0.04em', 800], // 80px — hero only
  },

  /** Body and interface text. Comfortable reading and scanning. */
  text: {
    xs: ['0.75rem', '1.5'], // 12px
    sm: ['0.875rem', '1.5'], // 14px
    md: ['1rem', '1.6'], // 16px — interface default
    lg: ['1.125rem', '1.75'], // 18px — comfortable article body
    xl: ['1.25rem', '1.65'], // 20px — lead paragraphs
  },

  /** Uppercase eyebrow. Tracked and crisp. */
  label: {
    sm: ['0.75rem', '1.2'], // 12px
    md: ['0.8125rem', '1.2'], // 13px
  },

  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 800,
  },

  tracking: {
    tightest: '-0.045em',
    tighter: '-0.03em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.01em',
    caps: '0.08em',
  },

  leading: {
    none: 1,
    tight: 1.15,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.65,
    loose: 1.8,
  },
};

/** Compatibility layer for legacy theme lookups */
export const typographyAliases = {
  fonts: {
    ...typography.fonts,
    body: typography.fonts.ui,
    heading: typography.fonts.display,
  },
  ui: typography.text,
  reading: { body: typography.text.lg, lead: typography.text.xl, caption: typography.text.sm },
  fontSizes: {
    xs: typography.text.xs[0],
    sm: typography.text.sm[0],
    md: typography.text.md[0],
    base: typography.text.md[0],
    lg: typography.text.lg[0],
    xl: typography.text.xl[0],
    '2xl': typography.display.xs[0],
    '3xl': typography.display.sm[0],
    '4xl': typography.display.md[0],
    '5xl': typography.display.lg[0],
  },
  fontWeights: {
    normal: typography.weights.regular,
    medium: typography.weights.medium,
    semibold: typography.weights.semibold,
    bold: typography.weights.bold,
  },
  lineHeights: typography.leading,
  letterSpacing: {
    tighter: typography.tracking.tighter,
    tight: typography.tracking.tight,
    normal: typography.tracking.normal,
    wide: typography.tracking.wide,
    wider: typography.tracking.caps,
  },
};

