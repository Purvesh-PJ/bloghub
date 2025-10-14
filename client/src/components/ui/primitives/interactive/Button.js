import styled, { css } from 'styled-components';

const sizes = {
  sm: css`
    height: ${(p) => p.theme.spacing(8)};
    padding: 0 ${(p) => p.theme.spacing(3)};
    font-size: ${(p) => p.theme.typography.size.sm};
  `,
  md: css`
    height: ${(p) => p.theme.spacing(10)};
    padding: 0 ${(p) => p.theme.spacing(4)};
    font-size: ${(p) => p.theme.typography.size.md};
  `,
  lg: css`
    height: ${(p) => p.theme.spacing(12)};
    padding: 0 ${(p) => p.theme.spacing(5)};
    font-size: ${(p) => p.theme.typography.size.lg};
  `,
};

const variants = ({ theme, $variant = 'primary' }) => {
  const p = theme.palette;
  switch ($variant) {
    case 'secondary':
      return css`
        background: ${p.secondary.main};
        color: ${p.secondary.contrastText};
        &:hover {
          background: ${p.secondary.dark};
        }
      `;
    case 'ghost':
      return css`
        background: transparent;
        color: ${p.primary.main};
        border: ${(props) => props.theme.borderWidth.thin} solid ${p.divider};
        &:hover {
          background: ${p.background.subtle};
        }
      `;
    case 'danger':
      return css`
        background: ${p.error.main};
        color: ${p.error.contrastText};
        &:hover {
          background: ${p.error.dark};
        }
      `;
    default:
      return css`
        background: ${p.primary.main};
        color: ${p.primary.contrastText};
        &:hover {
          background: ${p.primary.dark};
        }
      `;
  }
};

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.spacing(2)};
  font-weight: 600;
  line-height: 1;
  border: 0;
  cursor: pointer;
  transition:
    background ${(p) => p.theme.motion.duration.fast} ${(p) => p.theme.motion.easing.standard},
    color ${(p) => p.theme.motion.duration.fast} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.fast} ${(p) => p.theme.motion.easing.standard},
    opacity ${(p) => p.theme.motion.duration.fast} ${(p) => p.theme.motion.easing.standard};
  ${(props) => sizes[props.$size || 'md']};
  ${variants};
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
  pointer-events: ${(p) => (p.disabled ? 'none' : 'auto')};
  border-radius: ${(p) => p.theme.radii.lg};
`;

export const IconButton = styled(Button)`
  padding: 0;
  width: ${(p) =>
    p.$size === 'lg'
      ? p.theme.spacing(12)
      : p.$size === 'sm'
        ? p.theme.spacing(8)
        : p.theme.spacing(10)};
  aspect-ratio: 1/1;
`;
