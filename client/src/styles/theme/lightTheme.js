// Light theme - Clean, minimal, Notion-inspired
export const lightTheme = {
  mode: 'light',

  colors: {
    // Backgrounds - subtle hierarchy
    bgPrimary: '#ffffff',
    bgSecondary: '#fafafa',
    bgTertiary: '#f5f5f5',
    bgElevated: '#ffffff',
    bgHover: 'rgba(0, 0, 0, 0.03)',
    bgActive: 'rgba(0, 0, 0, 0.05)',
    bgOverlay: 'rgba(0, 0, 0, 0.4)',

    // Text - high contrast, clear hierarchy
    textPrimary: '#1a1a1a',
    textSecondary: '#6b6b6b',
    textMuted: '#9a9a9a',
    textDisabled: '#c4c4c4',
    textInverse: '#ffffff',
    textLink: '#1a1a1a',
    textLinkHover: '#6b6b6b',

    // Borders - minimal, only when needed
    border: 'rgba(0, 0, 0, 0.08)',
    borderLight: 'rgba(0, 0, 0, 0.04)',
    borderHover: 'rgba(0, 0, 0, 0.12)',
    borderFocus: '#1a1a1a',

    // Brand/Accent - neutral black
    accent: '#1a1a1a',
    accentHover: '#333333',
    accentActive: '#000000',
    accentSubtle: 'rgba(0, 0, 0, 0.05)',
    accentMuted: 'rgba(0, 0, 0, 0.1)',

    // Semantic - muted, professional
    success: '#22c55e',
    successHover: '#16a34a',
    successBg: 'rgba(34, 197, 94, 0.1)',
    successBorder: 'rgba(34, 197, 94, 0.2)',

    warning: '#f59e0b',
    warningHover: '#d97706',
    warningBg: 'rgba(245, 158, 11, 0.1)',
    warningBorder: 'rgba(245, 158, 11, 0.2)',

    error: '#ef4444',
    errorHover: '#dc2626',
    errorBg: 'rgba(239, 68, 68, 0.1)',
    errorBorder: 'rgba(239, 68, 68, 0.2)',

    info: '#6b6b6b',
    infoHover: '#525252',
    infoBg: 'rgba(0, 0, 0, 0.05)',
    infoBorder: 'rgba(0, 0, 0, 0.1)',

    // Buttons - clean, minimal
    buttonPrimaryBg: '#1a1a1a',
    buttonPrimaryText: '#ffffff',
    buttonPrimaryHover: '#333333',
    buttonSecondaryBg: '#ffffff',
    buttonSecondaryText: '#1a1a1a',
    buttonSecondaryHover: '#f5f5f5',
    buttonSecondaryBorder: 'rgba(0, 0, 0, 0.1)',
    buttonGhostHover: 'rgba(0, 0, 0, 0.05)',

    // Input - clean, subtle
    inputBg: '#ffffff',
    inputBorder: 'rgba(0, 0, 0, 0.1)',
    inputBorderHover: 'rgba(0, 0, 0, 0.2)',
    inputBorderFocus: '#1a1a1a',
    inputPlaceholder: '#9a9a9a',

    // Card - elevation based, no borders
    cardBg: '#ffffff',
    cardBorder: 'transparent',
    cardHoverBg: '#ffffff',

    // Scrollbar
    scrollbarTrack: 'transparent',
    scrollbarThumb: 'rgba(0, 0, 0, 0.15)',
    scrollbarThumbHover: 'rgba(0, 0, 0, 0.25)',

    // Selection
    selection: 'rgba(0, 0, 0, 0.1)',
    selectionText: '#1a1a1a',

    // Code
    codeBg: '#f5f5f5',
    codeBorder: 'transparent',

    // Badge
    badgeBg: 'rgba(0, 0, 0, 0.05)',
    badgeText: '#6b6b6b',
    badgeActiveBg: '#1a1a1a',
    badgeActiveText: '#ffffff',
  },

  shadows: {
    none: 'none',
    xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.03)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.06), 0 3px 6px rgba(0, 0, 0, 0.04)',
    xl: '0 15px 40px rgba(0, 0, 0, 0.08), 0 5px 15px rgba(0, 0, 0, 0.04)',
    card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
    cardHover: '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
    focus: '0 0 0 2px rgba(0, 0, 0, 0.1)',
    focusRing: '0 0 0 2px #ffffff, 0 0 0 4px #1a1a1a',
  },
};
