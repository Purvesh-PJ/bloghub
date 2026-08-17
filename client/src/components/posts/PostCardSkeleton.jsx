import styled, { css } from 'styled-components';
import { media } from '../../styles/theme/mixins';
import { Skeleton, SkeletonText } from '../ui/Skeleton';

const Card = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);

  ${({ $layout }) =>
    $layout === 'stacked'
      ? css`
          grid-template-columns: 1fr;
          gap: ${({ theme }) => theme.spacing.lg};
        `
      : css`
          grid-template-columns: 1fr auto;

          ${media.down('sm')`
            grid-template-columns: 1fr;
            gap: ${({ theme }) => theme.spacing.lg};
          `}
        `}
`;

const Body = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
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
  ${({ $layout }) =>
    $layout === 'stacked'
      ? css`
          width: 100%;
          aspect-ratio: 16 / 9;
          height: auto;
          order: -1;
        `
      : css`
          width: 200px;
          aspect-ratio: 4 / 3;
          height: auto;

          ${media.down('sm')`
            width: 100%;
            aspect-ratio: 16 / 9;
            order: -1;
          `}
        `}
`;

export function PostCardSkeleton({ layout = 'row' }) {
  return (
    <Card $layout={layout} aria-hidden="true">
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

      <Thumb $layout={layout} $radius="lg" />
    </Card>
  );
}

export function PostCardCompactSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0' }} aria-hidden="true">
      <Skeleton $width={24} $height={16} $radius="xs" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton $width="85%" $height={14} $radius="xs" />
        <Skeleton $width="45%" $height={12} $radius="xs" />
      </div>
    </div>
  );
}
