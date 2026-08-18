import styled, { css } from 'styled-components';
import { media } from '../../styles/theme/mixins';
import { Skeleton, SkeletonText } from '../ui/Skeleton';

const cardVariants = {
  elevated: css`
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border: none;
    box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
  `,
  featured: css`
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border: none;
    box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.06);
  `,
  ghost: css`
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: ${({ theme }) => theme.radii.md};
  `,
  inset: css`
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
    border: none;
  `,
};

const Card = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};

  ${({ $variant }) => cardVariants[$variant] ?? cardVariants.elevated}

  ${({ $layout, $hasThumb = true }) =>
    $layout === 'stacked' || !$hasThumb
      ? css`
          grid-template-columns: 1fr;
          gap: ${({ theme }) => theme.spacing.md};
          padding: ${({ theme }) => theme.spacing.md};
        `
      : css`
          grid-template-columns: 210px 1fr;
          align-items: stretch;

          ${media.down('md')`
            grid-template-columns: 170px 1fr;
          `}

          ${media.down('sm')`
            grid-template-columns: 1fr;
            gap: ${({ theme }) => theme.spacing.md};
            padding: ${({ theme }) => theme.spacing.md};
          `}
        `}
`;

const Body = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Thumb = styled(Skeleton)`
  width: 100%;
  height: 100%;
  min-height: 130px;
  aspect-ratio: 16 / 10;
  border-radius: ${({ theme }) => theme.radii.md};

  ${({ $layout }) =>
    $layout === 'stacked' &&
    css`
      aspect-ratio: 16 / 9;
      min-height: unset;
    `}
`;

export function PostCardSkeleton({ layout = 'row', hasThumb = true, variant = 'elevated' }) {
  return (
    <Card $layout={layout} $hasThumb={hasThumb} $variant={variant} aria-hidden="true">
      {hasThumb && <Thumb $layout={layout} $radius="md" />}

      <Body>
        <Meta>
          <Skeleton $variant="circle" $width={24} $height={24} />
          <Skeleton $width={90} $height={14} $radius="xs" />
          <Skeleton $width={60} $height={14} $radius="xs" />
          <Skeleton $width={70} $height={14} $radius="xs" />
        </Meta>

        <SkeletonText lines={2} lineHeight="22px" lastLineWidth="75%" gap="xs" />
        <SkeletonText lines={2} lineHeight="14px" lastLineWidth="90%" gap="xs" />

        <Footer>
          <Skeleton $variant="pill" $width={75} $height={24} />
          <Skeleton $width={40} $height={14} $radius="xs" />
          <Skeleton $width={40} $height={14} $radius="xs" />
        </Footer>
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
