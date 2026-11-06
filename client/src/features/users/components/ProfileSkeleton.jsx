import { PageShell, Section } from '../../../components/layout/PageShell';
import { Skeleton, SkeletonText } from '../../../components/ui';
import { PostCardSkeleton } from '../../posts';

export function ProfileSkeleton() {
  return (
    <PageShell>
      <header className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8" aria-hidden="true">
        <Skeleton variant="circle" width={96} height={96} />
        <div className="flex-1 min-w-0 flex flex-col gap-3 w-full">
          <Skeleton width={180} height={28} className="rounded" />
          <SkeletonText lines={2} lineHeight="14px" lastLineWidth="70%" gap="xs" />
          <div className="flex gap-6 mt-2">
            <Skeleton width={60} height={20} className="rounded" />
            <Skeleton width={60} height={20} className="rounded" />
            <Skeleton width={60} height={20} className="rounded" />
          </div>
        </div>
      </header>
      <Section title="Stories">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <PostCardSkeleton key={i} layout="stacked" />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

