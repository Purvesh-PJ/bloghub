import styled from 'styled-components';

/**
 * Box - A flexible primitive component for building layouts
 *
 * @example
 * <Box $p={4} $bg="surface" $radius="lg">
 *   Content here
 * </Box>
 */
export const Box = styled.div`
  /* Display & Layout */
  display: ${(p) => p.$display || 'block'};
  position: ${(p) => p.$position || 'relative'};
  width: ${(p) => p.$width || 'auto'};
  height: ${(p) => p.$height || 'auto'};
  max-width: ${(p) => p.$maxWidth || 'none'};
  max-height: ${(p) => p.$maxHeight || 'none'};
  min-width: ${(p) => p.$minWidth || 'auto'};
  min-height: ${(p) => p.$minHeight || 'auto'};
  overflow: ${(p) => p.$overflow || 'visible'};
  overflow-x: ${(p) => p.$overflowX || 'visible'};
  overflow-y: ${(p) => p.$overflowY || 'visible'};

  /* Spacing - Padding */
  padding: ${(p) => {
    if (p.$p !== undefined) return typeof p.$p === 'number' ? p.theme.spacing(p.$p) : p.$p;
    return '0';
  }};
  padding-top: ${(p) =>
    p.$pt !== undefined ? (typeof p.$pt === 'number' ? p.theme.spacing(p.$pt) : p.$pt) : ''};
  padding-right: ${(p) =>
    p.$pr !== undefined ? (typeof p.$pr === 'number' ? p.theme.spacing(p.$pr) : p.$pr) : ''};
  padding-bottom: ${(p) =>
    p.$pb !== undefined ? (typeof p.$pb === 'number' ? p.theme.spacing(p.$pb) : p.$pb) : ''};
  padding-left: ${(p) =>
    p.$pl !== undefined ? (typeof p.$pl === 'number' ? p.theme.spacing(p.$pl) : p.$pl) : ''};
  padding-inline: ${(p) =>
    p.$px !== undefined ? (typeof p.$px === 'number' ? p.theme.spacing(p.$px) : p.$px) : ''};
  padding-block: ${(p) =>
    p.$py !== undefined ? (typeof p.$py === 'number' ? p.theme.spacing(p.$py) : p.$py) : ''};

  /* Spacing - Margin */
  margin: ${(p) => {
    if (p.$m !== undefined) return typeof p.$m === 'number' ? p.theme.spacing(p.$m) : p.$m;
    return '0';
  }};
  margin-top: ${(p) =>
    p.$mt !== undefined ? (typeof p.$mt === 'number' ? p.theme.spacing(p.$mt) : p.$mt) : ''};
  margin-right: ${(p) =>
    p.$mr !== undefined ? (typeof p.$mr === 'number' ? p.theme.spacing(p.$mr) : p.$mr) : ''};
  margin-bottom: ${(p) =>
    p.$mb !== undefined ? (typeof p.$mb === 'number' ? p.theme.spacing(p.$mb) : p.$mb) : ''};
  margin-left: ${(p) =>
    p.$ml !== undefined ? (typeof p.$ml === 'number' ? p.theme.spacing(p.$ml) : p.$ml) : ''};
  margin-inline: ${(p) =>
    p.$mx !== undefined ? (typeof p.$mx === 'number' ? p.theme.spacing(p.$mx) : p.$mx) : ''};
  margin-block: ${(p) =>
    p.$my !== undefined ? (typeof p.$my === 'number' ? p.theme.spacing(p.$my) : p.$my) : ''};

  /* Background & Colors */
  background: ${(p) => {
    if (!p.$bg) return 'transparent';
    // Support theme palette shortcuts
    if (p.$bg === 'surface') return p.theme.palette.background.surface;
    if (p.$bg === 'default') return p.theme.palette.background.default;
    if (p.$bg === 'subtle') return p.theme.palette.background.subtle;
    if (p.$bg === 'primary') return p.theme.palette.primary.main;
    if (p.$bg === 'secondary') return p.theme.palette.secondary.main;
    return p.$bg;
  }};
  color: ${(p) => {
    if (!p.$color) return 'inherit';
    // Support theme text shortcuts
    if (p.$color === 'primary') return p.theme.palette.text.primary;
    if (p.$color === 'secondary') return p.theme.palette.text.secondary;
    if (p.$color === 'muted') return p.theme.palette.text.muted;
    return p.$color;
  }};

  /* Borders */
  border: ${(p) => {
    if (!p.$border) return 'none';
    if (p.$border === true) return `${p.theme.borderWidth.thin} solid ${p.theme.palette.divider}`;
    return p.$border;
  }};
  border-top: ${(p) => p.$borderTop || ''};
  border-right: ${(p) => p.$borderRight || ''};
  border-bottom: ${(p) => p.$borderBottom || ''};
  border-left: ${(p) => p.$borderLeft || ''};
  border-radius: ${(p) => {
    if (!p.$radius) return '0';
    // Support theme radius shortcuts
    if (p.$radius === 'xs') return p.theme.radii.xs;
    if (p.$radius === 'sm') return p.theme.radii.sm;
    if (p.$radius === 'md') return p.theme.radii.md;
    if (p.$radius === 'lg') return p.theme.radii.lg;
    if (p.$radius === 'xl') return p.theme.radii.xl;
    if (p.$radius === 'pill') return p.theme.radii.pill;
    return typeof p.$radius === 'number' ? p.theme.spacing(p.$radius) : p.$radius;
  }};

  /* Shadows */
  box-shadow: ${(p) => {
    if (!p.$shadow) return 'none';
    if (p.$shadow === 'sm') return p.theme.shadows.sm;
    if (p.$shadow === 'md') return p.theme.shadows.md;
    if (p.$shadow === 'lg') return p.theme.shadows.lg;
    return p.$shadow;
  }};

  /* Flexbox (when display is flex) */
  ${(p) =>
    p.$display === 'flex' &&
    `
    flex-direction: ${p.$flexDirection || 'row'};
    align-items: ${p.$alignItems || 'stretch'};
    justify-content: ${p.$justifyContent || 'flex-start'};
    gap: ${typeof p.$gap === 'number' ? p.theme.spacing(p.$gap) : p.$gap || '0'};
    flex-wrap: ${p.$flexWrap || 'nowrap'};
    flex: ${p.$flex || 'initial'};
  `}

  /* Grid (when display is grid) */
  ${(p) =>
    p.$display === 'grid' &&
    `
    grid-template-columns: ${p.$gridCols || 'none'};
    grid-template-rows: ${p.$gridRows || 'none'};
    gap: ${typeof p.$gap === 'number' ? p.theme.spacing(p.$gap) : p.$gap || '0'};
    align-items: ${p.$alignItems || 'stretch'};
    justify-items: ${p.$justifyItems || 'stretch'};
  `}

  /* Typography */
  font-size: ${(p) => {
    if (!p.$fontSize) return 'inherit';
    // Support theme size shortcuts
    if (p.$fontSize === 'xs') return p.theme.typography.size.xs;
    if (p.$fontSize === 'sm') return p.theme.typography.size.sm;
    if (p.$fontSize === 'md') return p.theme.typography.size.md;
    if (p.$fontSize === 'lg') return p.theme.typography.size.lg;
    if (p.$fontSize === 'xl') return p.theme.typography.size.xl;
    return p.$fontSize;
  }};
  font-weight: ${(p) => {
    if (!p.$fontWeight) return 'inherit';
    if (p.$fontWeight === 'regular') return p.theme.typography.weight.regular;
    if (p.$fontWeight === 'medium') return p.theme.typography.weight.medium;
    if (p.$fontWeight === 'semibold') return p.theme.typography.weight.semibold;
    if (p.$fontWeight === 'bold') return p.theme.typography.weight.bold;
    return p.$fontWeight;
  }};
  text-align: ${(p) => p.$textAlign || 'left'};
  line-height: ${(p) => {
    if (!p.$lineHeight) return 'inherit';
    if (p.$lineHeight === 'tight') return p.theme.typography.lineHeight.tight;
    if (p.$lineHeight === 'snug') return p.theme.typography.lineHeight.snug;
    if (p.$lineHeight === 'normal') return p.theme.typography.lineHeight.normal;
    if (p.$lineHeight === 'relaxed') return p.theme.typography.lineHeight.relaxed;
    return p.$lineHeight;
  }};

  /* Transforms & Effects */
  opacity: ${(p) => p.$opacity || '1'};
  z-index: ${(p) => p.$zIndex || 'auto'};
  cursor: ${(p) => p.$cursor || 'auto'};
  pointer-events: ${(p) => p.$pointerEvents || 'auto'};

  /* Transitions */
  transition: ${(p) => {
    if (!p.$transition) return 'none';
    if (p.$transition === true)
      return `all ${p.theme.motion.duration.normal} ${p.theme.motion.easing.standard}`;
    return p.$transition;
  }};

  /* Hover effects */
  ${(p) =>
    p.$hover &&
    `
    &:hover {
      ${p.$hover}
    }
  `}

  /* Focus effects */
  ${(p) =>
    p.$focusVisible &&
    `
    &:focus-visible {
      outline: 2px solid ${p.theme.palette.primary.main};
      outline-offset: 2px;
    }
  `}
`;

// Convenience exports for specific use cases
export const Section = styled(Box).attrs({ as: 'section' })``;
export const Article = styled(Box).attrs({ as: 'article' })``;
export const Aside = styled(Box).attrs({ as: 'aside' })``;
export const Header = styled(Box).attrs({ as: 'header' })``;
export const Footer = styled(Box).attrs({ as: 'footer' })``;
export const Main = styled(Box).attrs({ as: 'main' })``;
export const Nav = styled(Box).attrs({ as: 'nav' })``;