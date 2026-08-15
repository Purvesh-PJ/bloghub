import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/**
 * Spinner.
 *
 * Draws itself in `currentColor` so it is legible on any surface — inside a solid primary
 * button, on a card, or on the page. The track is the same colour at low alpha rather than
 * a fixed border token, which previously made it invisible on coloured backgrounds.
 */
const StyledSpinner = styled.span`
  display: inline-block;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border: 2px solid currentColor;
  border-radius: 50%;
  opacity: 0.9;

  /* Hide one edge to create the arc. */
  border-right-color: transparent;

  animation: ${spin} 0.6s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.5s;
  }
`;

export function Spinner({ size = '20px', color, ...props }) {
  return (
    <StyledSpinner
      $size={size}
      style={color ? { color } : undefined}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}
