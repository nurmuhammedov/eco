import { Skeleton } from '@/shared/components/ui/skeleton'

/** Mirrors the dashboard layout so nothing shifts once the data arrives. */
export const DashboardSkeleton = () => (
  <div className="w-full pb-4" aria-busy="true">
    {/* aria-busy alone has nothing to announce, so the state is stated once. */}
    <p role="status" className="sr-only">
      Bosh sahifa ma’lumotlari yuklanmoqda
    </p>

    <div className="w-full space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex w-fit gap-1 rounded-lg bg-slate-100 p-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-24" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>

      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  </div>
)

export default DashboardSkeleton
