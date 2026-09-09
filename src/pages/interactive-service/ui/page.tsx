import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MapPin, Pause, Play, Shapes } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { PointsMap } from '@/features/dashboard/ui/points-map'
import {
  AVAILABLE_YEARS,
  CATEGORIES,
  CategoryId,
  MONTHS,
  MONTH_LABELS,
  categoryOf,
  defaultPeriod,
} from '../model/categories'
import { regionNameById } from '../model/regions'
import { useCategoryData } from '../model/use-category-data'
import { CategoryRail } from './category-rail'
import { KioskHeader } from './kiosk-header'
import { MetricStrip } from './metric-strip'
import { RegionMap } from './region-map'

/** A wall display is never touched, so it refreshes and moves on by itself. */
const REFRESH_MS = 90_000
const ROTATE_MS = 25_000

const ACCENT = '#0b626b'

export const InteractiveServicePage = () => {
  const [category, setCategory] = useState<CategoryId>('hf')
  const [regionId, setRegionId] = useState<number | null>(null)
  const [rotating, setRotating] = useState(true)
  // Where coordinates exist the pins are the better view; the shaded regions
  // stay a click away for reading the spread as figures.
  const [showRegions, setShowRegions] = useState(false)

  const period = useMemo(defaultPeriod, [])
  const [year, setYear] = useState(period.year)
  const [month, setMonth] = useState<string>(period.month)

  const meta = categoryOf(category)
  const queryClient = useQueryClient()

  const data = useCategoryData({
    category,
    regionId: regionId === null ? undefined : String(regionId),
    year,
    month,
  })

  useEffect(() => {
    const id = setInterval(() => queryClient.invalidateQueries(), REFRESH_MS)

    return () => clearInterval(id)
  }, [queryClient])

  // The rotation moves the section on without going through selectCategory.
  useEffect(() => {
    setShowRegions(false)
    setRegionId(null)
  }, [category])

  useEffect(() => {
    if (!rotating) return

    const id = setInterval(() => {
      setCategory((current) => {
        const index = CATEGORIES.findIndex((item) => item.id === current)

        return CATEGORIES[(index + 1) % CATEGORIES.length].id
      })
    }, ROTATE_MS)

    return () => clearInterval(id)
  }, [rotating])

  // Picking a region or a section by hand means someone is standing at the
  // screen; carrying on rotating would pull the view out from under them.
  const selectCategory = useCallback((id: CategoryId) => {
    setRotating(false)
    setCategory(id)
    setRegionId(null)
    setShowRegions(false)
  }, [])

  const hasPins = meta.locationEndpoint !== undefined
  const onPins = hasPins && !showRegions

  const selectRegion = useCallback((id: number | null) => {
    setRotating(false)
    setRegionId(id)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-slate-50 select-none">
      <KioskHeader subtitle={meta.subtitle} regionName={regionNameById(regionId)} />

      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:flex-row lg:gap-4 lg:p-5">
        <CategoryRail active={category} onSelect={selectCategory} />

        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-4">
          <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
            <div className="absolute top-4 left-5 z-10 max-w-[45%]">
              <h2 className="text-lg font-semibold text-slate-800 lg:text-2xl">
                {regionNameById(regionId) ?? 'Respublika bo‘yicha'}
              </h2>
              <p className="mt-0.5 text-[10px] text-slate-400 lg:text-xs">
                {onPins
                  ? 'Ro‘yxatga olingan obyektlarning joylashuvi'
                  : data.regionCounts
                    ? 'Hudud rangi obyektlar soniga bog‘liq · tanlash uchun bosing'
                    : 'Bu bo‘lim uchun hududlar kesimi mavjud emas'}
              </p>
            </div>

            <div className="absolute top-4 right-5 z-10 flex items-center gap-2">
              {meta.periodFiltered && (
                <>
                  <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
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

                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="h-8 w-[106px] border-slate-200 bg-white !text-xs lg:h-9 lg:!text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((item, index) => (
                        <SelectItem key={item} value={item}>
                          {MONTH_LABELS[index]}
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
                        onClick={() => {
                          setRotating(false)
                          setShowRegions(!option.pins)
                        }}
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

              <button
                type="button"
                onClick={() => setRotating((current) => !current)}
                aria-pressed={rotating}
                className={cn(
                  'flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-colors lg:size-9',
                  rotating
                    ? 'border-teal/20 bg-teal/5 text-teal'
                    : 'border-slate-200 bg-white text-slate-400 hover:text-slate-600'
                )}
              >
                {rotating ? <Pause className="size-4" /> : <Play className="size-4" />}
                <span className="sr-only">{rotating ? 'Avtomatik almashishni to‘xtatish' : 'Avtomatik almashish'}</span>
              </button>
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
