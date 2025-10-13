import styled from 'styled-components';

const base = (p) => `
  margin: 0;
  color: inherit;
  line-height: ${p.theme.typography.lineHeight.tight};
  font-weight: ${p.theme.typography.weight.bold};
  font-family: ${p.theme.typography.fontFamily.heading};
`;

export const H1 = styled.h1`
  ${(p) => base(p)}
  font-size: ${(p) => p.theme.typography.size.h1};
`;
export const H2 = styled.h2`
  ${(p) => base(p)}
  font-size: ${(p) => p.theme.typography.size.h2};
`;
export const H3 = styled.h3`
  ${(p) => base(p)}
  font-size: ${(p) => p.theme.typography.size.h3};
`;
export const H4 = styled.h4`
  ${(p) => base(p)}
  font-size: ${(p) => p.theme.typography.size.xl};
`;
export const H5 = styled.h5`
  ${(p) => base(p)}
  font-size: ${(p) => p.theme.typography.size.lg};
`;
export const H6 = styled.h6`
  ${(p) => base(p)}
  font-size: ${(p) => p.theme.typography.size.md};
`;
