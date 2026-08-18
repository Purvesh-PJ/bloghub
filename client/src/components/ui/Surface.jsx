import styled, { css } from 'styled-components';

/**
 * Surface — the one container primitive.
 *
 * Every panel, card and well in the application is a Surface with a tone. Depth comes from
 * tone, not from borders; elevation is opt-in and reserved for things that genuinely float.
 * This replaces the ~40 near-identical `styled.div` cards that were scattered across pages.
 */

const tones = {
  /** Sits directly on the page — the default card. */
  low: css`
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
  `,
  /** One tone up — nested panels, list rows, wells. */
  base: css`
    background: ${({ theme }) => theme.colors.surfaceContainer};
  `,
  /** Two tones up — inputs, selected states, inset areas. */
  high: css`
    background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  `,
  /** Accent-tinted — feature panels, highlighted cards. */
  accent: css`
    background: ${({ theme }) => theme.colors.accentContainer};
  `,
  /** Floats above the page — menus, dialogs, sheets. */
  elevated: css`
    background: ${({ theme }) => theme.colors.surfaceElevated};
    box-shadow: ${({ theme }) => theme.elevation.lg};
  `,
  /** No background at all — for grouping without a visual container. */
  transparent: css`
    background: transparent;
  `,
};

const variants = {
  /** Featured spotlight surface with subtle accent glow */
  featured: css`
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border: 1px solid ${({ theme }) => theme.colors.accentLine};
    box-shadow:
      0 8px 30px -4px rgba(14, 165, 233, 0.12),
      0 2px 8px -2px rgba(15, 23, 42, 0.04);
  `,
  /** Clean floating elevated surface */
  elevated: css`
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border: none;
    box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);
  `,
  /** Minimal seamless surface with no background box */
  ghost: css`
    background: transparent;
    border: none;
    box-shadow: none;
  `,
  /** Inset sunken well */
  inset: css`
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
    border: none;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
  `,
};

export const Surface = styled.div`
  border-radius: ${({ theme, $radius }) => theme.radii[$radius]};
  padding: ${({ theme, $padding }) => ($padding === 'none' ? '0' : theme.spacing[$padding])};

  ${({ $tone }) => tones[$tone] ?? tones.low}
  ${({ $variant }) => $variant && variants[$variant]}

  ${({ $bordered, theme }) =>
    $bordered &&
    css`
      box-shadow: inset 0 0 0 1px ${theme.colors.lineSubtle};
    `}

  ${({ $elevation, theme }) =>
    $elevation &&
    css`
      box-shadow: ${theme.elevation[$elevation]};
    `}

  ${({ $interactive, theme }) =>
    $interactive &&
    css`
      cursor: pointer;
      transition:
        background ${theme.transitions.fast},
        transform ${theme.transitions.fast},
        box-shadow ${theme.transitions.fast};

      &:hover {
        background: ${theme.colors.surfaceContainerHigh};
        transform: translateY(-2px);
        box-shadow: ${theme.elevation.md};
      }
    `}
`;

Surface.defaultProps = {
  $tone: 'low',
  $radius: 'lg',
  $padding: 'xl',
};

/**
 * Card — a Surface with the conventional card geometry. Most callers want this.
 *
 * Supports `variant` ('elevated', 'featured', 'ghost', 'inset') and traditional `tone`.
 */
export function Card({
  children,
  variant,
  tone = 'low',
  radius = 'xl',
  padding = 'xl',
  bordered = false,
  elevation,
  interactive = false,
  ...props
}) {
  return (
    <Surface
      $variant={variant}
      $tone={tone}
      $radius={radius}
      $padding={padding}
      $bordered={bordered}
      $elevation={elevation}
      $interactive={interactive}
      {...props}
    >
      {children}
    </Surface>
  );
}
