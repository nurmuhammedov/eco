import { useEffect, useState } from 'react'
import { Archive } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Metric } from '../model/use-category-data'

const format = (value: number) => value.toLocaleString('ru-RU').replace(/\s/g, ' ')

/** Counts up on arrival and on every change, so a refreshed figure is noticed. */
const AnimatedNumber = ({ value, className }: { value: number; className?: string }) => {
  const [shown, setShown] = useState(value)

  useEffect(() => {
    if (value === shown) return

    const from = shown
    const start = performance.now()
    let frame = 0

    const step = (now: number) => {
      const progress = Math.min((now - start) / 700, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setShown(Math.round(from + (value - from) * eased))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span className={className}>{format(shown)}</span>
}

const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-lg bg-slate-200/70', className)} />
)

interface MetricStripProps {
  total: number
  totalLabel: string
  metrics: Metric[]
  archived: number | null
  isLoading: boolean
}

export const MetricStrip = ({ total, totalLabel, metrics, archived, isLoading }: MetricStripProps) => (
  <div className="grid shrink-0 grid-cols-2 gap-2.5 lg:flex lg:gap-3">
    <div className="bg-teal relative col-span-2 flex flex-col justify-between overflow-hidden rounded-2xl p-4 lg:w-64 lg:p-5">
      <div aria-hidden className="absolute -right-8 -bottom-8 size-28 rounded-full bg-white/5" />
      <span className="text-[10px] tracking-[0.18em] text-white/60 uppercase">Jami</span>
      {isLoading ? (
        <Shimmer className="my-1 h-9 w-28 bg-white/20 lg:h-11" />
      ) : (
        <AnimatedNumber
          value={total}
          className="text-3xl font-light tracking-tight text-white tabular-nums lg:text-5xl"
        />
      )}
      <span className="truncate text-[10px] tracking-wide text-white/50 lg:text-xs">{totalLabel}</span>
    </div>

    {metrics.map((metric) => (
      <div
        key={metric.key}
        className="flex flex-1 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 lg:p-5"
      >
        <div className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ backgroundColor: metric.color }} />
          <span className="truncate text-[10px] tracking-wide text-slate-500 uppercase lg:text-[11px]">
            {metric.label}
          </span>
        </div>

        {isLoading ? (
          <Shimmer className="my-1 h-8 w-20 lg:h-10" />
        ) : (
          <AnimatedNumber
            value={metric.value}
            className="text-2xl font-light tracking-tight tabular-nums lg:text-4xl"
          />
        )}

        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${total > 0 ? Math.min(100, (metric.value / total) * 100) : 0}%`,
              backgroundColor: metric.color,
            }}
          />
        </div>
      </div>
    ))}

    {archived !== null && (
      <div className="flex flex-col justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 lg:w-40 lg:p-5">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Archive className="size-3.5 shrink-0" />
          <span className="truncate text-[10px] tracking-wide uppercase lg:text-[11px]">Arxivda</span>
        </div>
        {isLoading ? (
          <Shimmer className="my-1 h-8 w-16 lg:h-10" />
        ) : (
          <AnimatedNumber value={archived} className="text-2xl font-light text-slate-500 tabular-nums lg:text-4xl" />
        )}
        <span className="text-[10px] text-slate-400">Reyestrdan chiqarilgan</span>
      </div>
    )}
  </div>
)
