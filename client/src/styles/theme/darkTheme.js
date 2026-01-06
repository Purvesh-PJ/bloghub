// Dark theme - Clean, minimal, Notion-inspired
export const darkTheme = {
  mode: 'dark',

  colors: {
    // Backgrounds - subtle hierarchy
    bgPrimary: '#191919',
    bgSecondary: '#121212',
    bgTertiary: '#232323',
    bgElevated: '#1e1e1e',
    bgHover: 'rgba(255, 255, 255, 0.05)',
    bgActive: 'rgba(255, 255, 255, 0.08)',
    bgOverlay: 'rgba(0, 0, 0, 0.6)',

    // Text - high contrast, clear hierarchy
    textPrimary: '#ebebeb',
    textSecondary: '#a0a0a0',
    textMuted: '#6b6b6b',
    textDisabled: '#4a4a4a',
    textInverse: '#121212',
    textLink: '#ebebeb',
    textLinkHover: '#a0a0a0',

    // Borders - minimal, only when needed
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.04)',
    borderHover: 'rgba(255, 255, 255, 0.12)',
    borderFocus: '#ebebeb',

    // Brand/Accent - neutral white
    accent: '#ebebeb',
    accentHover: '#ffffff',
    accentActive: '#ffffff',
    accentSubtle: 'rgba(255, 255, 255, 0.05)',
    accentMuted: 'rgba(255, 255, 255, 0.1)',

    // Semantic - muted, professional
    success: '#22c55e',
    successHover: '#4ade80',
    successBg: 'rgba(34, 197, 94, 0.15)',
    successBorder: 'rgba(34, 197, 94, 0.25)',

    warning: '#f59e0b',
    warningHover: '#fbbf24',
    warningBg: 'rgba(245, 158, 11, 0.15)',
    warningBorder: 'rgba(245, 158, 11, 0.25)',

    error: '#ef4444',
    errorHover: '#f87171',
    errorBg: 'rgba(239, 68, 68, 0.15)',
    errorBorder: 'rgba(239, 68, 68, 0.25)',

    info: '#a0a0a0',
    infoHover: '#ebebeb',
    infoBg: 'rgba(255, 255, 255, 0.05)',
    infoBorder: 'rgba(255, 255, 255, 0.1)',

    // Buttons - clean, minimal
    buttonPrimaryBg: '#ebebeb',
    buttonPrimaryText: '#121212',
    buttonPrimaryHover: '#ffffff',
    buttonSecondaryBg: '#232323',
    buttonSecondaryText: '#ebebeb',
    buttonSecondaryHover: '#2d2d2d',
    buttonSecondaryBorder: 'rgba(255, 255, 255, 0.1)',
    buttonGhostHover: 'rgba(255, 255, 255, 0.05)',

    // Input - clean, subtle
    inputBg: '#191919',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    inputBorderHover: 'rgba(255, 255, 255, 0.2)',
    inputBorderFocus: '#ebebeb',
    inputPlaceholder: '#6b6b6b',

    // Card - elevation based, no borders
    cardBg: '#191919',
    cardBorder: 'transparent',
    cardHoverBg: '#1e1e1e',

    // Scrollbar
    scrollbarTrack: 'transparent',
    scrollbarThumb: 'rgba(255, 255, 255, 0.15)',
    scrollbarThumbHover: 'rgba(255, 255, 255, 0.25)',

    // Selection
    selection: 'rgba(255, 255, 255, 0.15)',
    selectionText: '#ebebeb',

    // Code
    codeBg: '#232323',
    codeBorder: 'transparent',

    // Badge
    badgeBg: 'rgba(255, 255, 255, 0.08)',
    badgeText: '#a0a0a0',
    badgeActiveBg: '#ebebeb',
    badgeActiveText: '#121212',
  },

  shadows: {
    none: 'none',
    xs: '0 1px 2px rgba(0, 0, 0, 0.2)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    md: '0 4px 6px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.2)',
    xl: '0 15px 40px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.2)',
    card: '0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)',
    cardHover: '0 8px 24px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
    focus: '0 0 0 2px rgba(255, 255, 255, 0.1)',
    focusRing: '0 0 0 2px #191919, 0 0 0 4px #ebebeb',
  },
};
