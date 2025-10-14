import styled from 'styled-components';
import breakpoints from '../../common/theme/breakpoints';

/**
 * Container - Centers content with max-width and responsive padding
 * 
 * @example
 * <Container $max="800px" $px={6}>
 *   <Content />
 * </Container>
 */
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

export default Container;