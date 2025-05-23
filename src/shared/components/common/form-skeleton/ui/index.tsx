import { Skeleton } from '@/shared/components/ui/skeleton.tsx';

interface FormSkeletonProps {
  length: number;
}

export default function FormSkeleton({ length }: FormSkeletonProps) {
  return Array.from({ length }).map((_, index) => (
    <div key={index} className="space-y-1.5">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-9 w-full" />
    </div>
  ));
}
