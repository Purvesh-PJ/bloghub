import { css } from 'styled-components';

/**
 * Type mixins.
 *
 * One call sets size, leading, tracking and weight together, so a heading can never end up
 * with the right size and the wrong tracking. Use these instead of reaching for
 * `theme.fontSizes.*` — that flat API exists only for the pages not yet migrated.
 *
 *   const Title = styled.h1`
 *     ${display('lg')}
 *     color: ${({ theme }) => theme.colors.textPrimary};
 *   `;
 */

export const display = (size = 'md') => css`
  font-family: ${({ theme }) => theme.fonts?.display || 'sans-serif'};
  font-size: ${({ theme }) => theme.display?.[size]?.[0] || theme.display?.md?.[0] || '1.5rem'};
  line-height: ${({ theme }) => theme.display?.[size]?.[1] || theme.display?.md?.[1] || '1.3'};
  letter-spacing: ${({ theme }) => theme.display?.[size]?.[2] || theme.display?.md?.[2] || '-0.02em'};
  font-weight: ${({ theme }) => theme.display?.[size]?.[3] || theme.display?.md?.[3] || 700};
`;

export const text = (size = 'md', weight) => css`
  font-family: ${({ theme }) => theme.fonts?.ui || 'sans-serif'};
  font-size: ${({ theme }) => theme.text?.[size]?.[0] || theme.text?.md?.[0] || '1rem'};
  line-height: ${({ theme }) => theme.text?.[size]?.[1] || theme.text?.md?.[1] || '1.5'};
  ${weight &&
  css`
    font-weight: ${({ theme }) => theme.weights?.[weight] || 500};
  `}
`;

/** Uppercase eyebrow — section kickers, table headers, stat captions. */
export const label = (size = 'md') => css`
  font-family: ${({ theme }) => theme.fonts?.ui || 'sans-serif'};
  font-size: ${({ theme }) => theme.label?.[size]?.[0] || theme.label?.sm?.[0] || '0.75rem'};
  line-height: ${({ theme }) => theme.label?.[size]?.[1] || theme.label?.sm?.[1] || '1.2'};
  letter-spacing: ${({ theme }) => theme.tracking?.caps || '0.08em'};
  font-weight: ${({ theme }) => theme.weights?.semibold || 600};
  text-transform: uppercase;
`;

/** Truncate to a fixed number of lines. */
export const clamp = (lines) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/** Below this breakpoint. `media.down('md')` */
export const media = {
  down:
    (bp) =>
    (...args) => css`
      @media (max-width: ${({ theme }) => theme.breakpoints[bp]}) {
        ${css(...args)}
      }
    `,
  up:
    (bp) =>
    (...args) => css`
      @media (min-width: ${({ theme }) => theme.breakpoints[bp]}) {
        ${css(...args)}
      }
    `,
};

/** Standard interactive transition. */
export const interactive = css`
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};
`;
