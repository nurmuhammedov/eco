import { Check } from 'lucide-react'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { RegionStat, riskShare } from '../model/region-stats'

interface RegionStatsPanelProps {
  stats: RegionStat[]
  selected: string
  onSelect: (id: string) => void
  isLoading?: boolean
}

// Thousands are grouped with a non-breaking space so a count never wraps mid-number.
const format = (value: number) => value.toLocaleString('ru-RU').replace(/s/g, ' ')

/**
 * A stacked bar rather than four separate ones: what matters is the share of
 * the region that is high risk, and a share is easier to read against its own
 * whole than against a scale.
 */
const RiskBar = ({ stat }: { stat: RegionStat }) => (
  <span className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-neutral-100" aria-hidden>
    {riskShare(stat).map((slice) =>
      slice.count > 0 ? (
        <span key={slice.key} style={{ width: `${slice.percent}%`, backgroundColor: slice.color }} />
      ) : null
    )}
  </span>
)

/**
 * The permanent right-hand rail of the map. It answers the question the map
 * itself cannot - how the facilities are spread across the regions and how the
 * last risk analysis came out - and doubles as the region filter.
 */
export const RegionStatsPanel = ({ stats, selected, onSelect, isLoading }: RegionStatsPanelProps) => {
  const total = stats.reduce((sum, stat) => sum + stat.total, 0)

  return (
    <aside
      className="absolute top-4 right-4 bottom-4 z-10 hidden w-[19rem] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white/95 shadow-lg ring-1 ring-black/5 backdrop-blur-sm md:flex"
      aria-label="Hududlar kesimidagi ma’lumot"
    >
      <div className="flex shrink-0 items-baseline justify-between gap-2 px-4 pt-3.5 pb-3">
        <h3 className="text-[15px] font-semibold text-neutral-900">Hududlar kesimi</h3>
        <span className="text-xs text-neutral-500 tabular-nums">{format(total)} ta obyekt</span>
      </div>

      {selected && (
        <button
          type="button"
          onClick={() => onSelect('')}
          className="text-primary shrink-0 cursor-pointer border-t border-neutral-100 px-4 py-2 text-left text-xs font-medium transition-colors hover:bg-neutral-50"
        >
          Barcha hududlarni ko‘rsatish
        </button>
      )}

      <ul className="min-h-0 flex-1 divide-y divide-neutral-100 overflow-y-auto border-t border-neutral-100">
        {isLoading
          ? [0, 1, 2, 3, 4, 5].map((index) => (
              <li key={index} className="space-y-2 px-4 py-3">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-1.5 w-full" />
              </li>
            ))
          : stats.map((stat) => {
              const active = selected === stat.id

              return (
                <li key={stat.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(active ? '' : stat.id)}
                    aria-pressed={active}
                    className={cn(
                      'flex w-full cursor-pointer flex-col px-4 py-3 text-left transition-colors',
                      active ? 'bg-primary/5' : 'hover:bg-neutral-50'
                    )}
                  >
                    <span className="flex items-baseline gap-2">
                      {active && <Check className="text-primary size-3.5 shrink-0 self-center" />}
                      <span className="min-w-0 flex-1 truncate text-sm text-neutral-900">{stat.name}</span>
                      <span className="text-sm font-semibold text-neutral-900 tabular-nums">{format(stat.total)}</span>
                    </span>

                    <RiskBar stat={stat} />

                    <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {riskShare(stat).map((slice) => (
                        <span
                          key={slice.key}
                          title={slice.label}
                          className={cn(
                            'flex items-center gap-1 text-[11px] tabular-nums',
                            slice.count > 0 ? 'text-neutral-700' : 'text-neutral-400'
                          )}
                        >
                          <span
                            className={cn('size-2 rounded-full', slice.count === 0 && 'opacity-40')}
                            style={{ backgroundColor: slice.color }}
                          />
                          {format(slice.count)}
                        </span>
                      ))}
                    </span>
                  </button>
                </li>
              )
            })}
      </ul>
    </aside>
  )
}
