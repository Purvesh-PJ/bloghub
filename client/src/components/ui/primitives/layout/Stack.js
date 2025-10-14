import styled from 'styled-components';

/**
 * Stack - Vertical flexbox layout primitive with responsive gap adjustments
 * 
 * @example
 * <Stack $gap={6} $responsiveGap>
 *   <Item1 />
 *   <Item2 />
 *   <Item3 />
 * </Stack>
 */
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

export default Stack;