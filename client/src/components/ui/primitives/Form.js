import styled from 'styled-components';

/**
 * Form - A styled form primitive with consistent spacing and layout
 *
 * @example
 * <Form onSubmit={handleSubmit} $gap={4}>
 *   <InputField />
 *   <Button type="submit">Submit</Button>
 * </Form>
 */
export const Form = styled.form`
  display: flex;
  flex-direction: ${(p) => p.$direction || 'column'};
  gap: ${(p) =>
    typeof p.$gap === 'number' ? p.theme.spacing(p.$gap) : p.$gap || p.theme.spacing(4)};
  width: ${(p) => p.$width || '100%'};
  max-width: ${(p) => p.$maxWidth || 'none'};

  /* Padding */
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

  /* Margin */
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
    return p.$bg;
  }};

  /* Borders */
  border: ${(p) => {
    if (!p.$border) return 'none';
    if (p.$border === true) return `${p.theme.borderWidth.thin} solid ${p.theme.palette.divider}`;
    return p.$border;
  }};
  border-radius: ${(p) => {
    if (!p.$radius) return '0';
    // Support theme radius shortcuts
    if (p.$radius === 'xs') return p.theme.radii.xs;
    if (p.$radius === 'sm') return p.theme.radii.sm;
    if (p.$radius === 'md') return p.theme.radii.md;
    if (p.$radius === 'lg') return p.theme.radii.lg;
    if (p.$radius === 'xl') return p.theme.radii.xl;
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

  /* Align items when direction is row */
  ${(p) =>
    p.$direction === 'row' &&
    `
    align-items: ${p.$align || 'center'};
    justify-content: ${p.$justify || 'flex-start'};
    flex-wrap: ${p.$wrap ? 'wrap' : 'nowrap'};
  `}
`;

/**
 * FormSection - A section within a form for grouping related fields
 */
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) =>
    typeof p.$gap === 'number' ? p.theme.spacing(p.$gap) : p.$gap || p.theme.spacing(3)};

  /* Padding */
  padding: ${(p) => {
    if (p.$p !== undefined) return typeof p.$p === 'number' ? p.theme.spacing(p.$p) : p.$p;
    return '0';
  }};

  /* Margin */
  margin: ${(p) => {
    if (p.$m !== undefined) return typeof p.$m === 'number' ? p.theme.spacing(p.$m) : p.$m;
    return '0';
  }};
  margin-bottom: ${(p) =>
    p.$mb !== undefined ? (typeof p.$mb === 'number' ? p.theme.spacing(p.$mb) : p.$mb) : ''};

  /* Borders */
  border: ${(p) => {
    if (!p.$border) return 'none';
    if (p.$border === true) return `${p.theme.borderWidth.thin} solid ${p.theme.palette.divider}`;
    return p.$border;
  }};
  border-radius: ${(p) => {
    if (!p.$radius) return '0';
    if (p.$radius === 'sm') return p.theme.radii.sm;
    if (p.$radius === 'md') return p.theme.radii.md;
    if (p.$radius === 'lg') return p.theme.radii.lg;
    return p.$radius;
  }};

  /* Background */
  background: ${(p) => {
    if (!p.$bg) return 'transparent';
    if (p.$bg === 'surface') return p.theme.palette.background.surface;
    if (p.$bg === 'subtle') return p.theme.palette.background.subtle;
    return p.$bg;
  }};
`;

/**
 * FormRow - A horizontal row within a form for side-by-side fields
 */
export const FormRow = styled.div`
  display: flex;
  gap: ${(p) =>
    typeof p.$gap === 'number' ? p.theme.spacing(p.$gap) : p.$gap || p.theme.spacing(4)};
  align-items: ${(p) => p.$align || 'flex-start'};
  justify-content: ${(p) => p.$justify || 'flex-start'};
  flex-wrap: ${(p) => (p.$wrap ? 'wrap' : 'nowrap')};

  /* Responsive behavior */
  @media (max-width: ${(p) => p.theme.breakpoints?.md || '768px'}) {
    flex-direction: ${(p) => (p.$stackOnMobile ? 'column' : 'row')};
    gap: ${(p) =>
      p.$stackOnMobile
        ? typeof p.$gap === 'number'
          ? p.theme.spacing(Math.max(2, p.$gap - 1))
          : p.theme.spacing(3)
        : typeof p.$gap === 'number'
          ? p.theme.spacing(p.$gap)
          : p.$gap || p.theme.spacing(4)};
  }

  /* Equal width children */
  ${(p) =>
    p.$equalWidth &&
    `
    > * {
      flex: 1;
      min-width: 0;
    }
  `}
`;

/**
 * FormActions - Container for form action buttons (submit, cancel, etc.)
 */
export const FormActions = styled.div`
  display: flex;
  gap: ${(p) =>
    typeof p.$gap === 'number' ? p.theme.spacing(p.$gap) : p.$gap || p.theme.spacing(3)};
  align-items: center;
  justify-content: ${(p) => p.$justify || 'flex-end'};
  flex-wrap: wrap;

  /* Padding */
  padding-top: ${(p) =>
    typeof p.$pt === 'number' ? p.theme.spacing(p.$pt) : p.$pt || p.theme.spacing(4)};

  /* Border */
  ${(p) =>
    p.$divider &&
    `
    border-top: ${p.theme.borderWidth.thin} solid ${p.theme.palette.divider};
    margin-top: ${typeof p.$pt === 'number' ? p.theme.spacing(p.$pt) : p.$pt || p.theme.spacing(4)};
  `}

  /* Responsive stacking */
  @media (max-width: ${(p) => p.theme.breakpoints?.sm || '640px'}) {
    flex-direction: ${(p) => (p.$stackOnMobile ? 'column-reverse' : 'row')};
    justify-content: ${(p) => (p.$stackOnMobile ? 'stretch' : p.$justify || 'flex-end')};

    ${(p) =>
      p.$stackOnMobile &&
      `
      > * {
        width: 100%;
      }
    `}
  }
`;
