import styled from 'styled-components';

export const Card = styled.div`
  background: ${(p) => p.theme.palette.background.surface};
  color: inherit;
  border: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  border-radius: ${(p) => p.theme.radii.xl};
  box-shadow: ${(p) => (p.$elevated ? p.theme.shadows.lg : p.theme.shadows.sm)};
  padding: ${(p) =>
    typeof p.$p === 'number'
      ? p.theme.spacing(p.$p)
      : p.$p !== undefined
        ? p.$p
        : p.theme.spacing(4)};
  overflow: ${(p) => (p.$overflow ? p.$overflow : 'visible')};
  transition: all ${(p) => p.theme.motion.duration.normal} ${(p) => p.theme.motion.easing.standard};

  /* Hover effect for interactive cards */
  ${(p) =>
    p.$interactive &&
    `
    cursor: pointer;
    &:hover {
      box-shadow: ${p.theme.shadows.lg};
      transform: translateY(-2px);
      border-color: ${p.theme.palette.primary.light};
    }
    &:active {
      transform: translateY(0);
    }
  `}

  /* Focus state for accessibility */
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
    outline-offset: 2px;
  }
`;

// Card Header
export const CardHeader = styled.div`
  display: flex;
  align-items: ${(p) => p.$align || 'center'};
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing(4)};
  padding: ${(p) =>
    typeof p.$p === 'number' ? p.theme.spacing(p.$p) : p.$p || p.theme.spacing(6)};
  border-bottom: ${(p) =>
    p.$divider ? `${p.theme.borderWidth.thin} solid ${p.theme.palette.divider}` : 'none'};
  transition: border-color ${(p) => p.theme.motion.duration.fast}
    ${(p) => p.theme.motion.easing.standard};
`;

// Card Title
export const CardTitle = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.typography.size.lg};
  font-weight: ${(p) => p.theme.typography.weight.semibold};
  color: ${(p) => p.theme.palette.text.primary};
  line-height: ${(p) => p.theme.typography.lineHeight.tight};
  letter-spacing: -0.01em;
`;

// Card Description/Subtitle
export const CardDescription = styled.p`
  margin: ${(p) => p.theme.spacing(1)} 0 0 0;
  font-size: ${(p) => p.theme.typography.size.sm};
  color: ${(p) => p.theme.palette.text.secondary};
  line-height: ${(p) => p.theme.typography.lineHeight.relaxed};
`;

// Card Actions (for header)
export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
  flex-shrink: 0;
`;

// Card Body/Content
export const CardBody = styled.div`
  padding: ${(p) =>
    typeof p.$p === 'number' ? p.theme.spacing(p.$p) : p.$p || p.theme.spacing(6)};
  flex: 1;
`;

// Card Footer
export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(p) => p.$justify || 'flex-end'};
  gap: ${(p) => p.theme.spacing(3)};
  padding: ${(p) =>
    typeof p.$p === 'number' ? p.theme.spacing(p.$p) : p.$p || p.theme.spacing(6)};
  border-top: ${(p) =>
    p.$divider ? `${p.theme.borderWidth.thin} solid ${p.theme.palette.divider}` : 'none'};
`;

// Compose Card with sub-components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Actions = CardActions;
Card.Body = CardBody;
Card.Footer = CardFooter;

export const Divider = styled.hr`
  border: 0;
  height: 0;
  border-top: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  margin: ${(p) =>
    typeof p.$my === 'number' ? `${p.theme.spacing(p.$my)} 0` : p.$my || `${p.theme.spacing(4)} 0`};
  transition: border-color ${(p) => p.theme.motion.duration.fast}
    ${(p) => p.theme.motion.easing.standard};
  opacity: ${(p) => (p.$fade ? 0.5 : 1)};
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  height: ${(p) => p.theme.spacing(6)};
  padding: 0 ${(p) => p.theme.spacing(2)};
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.size.sm};
  font-weight: 600;
  color: ${(p) => p.$color || p.theme.palette.primary.dark};
  background: ${(p) =>
    p.$bg || `color-mix(in srgb, ${p.theme.palette.primary.main} 15%, transparent)`};
  transition: all ${(p) => p.theme.motion.duration.fast} ${(p) => p.theme.motion.easing.standard};
  cursor: ${(p) => (p.$interactive ? 'pointer' : 'default')};

  ${(p) =>
    p.$interactive &&
    `
    &:hover {
      transform: scale(1.05);
      opacity: 0.9;
    }
    &:active {
      transform: scale(0.98);
    }
  `}
`;

// Paper - lighter surface variant
export const Paper = styled.div`
  background: ${(p) => p.theme.palette.background.surface};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: ${(p) =>
    typeof p.$p === 'number' ? p.theme.spacing(p.$p) : p.$p || p.theme.spacing(4)};
  box-shadow: ${(p) => (p.$elevated ? p.theme.shadows.md : p.theme.shadows.sm)};
  transition: all ${(p) => p.theme.motion.duration.normal} ${(p) => p.theme.motion.easing.standard};

  ${(p) =>
    p.$interactive &&
    `
    cursor: pointer;
    &:hover {
      box-shadow: ${p.theme.shadows.md};
      transform: translateY(-1px);
    }
    &:active {
      transform: translateY(0);
    }
  `}

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
    outline-offset: 2px;
  }
`;
