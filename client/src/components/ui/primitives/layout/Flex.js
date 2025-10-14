import styled from 'styled-components';

/**
 * Flex - Flexbox layout primitive with responsive gap adjustments
 * 
 * @example
 * <Flex $direction="column" $gap={4} $align="center">
 *   <Item1 />
 *   <Item2 />
 * </Flex>
 */
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

export default Flex;