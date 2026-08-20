import { createPortal } from 'react-dom'
import { Skeleton } from '@/shared/components/ui/skeleton'

// Pure CSS animation: no timers, no re-renders.
const TopProgressBar = () =>
  createPortal(
    <div role="progressbar" aria-label="Sahifa yuklanmoqda" className="fixed inset-x-0 top-0 z-[100] h-0.5">
      <div className="bg-teal animate-route-progress h-full origin-left" />
    </div>,
    document.body
  )

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

    <div className="flex flex-col gap-2 rounded-lg bg-white p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-11 w-full" />
      ))}
    </div>
  </div>
)

// Suspense fallback for lazy routes: the sidebar and header stay put, only the content area swaps.
export const RouteFallback = () => (
  <>
    <TopProgressBar />
    <PageSkeleton />
  </>
)

export default RouteFallback
