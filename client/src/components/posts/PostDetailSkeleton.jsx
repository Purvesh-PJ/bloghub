import styled from 'styled-components';
import { PageShell } from '../layout/PageShell';
import { Skeleton, SkeletonText } from '../ui/Skeleton';

const CoverSkeleton = styled(Skeleton)`
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 420px;
  border-radius: ${({ theme }) => theme.radii.xl};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const AuthorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

export function PostDetailSkeleton() {
  return (
    <PageShell $width="reading" aria-hidden="true">
      <CoverSkeleton $radius="xl" />

      <HeaderGroup>
        <Skeleton $variant="pill" $width={90} $height={28} />
        <SkeletonText lines={2} lineHeight="34px" lastLineWidth="70%" gap="sm" />

        <AuthorMeta>
          <Skeleton $variant="circle" $width={48} $height={48} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton $width={140} $height={16} $radius="xs" />
            <Skeleton $width={180} $height={13} $radius="xs" />
          </div>
        </AuthorMeta>
      </HeaderGroup>

      <ContentBlock>
        <SkeletonText lines={4} lineHeight="18px" lastLineWidth="80%" gap="md" />
        <SkeletonText lines={5} lineHeight="18px" lastLineWidth="65%" gap="md" />
        <SkeletonText lines={3} lineHeight="18px" lastLineWidth="90%" gap="md" />
      </ContentBlock>
    </PageShell>
  );
}
