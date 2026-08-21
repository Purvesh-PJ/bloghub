/**
 * Builds one theme from a set of Radix colour ramps.
 *
 * Light and dark are produced by the *same* function with different ramps, which is what
 * guarantees parity: a token cannot exist in one mode and be undefined in the other.
 *
 * ── Visual direction ──────────────────────────────────────────────────────────────────
 * Premium modern, in the register of apple.com and developer.android.com:
 *
 *   • Surfaces are layered by *tone*, not by shadow. A card is a lighter tone of the page,
 *     subtly tinted with the brand hue. This is what reads as "soft" rather than "boxy".
 *   • Borders are a last resort. Where a boundary is needed it is barely there.
 *   • Shadows are wide, soft and almost transparent — they suggest lift, never outline.
 *   • Colour is scarce. One accent, used for the primary action and nothing else.
 *
 * Radix ramps are 12 steps with fixed semantics:
 *
 *    1  app background            7  element border / focus ring
 *    2  subtle background         8  hovered element border
 *    3  element background        9  solid background  ← the brand colour
 *    4  hovered element bg       10  hovered solid background
 *    5  active / selected bg     11  low-contrast text  (AA on 1–2)
 *    6  subtle border            12  high-contrast text
 *
 * Only steps 11 and 12 are contrast-guaranteed for text. Step 10 is used for `textMuted`
 * and is deliberately below 4.5:1 — meta text only, never body copy.
 */

/**
 * Soft, wide, low-opacity elevation. Two layers: a tight contact shadow that grounds the
 * element, and a wide ambient one that lifts it. Dark mode leans on tone instead, so its
 * shadows stay subtle.
 */
const elevationFor = (mode) =>
  mode === 'light'
    ? {
        none: 'none',
        sm: '0 1px 2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.04)',
        md: '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        lg: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        xl: '0 20px 25px -5px rgba(15, 23, 42, 0.10), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        glow: '0 4px 14px 0 rgba(14, 165, 233, 0.35)',
      }
    : {
        none: 'none',
        sm: '0 1px 2px rgba(0, 0, 0, 0.30)',
        md: '0 2px 6px rgba(0, 0, 0, 0.35), 0 8px 20px -6px rgba(0, 0, 0, 0.30)',
        lg: '0 4px 12px rgba(0, 0, 0, 0.40), 0 20px 40px -12px rgba(0, 0, 0, 0.35)',
        xl: '0 8px 24px rgba(0, 0, 0, 0.45), 0 40px 80px -20px rgba(0, 0, 0, 0.50)',
        glow: '0 4px 16px 0 rgba(56, 189, 248, 0.30)',
      };

/* ── Contrast ──────────────────────────────────────────────────────────────
   Relative luminance and contrast ratio, per WCAG 2.1. Small enough to keep here, and
   worth having: it is what lets the foreground for a solid colour be derived rather than
   assumed. */

const channel = (value) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const clean = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const contrast = (a, b) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

const INK = '#0f172a';

/**
 * The readable foreground for a solid background.
 *
 * `textOnAccent` was hardcoded to white. The accent ramp is Radix `sky`, whose step 9 is
 * #7ce2fe — one of the bright scales that is designed to carry a *dark* foreground. White on
 * it measures 1.48:1, against the 4.5:1 WCAG asks for, so every primary button, every selected
 * chip and the skip link rendered near-invisible text in both light and dark mode.
 *
 * Deriving it means the pairing stays legible if the accent ramp is ever swapped, rather than
 * being correct only for the ramp somebody had in mind when they typed '#ffffff'.
 */
const readableOn = (background) =>
  contrast(background, '#ffffff') >= contrast(background, INK) ? '#ffffff' : INK;

export function createTheme(ramps, mode) {
  const { neutral: n, accent: a, success: s, warning: w, danger: d, info: i, alpha } = ramps;

  // Ramp objects are keyed by their own name (slate1, sky9 …), so read them positionally.
  const step = (ramp, index) => Object.values(ramp)[index - 1];
  const isLight = mode === 'light';

  const colors = {
    // ── Surfaces (Tonal, Rich Obsidian & Deep Navy in dark mode) ───────────
    surfacePage: isLight ? '#ffffff' : '#070b13',
    surfaceContainerLow: isLight ? '#f8fafc' : '#0d1424',
    surfaceContainer: isLight ? '#f1f5f9' : '#121b2f',
    surfaceContainerHigh: isLight ? '#e2e8f0' : '#1a263e',
    surfaceContainerHighest: isLight ? '#cbd5e1' : '#223250',

    // Elevated things that float above the page (cards, menus, dialogs).
    surfaceElevated: isLight ? '#ffffff' : '#10182b',

    surfaceHover: isLight ? '#f1f5f9' : '#1a263e',
    surfaceActive: isLight ? '#e2e8f0' : '#223250',
    surfaceScrim: isLight ? 'rgba(15, 23, 42, 0.40)' : 'rgba(0, 0, 0, 0.80)',

    // ── Text ────────────────────────────────────────────────────────────────
    textPrimary: isLight ? '#0f172a' : '#f8fafc',
    textSecondary: isLight ? '#475569' : '#94a3b8',
    textMuted: isLight ? '#64748b' : '#64748b',
    textDisabled: isLight ? '#94a3b8' : '#475569',
    // Derived, not assumed. See readableOn above.
    textOnAccent: readableOn(step(a, 9)),
    textOnDanger: readableOn(step(d, 9)),
    textOnSuccess: readableOn(step(s, 9)),
    textLink: step(a, 11),
    textLinkHover: step(a, 12),

    // ── Lines ───────────────────────────────────────────────────────────────
    lineSubtle: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.07)',
    lineDefault: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.12)',
    lineStrong: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.20)',
    lineFocus: step(a, 8),

    // ── Primary Action / Ink (Sky Blue) ─────────────────────────────────────
    inkSolid: step(a, 9),
    inkSolidHover: step(a, 10),
    textOnInk: '#ffffff',

    // ── Accent (Sky Blue) ───────────────────────────────────────────────────
    accentContainer: step(a, 3),
    accentContainerHover: step(a, 4),
    accentLine: step(a, 7),
    accentSolid: step(a, 9),
    accentSolidHover: step(a, 10),
    accentText: step(a, 11),

    // ── Status ──────────────────────────────────────────────────────────────
    successContainer: step(s, 3),
    successLine: step(s, 7),
    successSolid: step(s, 9),
    successText: step(s, 11),

    warningContainer: step(w, 3),
    warningLine: step(w, 7),
    warningSolid: step(w, 9),
    warningText: step(w, 11),

    dangerContainer: step(d, 3),
    dangerContainerHover: step(d, 4),
    dangerLine: step(d, 7),
    dangerSolid: step(d, 9),
    dangerSolidHover: step(d, 10),
    dangerText: step(d, 11),

    infoContainer: step(i, 3),
    infoLine: step(i, 7),
    infoSolid: step(i, 9),
    infoText: step(i, 11),

    // Translucent overlay, for glass headers and hover washes.
    alphaSubtle: alpha ? Object.values(alpha)[2] : 'rgba(0,0,0,0.05)',
    alphaSoft: alpha ? Object.values(alpha)[4] : 'rgba(0,0,0,0.08)',
  };

  // ── Compatibility aliases ────────────────────────────────────────────────
  // Existing pages read these names. They keep working and pick up the new palette
  // immediately; new code uses the semantic names above. Delete an alias only once
  // nothing references it.
  Object.assign(colors, {
    surfaceRaised: colors.surfaceContainerLow,
    surfaceSunken: colors.surfaceContainer,
    surfaceOverlay: colors.surfaceScrim,
    accentSubtle: colors.accentContainer,
    accentMutedBg: colors.accentContainerHover,
    successBgSubtle: colors.successContainer,
    warningBgSubtle: colors.warningContainer,
    dangerBgSubtle: colors.dangerContainer,
    infoBgSubtle: colors.infoContainer,

    bgPrimary: colors.surfaceContainerLow,
    bgSecondary: colors.surfacePage,
    bgTertiary: colors.surfaceContainer,
    bgElevated: colors.surfaceElevated,
    bgHover: colors.surfaceHover,
    bgActive: colors.surfaceActive,
    bgOverlay: colors.surfaceScrim,

    textInverse: isLight ? step(n, 1) : step(n, 12),

    border: colors.lineDefault,
    borderLight: colors.lineSubtle,
    borderHover: colors.lineStrong,
    borderFocus: colors.lineFocus,

    accent: colors.accentSolid,
    accentPrimary: colors.accentSolid,
    primary: colors.accentSolid,
    accentHover: colors.accentSolidHover,
    accentActive: colors.accentSolidHover,
    accentMuted: colors.accentContainerHover,

    buttonPrimaryBg: colors.accentSolid,
    buttonPrimaryText: colors.textOnAccent,
    buttonPrimaryHover: colors.accentSolidHover,
    buttonSecondaryBg: colors.surfaceContainer,
    buttonSecondaryText: colors.textPrimary,
    buttonSecondaryHover: colors.surfaceContainerHigh,
    buttonSecondaryBorder: 'transparent',
    buttonGhostHover: colors.surfaceHover,

    inputBg: colors.surfaceContainer,
    inputBorder: 'transparent',
    inputBorderHover: colors.lineDefault,
    inputBorderFocus: colors.lineFocus,
    inputPlaceholder: colors.textMuted,

    cardBg: colors.surfaceContainerLow,
    cardBorder: colors.lineSubtle,
    cardHoverBg: colors.surfaceContainer,

    codeBg: colors.surfaceContainer,
    codeBorder: colors.lineSubtle,

    badgeBg: colors.accentContainer,
    badgeText: colors.accentText,
    badgeActiveBg: colors.accentSolid,
    badgeActiveText: colors.textOnAccent,

    scrollbarTrack: 'transparent',
    scrollbarThumb: colors.lineStrong,
    scrollbarThumbHover: colors.textMuted,

    selection: colors.accentContainerHover,
    selectionText: colors.textPrimary,

    success: colors.successSolid,
    successHover: colors.successText,
    successBg: colors.successContainer,
    successBorder: colors.successLine,

    warning: colors.warningSolid,
    warningHover: colors.warningText,
    warningBg: colors.warningContainer,
    warningBorder: colors.warningLine,

    error: colors.dangerSolid,
    errorHover: colors.dangerSolidHover,
    errorBg: colors.dangerContainer,
    errorBorder: colors.dangerLine,

    info: colors.infoSolid,
    infoHover: colors.infoText,
    infoBg: colors.infoContainer,
    infoBorder: colors.infoLine,
  });

  const elevation = elevationFor(mode);

  return {
    mode,
    colors,
    elevation,

    /*
      The brand gradient, in one place.

      `linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)` was pasted into nine files — every
      logo mark, every hand-rolled avatar, the footer, the auth shell. Two problems with that:
      changing the brand meant finding nine copies, and the literals bypass the theme
      entirely, so the gradient looked identical in dark mode where everything around it had
      moved.
    */
    gradients: {
      brand: `linear-gradient(135deg, ${step(a, 10)} 0%, ${step(a, 8)} 100%)`,
      brandSoft: `linear-gradient(135deg, ${step(a, 4)} 0%, ${step(a, 6)} 100%)`,
      // Horizontal, for thin progress and accent bars.
      brandBar: `linear-gradient(90deg, ${step(a, 10)}, ${step(a, 8)})`,
      // Darker, for large surfaces that carry text of their own.
      brandDeep: `linear-gradient(135deg, ${step(a, 10)} 0%, ${step(a, 11)} 100%)`,
      /*
        Neutral counterpart to `brand`, for a dark editorial surface that should not read as
        branded. Built from the neutral surface steps so it tracks the palette rather than
        being the pair of slate hexes it replaced.
      */
      inkDeep: isLight
        ? `linear-gradient(135deg, ${step(n, 12)} 0%, ${step(n, 11)} 100%)`
        : `linear-gradient(135deg, ${step(n, 1)} 0%, ${step(n, 3)} 100%)`,
      /*
        For gradient *text*, which sits on the page background rather than being a surface.
        Steps 11 and 12 are the only two Radix guarantees for contrast, and they are what a
        headline needs — the solid steps used above measure 1.6:1 on white, which is a
        headline nobody can read.
      */
      brandText: `linear-gradient(135deg, ${step(a, 11)} 0%, ${step(a, 12)} 100%)`,
    },
    shadows: {
      ...elevation,
      // aliases for existing call sites
      xs: elevation.sm,
      card: elevation.sm,
      cardHover: elevation.md,
      raised: elevation.sm,
      popover: elevation.lg,
      overlay: elevation.xl,
      focus: `0 0 0 4px ${step(a, 5)}`,
      focusRing: `0 0 0 2px ${colors.surfacePage}, 0 0 0 4px ${colors.lineFocus}`,
    },
  };
}
