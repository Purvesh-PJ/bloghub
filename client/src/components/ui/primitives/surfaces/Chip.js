import styled, { css } from 'styled-components';

// Chip variants
const variants = ({ theme, $variant = 'default' }) => {
  const configs = {
    default: {
      bg: theme.palette.grey[100],
      text: theme.palette.text.primary,
      border: theme.palette.grey[300],
    },
    primary: {
      bg: `${theme.palette.primary.main}15`,
      text: theme.palette.primary.dark,
      border: `${theme.palette.primary.main}30`,
    },
    secondary: {
      bg: `${theme.palette.secondary.main}15`,
      text: theme.palette.secondary.dark,
      border: `${theme.palette.secondary.main}30`,
    },
    success: {
      bg: `${theme.palette.success.main}15`,
      text: theme.palette.success.dark,
      border: `${theme.palette.success.main}30`,
    },
    error: {
      bg: `${theme.palette.error.main}15`,
      text: theme.palette.error.dark,
      border: `${theme.palette.error.main}30`,
    },
    warning: {
      bg: `${theme.palette.warning.main}15`,
      text: theme.palette.warning.dark,
      border: `${theme.palette.warning.main}30`,
    },
  };

  const config = configs[$variant] || configs.default;

  return css`
    background: ${config.bg};
    color: ${config.text};
    border-color: ${config.border};
  `;
};

// Chip sizes
const sizes = {
  sm: css`
    height: ${({ theme }) => theme.spacing(5)};
    padding: 0 ${({ theme }) => theme.spacing(2)};
    font-size: ${({ theme }) => theme.typography.size.xs};
  `,
  md: css`
    height: ${({ theme }) => theme.spacing(6)};
    padding: 0 ${({ theme }) => theme.spacing(3)};
    font-size: ${({ theme }) => theme.typography.size.sm};
  `,
  lg: css`
    height: ${({ theme }) => theme.spacing(8)};
    padding: 0 ${({ theme }) => theme.spacing(4)};
    font-size: ${({ theme }) => theme.typography.size.md};
  `,
};

// Main Chip component
export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: ${({ theme }) => theme.borderWidth.thin} solid transparent;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: 1;
  transition: all ${({ theme }) => theme.motion.duration.fast};
  white-space: nowrap;
  ${({ $size = 'md' }) => sizes[$size] || sizes.md};
  ${variants};

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;

      &:hover {
        opacity: 0.8;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    `}
`;

// Chip icon wrapper
export const ChipIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  line-height: 1;
`;

// Chip close/delete button
export const ChipDelete = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing(4)};
  height: ${({ theme }) => theme.spacing(4)};
  padding: 0;
  border: none;
  background: transparent;
  color: currentColor;
  opacity: 0.6;
  cursor: pointer;
  border-radius: 50%;
  transition: all ${({ theme }) => theme.motion.duration.fast};
  margin-right: ${({ theme }) => `-${theme.spacing(1)}`};

  &:hover {
    opacity: 1;
    background: currentColor;
    color: ${({ theme }) => theme.palette.common.white};
  }

  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 1px;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

// Chip avatar
export const ChipAvatar = styled.img`
  width: ${({ theme }) => theme.spacing(5)};
  height: ${({ theme }) => theme.spacing(5)};
  border-radius: 50%;
  object-fit: cover;
  margin-left: ${({ theme }) => `-${theme.spacing(1)}`};
`;

// Compose Chip with sub-components
Chip.Icon = ChipIcon;
Chip.Delete = ChipDelete;
Chip.Avatar = ChipAvatar;

export default Chip;
