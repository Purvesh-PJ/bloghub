import styled from 'styled-components';

const weights = (t) => t.typography.weight;

export const Text = styled.p`
  margin: 0;
  color: ${(p) => p.$color || p.theme.palette.text.primary};
  font-size: ${(p) => p.$size || p.theme.typography.size.md};
  font-weight: ${(p) =>
    p.$weight ? weights(p.theme)[p.$weight] : p.theme.typography.weight.regular};
  line-height: ${(p) => p.$lh || p.theme.typography.lineHeight.relaxed};
`;

export const Muted = styled(Text)`
  color: ${(p) => p.theme.palette.text.muted || p.theme.palette.grey[500]};
`;

export const LinkText = styled(Text).attrs({ as: 'a' })`
  color: ${(p) => p.theme.palette.primary.main};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
