import styled, { css } from 'styled-components';
import { text, interactive } from '../../styles/theme/mixins';

/**
 * Chip — pill-shaped tag, filter or category label.
 *
 * Used for the feed filters, topic lists and post categories, which were three separate
 * near-identical implementations before.
 */

const StyledChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: ${({ $size }) => ($size === 'sm' ? '28px' : '36px')};
  padding: 0 ${({ theme, $size }) => ($size === 'sm' ? theme.spacing.md : theme.spacing.lg)};

  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;
  flex-shrink: 0;
  ${({ $size }) => ($size === 'sm' ? text('xs', 'medium') : text('sm', 'medium'))}
  transition: all ${({ theme }) => theme.transitions.fast};
  ${interactive}

  ${({ $selected, $interactive: clickable, theme }) =>
    $selected
      ? css`
          background: ${theme.colors.accentContainer};
          color: ${theme.colors.accentText};
          font-weight: 600;
        `
      : css`
          background: ${theme.colors.surfaceContainer};
          color: ${theme.colors.textSecondary};

          ${clickable &&
          css`
            &:hover {
              background: ${theme.colors.surfaceContainerHigh};
              color: ${theme.colors.textPrimary};
            }
          `}

          ${!clickable &&
          css`
            background: ${theme.colors.surfaceContainerLow};
            color: ${theme.colors.textSecondary};
          `}
        `}

  ${({ $interactive: clickable }) =>
    !clickable &&
    css`
      cursor: default;
      pointer-events: none;
    `}
`;

export function Chip({
  children,
  selected = false,
  size = 'md',
  as,
  onClick,
  interactive = true,
  ...props
}) {
  return (
    <StyledChip
      as={as}
      $selected={selected}
      $size={size}
      $interactive={interactive && (Boolean(onClick) || Boolean(as))}
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      {...props}
    >
      {children}
    </StyledChip>
  );
}
