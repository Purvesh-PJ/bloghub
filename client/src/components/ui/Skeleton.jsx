import styled, { keyframes, css } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const shimmerBase = css`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceContainer} 0%,
    ${({ theme }) => theme.colors.surfaceContainerHigh} 50%,
    ${({ theme }) => theme.colors.surfaceContainer} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;
`;

export const Skeleton = styled.div`
  ${shimmerBase}
  width: ${({ $width }) => (typeof $width === 'number' ? `${$width}px` : $width || '100%')};
  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : $height || '1rem')};
  border-radius: ${({ $radius, theme }) =>
    $radius ? theme.radii[$radius] || $radius : theme.radii.md};
  flex-shrink: 0;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'circle':
        return css`
          border-radius: ${theme.radii.full};
        `;
      case 'pill':
        return css`
          border-radius: ${theme.radii.full};
        `;
      case 'card':
        return css`
          border-radius: ${theme.radii.xl};
          border: 1px solid ${theme.colors.lineSubtle};
        `;
      default:
        return '';
    }
  }}
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap, theme }) => ($gap ? theme.spacing[$gap] || $gap : theme.spacing.sm)};
  width: 100%;
`;

export function SkeletonText({ lines = 3, gap = 'sm', lineHeight = '14px', lastLineWidth = '60%' }) {
  return (
    <TextGroup $gap={gap}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLast = index === lines - 1;
        const width = isLast ? lastLineWidth : index % 2 === 1 ? '92%' : '100%';
        return (
          <Skeleton
            key={index}
            $width={width}
            $height={lineHeight}
            $radius="xs"
          />
        );
      })}
    </TextGroup>
  );
}
