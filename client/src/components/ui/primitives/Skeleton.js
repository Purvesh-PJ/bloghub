import styled, { keyframes, css } from 'styled-components';

// Shimmer animation
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Base skeleton styles
const baseStyles = css`
  background: ${({ theme }) => theme.palette.grey[200]};
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.palette.grey[200]} 0px,
    ${({ theme }) => theme.palette.grey[100]} 40px,
    ${({ theme }) => theme.palette.grey[200]} 80px
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: ${({ theme }) => theme.radii.md};

  ${({ $animate }) =>
    !$animate &&
    css`
      animation: none;
      background-image: none;
    `}
`;

// Base Skeleton component
export const Skeleton = styled.div`
  ${baseStyles};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height, theme }) =>
    typeof $height === 'number' ? `${$height}px` : $height || theme.spacing(5)};
  border-radius: ${({ $radius, theme }) =>
    $radius ? theme.radii[$radius] || $radius : theme.radii.md};
`;

// Skeleton Text - multiple lines
export const SkeletonText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const SkeletonLine = styled.div`
  ${baseStyles};
  height: ${({ theme }) => theme.spacing(4)};
  width: ${({ $width }) => $width || '100%'};

  &:last-child {
    width: ${({ $lastWidth }) => $lastWidth || '80%'};
  }
`;

// Skeleton Circle - for avatars
export const SkeletonCircle = styled.div`
  ${baseStyles};
  width: ${({ $size, theme }) =>
    typeof $size === 'number' ? `${$size}px` : $size || theme.spacing(10)};
  height: ${({ $size, theme }) =>
    typeof $size === 'number' ? `${$size}px` : $size || theme.spacing(10)};
  border-radius: 50%;
  flex-shrink: 0;
`;

// Skeleton Card - common card structure
export const SkeletonCard = styled.div`
  ${baseStyles};
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radii.xl};
`;

// Helper to create text lines
Skeleton.Text = ({ $lines = 3, $lastWidth = '60%', ...props }) => (
  <SkeletonText {...props}>
    {Array.from({ length: $lines }).map((_, i) => (
      <SkeletonLine
        key={i}
        $width={i === $lines - 1 ? $lastWidth : '100%'}
        $lastWidth={$lastWidth}
      />
    ))}
  </SkeletonText>
);

Skeleton.Circle = SkeletonCircle;
Skeleton.Card = SkeletonCard;
Skeleton.Line = SkeletonLine;

export default Skeleton;
