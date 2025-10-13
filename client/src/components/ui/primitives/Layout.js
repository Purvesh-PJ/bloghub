import styled from 'styled-components';
import breakpoints from '../../common/theme/breakpoints';

export const Container = styled.div`
  width: 100%;
  max-width: ${(p) => p.$max || '1200px'};
  margin-left: auto;
  margin-right: auto;
  padding-left: ${(p) =>
    typeof p.$px === 'number' ? p.theme.spacing(p.$px) : p.$px || p.theme.spacing(4)};
  padding-right: ${(p) =>
    typeof p.$px === 'number' ? p.theme.spacing(p.$px) : p.$px || p.theme.spacing(4)};
  transition: padding ${(p) => p.theme.motion.duration.normal}
    ${(p) => p.theme.motion.easing.standard};

  @media (max-width: ${breakpoints.desktop}) {
    padding-left: ${(p) => p.theme.spacing(3)};
    padding-right: ${(p) => p.theme.spacing(3)};
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding-left: ${(p) => p.theme.spacing(2)};
    padding-right: ${(p) => p.theme.spacing(2)};
  }
`;

export const Flex = styled.div`
  display: flex;
  flex-direction: ${(p) => p.$direction || 'row'};
  align-items: ${(p) => p.$align || 'stretch'};
  justify-content: ${(p) => p.$justify || 'flex-start'};
  gap: ${(p) =>
    typeof p.$gap === 'number' ? p.theme.spacing(p.$gap) : p.$gap || p.theme.spacing(4)};
  flex-wrap: ${(p) => (p.$wrap ? 'wrap' : 'nowrap')};
  transition: ${(p) =>
    p.$animate
      ? `all ${p.theme.motion.duration.normal} ${p.theme.motion.easing.standard}`
      : 'none'};

  /* Responsive gap adjustments */
  ${(p) =>
    p.$responsiveGap &&
    `
    @media (max-width: 768px) {
      gap: ${typeof p.$gap === 'number' ? p.theme.spacing(Math.max(1, p.$gap - 2)) : p.theme.spacing(2)};
    }
  `}
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: ${(p) => p.$direction || 'column'};
  gap: ${(p) =>
    typeof p.$gap === 'number' ? p.theme.spacing(p.$gap) : p.$gap || p.theme.spacing(4)};
  transition: ${(p) =>
    p.$animate
      ? `all ${p.theme.motion.duration.normal} ${p.theme.motion.easing.standard}`
      : 'none'};

  /* Responsive gap adjustments */
  ${(p) =>
    p.$responsiveGap &&
    `
    @media (max-width: 768px) {
      gap: ${typeof p.$gap === 'number' ? p.theme.spacing(Math.max(1, p.$gap - 2)) : p.theme.spacing(2)};
    }
  `}
`;

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
