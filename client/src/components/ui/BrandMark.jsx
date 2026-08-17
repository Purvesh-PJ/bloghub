import styled from 'styled-components';

/**
 * The BlogHub logo mark — the rounded brand square with a B in it.
 *
 * It was declared four times, once each in Header, Footer, WorkspaceLayout and AdminLayout,
 * as four separate `const Mark = styled.span` blocks with the same gradient, the same radius
 * and slightly different sizes. Four copies of a logo is four places to change it and four
 * chances for them to drift, which they already had.
 */

const SIZES = {
  sm: { box: '24px', font: '12px' },
  md: { box: '28px', font: '14px' },
  lg: { box: '32px', font: '16px' },
};

const Mark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: ${({ $size }) => SIZES[$size].box};
  height: ${({ $size }) => SIZES[$size].box};
  border-radius: ${({ theme }) => theme.radii.sm};

  background: ${({ theme }) => theme.gradients.brand};
  /* Derived rather than assumed white — the accent's bright end cannot carry white text. */
  color: ${({ theme }) => theme.colors.textOnAccent};
  font-size: ${({ $size }) => SIZES[$size].font};
  font-weight: 800;
  line-height: 1;
  box-shadow: ${({ theme }) => theme.elevation.sm};
`;

/**
 * @param {object} props
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.letter]
 */
export function BrandMark({ size = 'md', letter = 'B', ...rest }) {
  return (
    // The wordmark beside it carries the name, so this is decoration to a screen reader.
    <Mark $size={size} aria-hidden="true" {...rest}>
      {letter}
    </Mark>
  );
}
