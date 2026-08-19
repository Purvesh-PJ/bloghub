import styled, { css } from 'styled-components';
import { media } from '../../styles/theme/mixins';
import { Skeleton, SkeletonText } from '../ui/Skeleton';

const cardVariants = {
  elevated: css`
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
    box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
  `,
  featured: css`
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
    box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.06);
  `,
  ghost: css`
    background: transparent;
    border: 1px solid transparent;
    box-shadow: none;
    border-radius: ${({ theme }) => theme.radii.lg};
  `,
  inset: css`
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
    border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  `,
};

const Card = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};

  ${({ $variant }) => cardVariants[$variant] ?? cardVariants.elevated}

  ${({ $layout, $hasThumb = true }) =>
    $layout === 'stacked' || !$hasThumb
      ? css`
          grid-template-columns: 1fr;
          align-items: start;
        `
      : css`
          grid-template-columns: 200px 1fr;
          align-items: center;

          ${media.down('md')`
            grid-template-columns: 160px 1fr;
          `}

          ${media.down('sm')`
            grid-template-columns: 1fr;
            gap: ${({ theme }) => theme.spacing.md};
          `}
        `}
`;

const Body = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const HashtagsSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const Thumb = styled(Skeleton)`
  width: 100%;
  aspect-ratio: 16 / 10;
  max-height: 135px;
  border-radius: ${({ theme }) => theme.radii.lg};

  ${({ $layout }) =>
    $layout === 'stacked' &&
    css`
      aspect-ratio: 16 / 9;
      max-height: unset;
    `}
`;

export function PostCardSkeleton({ layout = 'row', hasThumb = true, variant = 'elevated' }) {
  return (
    <Card $layout={layout} $hasThumb={hasThumb} $variant={variant} aria-hidden="true">
      {hasThumb && <Thumb $layout={layout} $radius="lg" />}

      <Body>
        {/* 1. Title Skeleton First */}
        <SkeletonText lines={2} lineHeight="22px" lastLineWidth="75%" gap="xs" />

        {/* 2. Author Profile Meta */}
        <Meta>
          <Skeleton $variant="circle" $width={24} $height={24} />
          <Skeleton $width={90} $height={14} $radius="xs" />
          <Skeleton $width={60} $height={14} $radius="xs" />
          <Skeleton $width={70} $height={14} $radius="xs" />
        </Meta>

        {/* 3. Excerpt */}
        <SkeletonText lines={2} lineHeight="14px" lastLineWidth="90%" gap="xs" />

        {/* 4. Hashtags directly below description */}
        <HashtagsSkeleton>
          <Skeleton $width={50} $height={14} $radius="xs" />
          <Skeleton $width={60} $height={14} $radius="xs" />
        </HashtagsSkeleton>
      </Body>
    </Card>
  );
}

export function PostCardCompactSkeleton() {
  return (
    <div
      style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0' }}
      aria-hidden="true"
    >
      <Skeleton $width={24} $height={16} $radius="xs" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton $width="85%" $height={14} $radius="xs" />
        <Skeleton $width="45%" $height={12} $radius="xs" />
      </div>
    </div>
  );
}
