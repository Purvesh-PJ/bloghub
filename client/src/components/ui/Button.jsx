import styled, { css } from 'styled-components';
import { Spinner } from './Spinner';
import { text, interactive } from '../../styles/theme/mixins';

/**
 * Button — pill-shaped by default.
 *
 * Variants are tonal rather than outlined: `secondary` and `tonal` sit on a container tone
 * with no border at all, which is what keeps the interface soft. Borders appear only on
 * `outline`, for the rare case where a control must read as a boundary.
 */

const variants = {
  /** The single most important action on a view. */
  primary: css`
    background: ${({ theme }) => theme.colors.accentSolid};
    color: ${({ theme }) => theme.colors.textOnAccent};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accentSolidHover};
    }
  `,
  /** Neutral container — the default for anything that is not the primary action. */
  secondary: css`
    background: ${({ theme }) => theme.colors.surfaceContainerHigh};
    color: ${({ theme }) => theme.colors.textPrimary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceContainerHighest};
    }
  `,
  /** Accent-tinted container — a secondary action that still belongs to the brand. */
  tonal: css`
    background: ${({ theme }) => theme.colors.accentContainer};
    color: ${({ theme }) => theme.colors.accentText};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accentContainerHover};
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.lineDefault};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceHover};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.lineStrong};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceHover};
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.dangerSolid};
    color: ${({ theme }) => theme.colors.textOnAccent};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.dangerSolidHover};
    }
  `,
  /** Destructive, but quiet until hovered. */
  dangerTonal: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.dangerText};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.dangerContainer};
    }
  `,
};

const sizes = {
  sm: css`
    height: 34px;
    padding: 0 ${({ theme }) => theme.spacing.lg};
    ${text('sm', 'medium')}
  `,
  md: css`
    height: 42px;
    padding: 0 ${({ theme }) => theme.spacing.xl};
    ${text('md', 'medium')}
  `,
  lg: css`
    height: 52px;
    padding: 0 ${({ theme }) => theme.spacing['2xl']};
    ${text('lg', 'medium')}
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;

  line-height: 1;
  white-space: nowrap;
  user-select: none;
  text-decoration: none;

  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${interactive}
  ${({ $variant }) => variants[$variant] ?? variants.primary}
  ${({ $size }) => sizes[$size] ?? sizes.md}

  /* A very small lift on press reads as physical without being cartoonish. */
  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  svg {
    width: 1.15em;
    height: 1.15em;
    flex-shrink: 0;
  }
`;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && <Spinner size="1em" />}
      {children}
    </StyledButton>
  );
}

/** Square-ish icon-only button. Same variants, circular. */
const StyledIconButton = styled(StyledButton)`
  padding: 0;
  aspect-ratio: 1;
  width: ${({ $size, theme }) => ({ sm: '34px', md: '42px', lg: '52px' })[$size] ?? '42px'};
  border-radius: ${({ theme }) => theme.radii.full};
`;

export function IconButton({ children, variant = 'ghost', size = 'md', label, ...props }) {
  return (
    <StyledIconButton $variant={variant} $size={size} aria-label={label} title={label} {...props}>
      {children}
    </StyledIconButton>
  );
}
