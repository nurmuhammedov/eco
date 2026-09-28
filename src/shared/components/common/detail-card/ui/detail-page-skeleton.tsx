import { Skeleton } from '@/shared/components/ui/skeleton'

interface DetailPageSkeletonProps {
  sections?: number
}

/** Placeholder for a detail page: its title and the accordion sections under it */
export const DetailPageSkeleton = ({ sections = 3 }: DetailPageSkeletonProps) => (
  <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
    <div className="flex items-center gap-3">
      <Skeleton className="size-9 rounded-full" />
      <Skeleton className="h-7 w-72 max-w-[70%]" />
    </div>
    <div className="flex flex-col gap-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      {Array.from({ length: Math.max(sections - 1, 0) }, (_, index) => (
        <Skeleton key={index} className="h-11 w-full rounded-lg" />
      ))}
    </div>
  </div>
)
