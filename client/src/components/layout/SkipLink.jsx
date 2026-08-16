import styled from 'styled-components';

/**
 * Lets a keyboard user jump past the header straight to the page content.
 *
 * Hidden until focused, which is the point: it is the first thing in the tab order, so
 * without it every page begins with a walk through the whole navigation bar.
 */
const Link = styled.a`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: ${({ theme }) => theme.spacing.md};
  z-index: 1000;

  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radii.md};

  background-color: ${({ theme }) => theme.colors.accentSolid};
  color: ${({ theme }) => theme.colors.textOnAccent};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  text-decoration: none;

  /*
    Moved out of view rather than display:none — a hidden element cannot receive focus, so
    display:none would make the link unreachable and defeat the purpose.
  */
  transform: translateY(calc(-100% - ${({ theme }) => theme.spacing.lg}));
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:focus-visible {
    transform: translateY(0);
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

export function SkipLink({ targetId = 'main-content' }) {
  return <Link href={`#${targetId}`}>Skip to content</Link>;
}
