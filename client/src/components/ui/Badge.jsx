import styled, { css } from 'styled-components';
import { text } from '../../styles/theme/mixins';

/**
 * Badge — a small status label.
 *
 * Every variant used to be a hard-coded hex pair (`rgba(99, 102, 241, 0.1)` / `#6366f1`),
 * which is why badges kept their indigo-on-white look in dark mode while everything around
 * them changed. They are tonal container/text pairs from the theme now, so they follow the
 * palette in both modes.
 */

const variants = {
  neutral: css`
    background: ${({ theme }) => theme.colors.surfaceContainerHigh};
    color: ${({ theme }) => theme.colors.textSecondary};
  `,
  primary: css`
    background: ${({ theme }) => theme.colors.accentContainer};
    color: ${({ theme }) => theme.colors.accentText};
  `,
  success: css`
    background: ${({ theme }) => theme.colors.successContainer};
    color: ${({ theme }) => theme.colors.successText};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warningContainer};
    color: ${({ theme }) => theme.colors.warningText};
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.dangerContainer};
    color: ${({ theme }) => theme.colors.dangerText};
  `,
  info: css`
    background: ${({ theme }) => theme.colors.infoContainer};
    color: ${({ theme }) => theme.colors.infoText};
  `,
};

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 3px ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;
  ${text('xs', 'medium')}

  ${({ $variant }) => variants[$variant] || variants.neutral}

  svg {
    width: 12px;
    height: 12px;
  }
`;

export function Badge({ children, variant = 'neutral', ...props }) {
  return (
    <StyledBadge $variant={variant} {...props}>
      {children}
    </StyledBadge>
  );
}
