import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const StyledSpinner = styled.div`
  width: ${({ $size }) => $size || '20px'};
  height: ${({ $size }) => $size || '20px'};
  border: 2px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-top-color: ${({ $color, theme }) => $color || theme.colors?.accentPrimary || '#6366f1'};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  display: inline-block;
`;

export function Spinner({ size = '20px', color, ...props }) {
  return <StyledSpinner $size={size} $color={color} {...props} />;
}
