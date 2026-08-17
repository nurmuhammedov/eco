const SkeletonCard = ({ rows }: { rows: number }) => (
  <div className="mb-3 rounded-lg bg-blue-200">
    <div className="3xl:py-2.5 px-4 py-2">
      <div className="h-5 w-72 max-w-full rounded bg-blue-300/60" />
    </div>
    <div className="flex flex-col gap-1 rounded-b-lg bg-white px-4 py-3">
      {[...Array(rows)].map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-1 rounded-md px-2 py-2 odd:bg-neutral-50 md:grid-cols-2 md:items-center md:gap-4"
        >
          <div className="h-4 w-56 max-w-full rounded bg-gray-200" />
          <div className="h-4 w-40 max-w-full rounded bg-gray-200" />
        </div>
      ))}
    </div>
  </div>
)

export const AppealDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between gap-2">
        <div className="h-7 w-64 max-w-full rounded bg-gray-200" />
        <div className="ml-auto flex items-center gap-2">
          <div className="h-9 w-32 rounded-md bg-gray-200" />
          <div className="h-9 w-40 rounded-md bg-gray-200" />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2">
        <SkeletonCard rows={8} />
        <SkeletonCard rows={5} />

        <div className="mb-3 rounded-lg bg-blue-200">
          <div className="3xl:py-2.5 px-4 py-2">
            <div className="h-5 w-96 max-w-full rounded bg-blue-300/60" />
          </div>
          <div className="rounded-b-lg bg-white px-4 py-3">
            <div className="mb-3 flex w-fit gap-2 rounded-md bg-[#EDEEEE] p-1">
              <div className="h-8 w-28 rounded bg-gray-200" />
              <div className="h-8 w-36 rounded bg-gray-200" />
              <div className="h-8 w-32 rounded bg-gray-200" />
            </div>
            <div className="flex flex-col gap-1">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-9 w-full rounded bg-gray-200 odd:bg-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
