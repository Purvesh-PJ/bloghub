import styled from 'styled-components';

const AvatarWrapper = styled.div`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $size }) => Math.max(10, $size * 0.4)}px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export function Avatar({ src, fallback, size = 'md', ...props }) {
  const sizeMap = {
    xs: 20,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
    '1': 24,
    '2': 32,
    '3': 40,
  };
  
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 32;
  
  return (
    <AvatarWrapper $size={pixelSize} {...props}>
      {src ? <img src={src} alt={fallback || ''} /> : fallback}
    </AvatarWrapper>
  );
}
