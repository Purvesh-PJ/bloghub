/**
 * Typography.
 *
 * Three faces, each doing a job the others cannot:
 *
 *   Fraunces    display. A high-contrast variable serif with SOFT and WONK axes. This is
 *               the single decision that stops the product looking like every other one:
 *               Inter set large is what a dashboard looks like, and a place for reading
 *               should not look like a dashboard.
 *   Newsreader  article bodies. A face drawn for long-form on screen — larger x-height and
 *               open counters than a print serif, so 2,000 words stay comfortable.
 *   Inter       interface chrome only. Buttons, labels, table cells, meta. It is the right
 *               choice for text you scan rather than read, and the wrong one for both of
 *               the above.
 *
 * All three are variable and self-hosted, so this costs three woff2 files, not three
 * families' worth of weights.
 *
 * The hierarchy comes from contrast, not decoration. Every jump in the display scale is
 * large enough to be deliberate, and there are no in-between sizes.
 */

const SANS = "'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const DISPLAY = "'Fraunces Variable', 'Iowan Old Style', Georgia, 'Times New Roman', serif";
const READING = "'Newsreader Variable', Georgia, 'Times New Roman', serif";

export const typography = {
  fonts: {
    ui: SANS,
    display: DISPLAY,
    reading: READING,
    mono: "'SF Mono', 'Cascadia Code', 'Roboto Mono', Menlo, Consolas, monospace",
  },

  /**
   * Display — headlines only. [size, lineHeight, letterSpacing, weight].
   *
   * Weights are lower than a sans scale would use: a serif at 800 turns into a slab. The
   * drama comes from size and from Fraunces' own contrast, so 600 is the ceiling. Tracking
   * is near-neutral for the same reason — negative tracking that flatters Inter closes up
   * a serif's counters and makes it look squeezed.
   */
  display: {
    xs: ['1.375rem', '1.3', '-0.01em', 600], // 22px — card titles
    sm: ['1.75rem', '1.2', '-0.012em', 600], // 28px — panel headings
    md: ['2.5rem', '1.12', '-0.015em', 600], // 40px — sub-section
    lg: ['3.5rem', '1.05', '-0.018em', 600], // 56px — section titles
    xl: ['4.75rem', '1.0', '-0.02em', 600], // 76px
    '2xl': ['6.25rem', '0.95', '-0.022em', 600], // 100px — hero only
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
  /*
    Spread over `typography.fonts` in the provider, so it must carry every key the real
    object has. It previously listed `heading` but not `display`, which silently deleted
    `theme.fonts.display`: every heading in the application resolved to `undefined`,
    styled-components emitted no font-family rule, and everything inherited the body sans.
    The display face had no effect at all for as long as this alias existed.
  */
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
