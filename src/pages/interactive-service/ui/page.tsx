import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MapPin, Shapes } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { PointsMap } from '@/features/dashboard/ui/points-map'
import { AVAILABLE_YEARS, CategoryId, MONTHS, categoryOf, defaultPeriodFor } from '../model/categories'
import { REGIONS_SORTED as REGIONS, regionNameById } from '../model/regions'
import { useCategoryData } from '../model/use-category-data'
import { CategoryRail } from './category-rail'
import { KioskHeader } from './kiosk-header'
import { MetricStrip } from './metric-strip'
import { RegionMap } from './region-map'

/** A wall display is never touched, so it refreshes itself. */
const REFRESH_MS = 90_000

const ACCENT = '#0b626b'
const ALL_REGIONS = 'ALL'

export const InteractiveServicePage = () => {
  const [category, setCategory] = useState<CategoryId>('hf')
  const [regionId, setRegionId] = useState<number | null>(null)
  // Where coordinates exist the pins are the better view; the shaded regions
  // stay a click away for reading the spread as figures.
  const [showRegions, setShowRegions] = useState(false)

  const [period, setPeriod] = useState(() => defaultPeriodFor('hf'))

  const meta = categoryOf(category)
  const queryClient = useQueryClient()

  const data = useCategoryData({
    category,
    regionId: regionId === null ? undefined : String(regionId),
    year: period.year,
    month: period.month,
  })

  useEffect(() => {
    const id = setInterval(() => queryClient.invalidateQueries(), REFRESH_MS)

    return () => clearInterval(id)
  }, [queryClient])

  // Risk analysis closes a quarter behind and inspections open on the current
  // one, so the period follows the section rather than carrying across it.
  useEffect(() => {
    setShowRegions(false)
    setRegionId(null)
    setPeriod(defaultPeriodFor(category))
  }, [category])

  const selectCategory = useCallback((id: CategoryId) => {
    setCategory(id)
    setRegionId(null)
    setShowRegions(false)
  }, [])

  const hasPins = meta.locationEndpoint !== undefined
  const onPins = hasPins && !showRegions

  const selectRegion = useCallback((id: number | null) => setRegionId(id), [])

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-slate-50 select-none">
      <KioskHeader subtitle={meta.subtitle} />

      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:flex-row lg:gap-4 lg:p-5">
        <CategoryRail active={category} onSelect={selectCategory} />

        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-4">
          <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
            {/* The section is what a passer-by needs first; the region is the
                filter applied to it, so it reads as the qualifier it is. */}
            <div className="absolute top-4 left-5 z-10 max-w-[45%]">
              <h2 className="flex flex-wrap items-baseline gap-x-2 text-lg font-semibold text-slate-800 lg:text-2xl">
                {meta.label}
                <span className="text-sm font-normal text-slate-400 lg:text-base">
                  · {regionNameById(regionId) ?? 'butun respublika'}
                </span>
              </h2>
            </div>

            <div className="absolute top-4 right-5 z-10 flex items-center gap-2">
              {/* Clicking a shape only works on the region view, so the pin view
                  needs its own way in - and both share the one control. */}
              <Select
                value={regionId === null ? ALL_REGIONS : String(regionId)}
                onValueChange={(value) => selectRegion(value === ALL_REGIONS ? null : Number(value))}
              >
                <SelectTrigger className="h-8 w-[172px] border-slate-200 bg-white !text-xs lg:h-9 lg:!text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_REGIONS}>Butun respublika</SelectItem>
                  {REGIONS.map((region) => (
                    <SelectItem key={region.id} value={String(region.id)}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {meta.periodFiltered && (
                <>
                  <Select
                    value={period.year}
                    onValueChange={(value) => setPeriod((current) => ({ ...current, year: value }))}
                  >
                    <SelectTrigger className="h-8 w-[86px] border-slate-200 bg-white !text-xs lg:h-9 lg:!text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_YEARS.map((item) => (
                        <SelectItem key={item} value={String(item)}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={period.month}
                    onValueChange={(value) => setPeriod((current) => ({ ...current, month: value }))}
                  >
                    <SelectTrigger className="h-8 w-[106px] border-slate-200 bg-white !text-xs lg:h-9 lg:!text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              {hasPins && (
                <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
                  {[
                    { pins: true, icon: MapPin, label: 'Obyektlar xaritasi' },
                    { pins: false, icon: Shapes, label: 'Hududlar kesimi' },
                  ].map((option) => {
                    const Icon = option.icon
                    const isOn = onPins === option.pins

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setShowRegions(!option.pins)}
                        aria-pressed={isOn}
                        className={cn(
                          'flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors lg:size-8',
                          isOn ? 'bg-teal text-white' : 'text-slate-400 hover:text-slate-600'
                        )}
                      >
                        <Icon className="size-4" />
                        <span className="sr-only">{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className={cn('h-full w-full pt-12 pb-2', onPins && 'overflow-hidden rounded-xl')}>
              {onPins ? (
                <PointsMap points={data.points} focusRegionId={regionId} />
              ) : (
                <RegionMap
                  counts={data.regionCounts}
                  activeRegionId={regionId}
                  onSelect={selectRegion}
                  accent={ACCENT}
                />
              )}
            </div>
          </section>

          <MetricStrip
            total={data.total}
            totalLabel={data.totalLabel}
            metrics={data.metrics}
            archived={data.archived}
            isLoading={data.isLoading}
          />
        </div>
      </main>
    </div>
  )
}
