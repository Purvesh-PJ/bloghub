import styled from 'styled-components';

export const Avatar = styled.img`
  width: ${(p) => (p.$size ? `${p.$size}px` : p.theme.spacing(10))};
  height: ${(p) => (p.$size ? `${p.$size}px` : p.theme.spacing(10))};
  border-radius: 50%;
  object-fit: cover;
  border: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  background: ${(p) => p.theme.palette.grey[100]};
`;
