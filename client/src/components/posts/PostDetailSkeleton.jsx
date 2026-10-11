import { PageShell } from '../layout/PageShell';
import { Skeleton, SkeletonText } from '../ui/Skeleton';

export function PostDetailSkeleton() {
  return (
    <PageShell width="reading" aria-hidden="true">
      <Skeleton className="w-full aspect-video max-h-[420px] rounded-[28px] mb-8" />

      <div className="flex flex-col gap-4 mb-8">
        <Skeleton variant="pill" width={90} height={28} />
        <SkeletonText lines={2} lineHeight="34px" lastLineWidth="70%" gap="sm" />

        <div className="flex items-center gap-3">
          <Skeleton variant="circle" width={48} height={48} />
          <div className="flex flex-col gap-1.5">
            <Skeleton width={140} height={16} className="rounded" />
            <Skeleton width={180} height={13} className="rounded" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <SkeletonText lines={4} lineHeight="18px" lastLineWidth="80%" gap="md" />
        <SkeletonText lines={5} lineHeight="18px" lastLineWidth="65%" gap="md" />
        <SkeletonText lines={3} lineHeight="18px" lastLineWidth="90%" gap="md" />
      </div>
    </PageShell>
  );
}
