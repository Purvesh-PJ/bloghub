import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Loader = styled.div`
  width: ${(p) => (p.$size ? `${p.$size}px` : p.theme.spacing(5))};
  height: ${(p) => (p.$size ? `${p.$size}px` : p.theme.spacing(5))};
  border: 2px solid ${(p) => p.$track || p.theme.palette.grey[200]};
  border-top-color: ${(p) => p.$indicator || p.theme.palette.primary.main};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;
