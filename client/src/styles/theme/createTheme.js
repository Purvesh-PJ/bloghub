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
        sm: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.03)',
        md: '0 2px 4px rgba(15, 23, 42, 0.04), 0 6px 16px -4px rgba(15, 23, 42, 0.06)',
        lg: '0 4px 8px rgba(15, 23, 42, 0.04), 0 16px 32px -8px rgba(15, 23, 42, 0.08)',
        xl: '0 8px 16px rgba(15, 23, 42, 0.05), 0 32px 64px -16px rgba(15, 23, 42, 0.12)',
      }
    : {
        none: 'none',
        sm: '0 1px 2px rgba(0, 0, 0, 0.30)',
        md: '0 2px 6px rgba(0, 0, 0, 0.35), 0 8px 20px -6px rgba(0, 0, 0, 0.30)',
        lg: '0 4px 12px rgba(0, 0, 0, 0.40), 0 20px 40px -12px rgba(0, 0, 0, 0.35)',
        xl: '0 8px 24px rgba(0, 0, 0, 0.45), 0 40px 80px -20px rgba(0, 0, 0, 0.50)',
      };

export function createTheme(ramps, mode) {
  const { neutral: n, accent: a, success: s, warning: w, danger: d, info: i, alpha } = ramps;

  // Ramp objects are keyed by their own name (slate1, indigo9 …), so read them positionally.
  const step = (ramp, index) => Object.values(ramp)[index - 1];
  const isLight = mode === 'light';

  const colors = {
    // ── Tonal surfaces ──────────────────────────────────────────────────────
    // Layered by tone. Each container step sits one tone above the page, so depth reads
    // without a single border or shadow. This is the core of the "soft" look.
    surfacePage: step(n, 1),
    surfaceContainerLow: step(n, 2),
    surfaceContainer: step(n, 3),
    surfaceContainerHigh: step(n, 4),
    surfaceContainerHighest: step(n, 5),

    // Elevated things that float above the page (menus, dialogs, sheets).
    //
    // Deliberately one tone *below* `surfaceContainer` so that controls placed on an
    // elevated surface still read as a step up from it. Setting this to step 3 in dark made
    // inputs and their card identical.
    surfaceElevated: isLight ? '#ffffff' : step(n, 2),

    surfaceHover: step(n, 4),
    surfaceActive: step(n, 5),
    surfaceScrim: isLight ? 'rgba(15, 23, 42, 0.32)' : 'rgba(0, 0, 0, 0.60)',

    // ── Text ────────────────────────────────────────────────────────────────
    textPrimary: step(n, 12),
    textSecondary: step(n, 11),
    textMuted: step(n, 10), // meta only — below 4.5:1 by design
    textDisabled: step(n, 8),
    textOnAccent: '#ffffff', // step 9 of every Radix ramp is built for white text
    textLink: step(a, 11),
    textLinkHover: step(a, 12),

    // ── Lines ───────────────────────────────────────────────────────────────
    // Deliberately faint. Tone separates surfaces; a line is only for genuine division.
    lineSubtle: step(n, 5),
    lineDefault: step(n, 6),
    lineStrong: step(n, 8),
    lineFocus: step(a, 8),

    // ── Ink ─────────────────────────────────────────────────────────────────
    // The primary action colour, and deliberately *not* the accent. An interface that
    // paints every important button in its brand colour reads as a template, because the
    // accent ends up meaning nothing. Ink is the darkest neutral in light mode and the
    // lightest in dark, so a primary button is always the highest-contrast object present.
    inkSolid: isLight ? step(n, 12) : step(n, 12),
    inkSolidHover: isLight ? step(n, 11) : step(n, 11),
    textOnInk: isLight ? step(n, 1) : step(n, 1),

    // ── Accent ──────────────────────────────────────────────────────────────
    // Used sparingly: links, marks, the read-rate fill. Never a page full of buttons.
    accentContainer: step(a, 3), // tonal chip / selected state
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
