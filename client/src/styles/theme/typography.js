/**
 * Typography.
 *
 * Inter Variable with the optical-size axis, self-hosted. `font-optical-sizing: auto` in
 * GlobalStyles means large headings get Inter's display cut automatically — tighter
 * apertures and spacing — instead of body Inter scaled up, which is what makes big type
 * look amateur.
 *
 * The premium register comes from *contrast*, not from a decorative face:
 *
 *   • Hero is genuinely huge and genuinely heavy (84px / 800), with aggressive negative
 *     tracking. Timid display type is the single most common reason a landing page reads
 *     as a template.
 *   • Headline, lead and body each get their own colour as well as their own size, so the
 *     hierarchy survives even in a screenshot at 25%.
 *   • There are no in-between sizes. Every jump is large enough to be deliberate.
 */

const SANS = "'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const typography = {
  fonts: {
    ui: SANS,
    display: SANS,
    reading: SANS,
    mono: "'SF Mono', 'Cascadia Code', 'Roboto Mono', Menlo, Consolas, monospace",
  },

  /**
   * Display — headlines only. [size, lineHeight, letterSpacing, weight].
   * Tracking tightens and weight climbs as size grows.
   */
  display: {
    xs: ['1.25rem', '1.35', '-0.015em', 600], // 20px — card titles
    sm: ['1.5rem', '1.25', '-0.02em', 600], // 24px — panel headings
    md: ['2rem', '1.2', '-0.025em', 700], // 32px — sub-section
    lg: ['3rem', '1.1', '-0.03em', 700], // 48px — section titles
    xl: ['4rem', '1.05', '-0.038em', 800], // 64px
    '2xl': ['5.25rem', '0.98', '-0.045em', 800], // 84px — hero only
  },

  /** Body and interface text. */
  text: {
    xs: ['0.75rem', '1.45'], // 12px
    sm: ['0.8125rem', '1.5'], // 13px
    md: ['0.9375rem', '1.55'], // 15px — interface default
    lg: ['1.0625rem', '1.6'], // 17px — body copy
    xl: ['1.375rem', '1.5'], // 22px — lead paragraphs
  },

  /** Uppercase eyebrow. Always accent-coloured, always tracked. */
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
    caps: '0.09em',
  },

  leading: {
    none: 1,
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.75,
  },
};

/** Compatibility layer for pages still reading the flat `theme.fontSizes.*` API. */
export const typographyAliases = {
  fonts: {
    body: typography.fonts.ui,
    heading: typography.fonts.display,
    mono: typography.fonts.mono,
    ui: typography.fonts.ui,
    reading: typography.fonts.reading,
  },
  ui: typography.text,
  reading: { body: typography.text.lg, lead: typography.text.xl, caption: typography.text.sm },
  fontSizes: {
    xs: typography.text.xs[0],
    sm: typography.text.sm[0],
    md: typography.text.md[0],
    base: typography.text.lg[0],
    lg: typography.text.xl[0],
    xl: typography.display.xs[0],
    '2xl': typography.display.sm[0],
    '3xl': typography.display.md[0],
    '4xl': typography.display.lg[0],
    '5xl': typography.display.xl[0],
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
