import { Skeleton } from '@/shared/components/ui/skeleton'

/**
 * Layout-neutral placeholder: a heading, a toolbar row and one content panel.
 * Pages with a distinct shape should pass their own fallback instead of this one.
 */
const PageSkeleton = () => (
  <div className="flex w-full flex-1 flex-col gap-4" aria-busy="true" aria-live="polite">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Skeleton className="h-7 w-56 max-w-[60%]" />
      <Skeleton className="h-9 w-36" />
    </div>

    <div className="flex flex-wrap gap-3">
      <Skeleton className="h-9 w-full max-w-xs" />
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-9 w-40" />
    </div>

    <div className="flex flex-1 flex-col gap-3 rounded-xl bg-white p-4">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
)

export const RouteFallback = PageSkeleton

export default RouteFallback
