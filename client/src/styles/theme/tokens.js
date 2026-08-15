/**
 * Mode-independent tokens — identical in light and dark.
 */

export const tokens = {
  /** 4px base, with generous upper steps. Whitespace is most of the premium feel. */
  spacing: {
    0: '0',
    px: '1px',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
    '5xl': '96px',
    '6xl': '128px',
    '7xl': '160px',
  },

  /**
   * Large, soft radii. This is the most visible single decision in the design language —
   * containers are rounded generously and interactive controls are fully pill-shaped.
   */
  radii: {
    none: '0',
    xs: '6px',
    sm: '10px', // chips, tags, small inputs
    md: '14px', // inputs, menu items
    lg: '20px', // cards, panels
    xl: '28px', // large cards, dialogs
    '2xl': '36px', // hero surfaces, feature panels
    '3xl': '48px', // full-bleed sections
    full: '9999px', // buttons, avatars, pills — the default for anything clickable
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
  },

  zIndices: {
    base: 0,
    raised: 10,
    sticky: 200,
    dropdown: 300,
    overlay: 400,
    modal: 500,
    toast: 600,
  },

  layout: {
    headerHeight: '64px',
    sidebarWidth: '260px',
    /** Wide marketing / dashboard shell. */
    maxWidth: '1200px',
    /** Narrower shell for focused pages (settings, forms). */
    maxWidthNarrow: '760px',
    /** Reading measure — roughly 70 characters. */
    contentWidth: '720px',
    /** Centred auth cards. */
    maxWidthAuth: '440px',
  },

  /**
   * Density presets. Reading and marketing surfaces use `comfortable`; dashboards and
   * tables use `compact`. Same components, two rhythms.
   */
  density: {
    comfortable: {
      rowHeight: '52px',
      controlHeight: '44px',
      paddingX: '20px',
      paddingY: '14px',
      gap: '16px',
      sectionGap: '64px',
    },
    compact: {
      rowHeight: '40px',
      controlHeight: '36px',
      paddingX: '14px',
      paddingY: '8px',
      gap: '10px',
      sectionGap: '32px',
    },
  },

  motion: {
    instant: '80ms',
    fast: '140ms',
    base: '220ms',
    slow: '320ms',
    /** Gentle deceleration — nothing snaps. */
    easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
    easingOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },

  /** Aliases for the existing `theme.transitions.*` call sites. */
  transitions: {
    fast: '140ms cubic-bezier(0.32, 0.72, 0, 1)',
    normal: '220ms cubic-bezier(0.32, 0.72, 0, 1)',
    slow: '320ms cubic-bezier(0.32, 0.72, 0, 1)',
    spring: '420ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
};
