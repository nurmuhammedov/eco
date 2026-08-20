import { Skeleton } from '@/shared/components/ui/skeleton'

/** Mirrors the dashboard layout: tab strip, stat card grid, two panels and a document block. */
export const DashboardSkeleton = () => (
  <div className="w-full bg-slate-50/50 pb-4" aria-busy="true" aria-live="polite">
    <div className="w-full rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-6 flex gap-1 rounded-lg bg-slate-100 p-1 md:w-fit">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-28" />
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Skeleton className="h-72 rounded-xl lg:col-span-12 xl:col-span-6" />
        <Skeleton className="h-72 rounded-xl lg:col-span-12 xl:col-span-6" />
      </div>

      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  </div>
)

export default DashboardSkeleton
