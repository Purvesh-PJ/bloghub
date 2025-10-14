import styled from 'styled-components';
import breakpoints from '../../common/theme/breakpoints';

/**
 * Grid - CSS Grid layout primitive with responsive columns
 * 
 * @example
 * <Grid $cols="repeat(3, 1fr)" $gap={4} $colsSm="1fr">
 *   <Item1 />
 *   <Item2 />
 *   <Item3 />
 * </Grid>
 */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${(p) => p.$cols || 'repeat(12, 1fr)'};
  gap: ${(p) =>
    typeof p.$gap === 'number' ? p.theme.spacing(p.$gap) : p.$gap || p.theme.spacing(4)};
  transition: ${(p) =>
    p.$animate
      ? `all ${p.theme.motion.duration.normal} ${p.theme.motion.easing.standard}`
      : 'none'};

  /* Responsive grid */
  @media (max-width: ${breakpoints.desktop}) {
    grid-template-columns: ${(p) => p.$colsMd || p.$cols || 'repeat(6, 1fr)'};
  }

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: ${(p) => p.$colsSm || 'repeat(4, 1fr)'};
    gap: ${(p) =>
      typeof p.$gap === 'number' ? p.theme.spacing(Math.max(2, p.$gap - 1)) : p.theme.spacing(3)};
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: ${(p) => p.$colsXs || '1fr'};
  }
`;

export default Grid;