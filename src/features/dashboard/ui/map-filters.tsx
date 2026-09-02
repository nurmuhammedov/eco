import { cn } from '@/shared/lib/utils'
import { RISK_FILTERS, RiskKey } from '../model/map-icons'

interface MapFiltersProps {
  counts: Record<RiskKey, number>
  active: RiskKey[]
  onToggle: (key: RiskKey) => void
  onReset: () => void
}

/**
 * The legend doubles as the filter. Everything is on by default, so the map
 * reads the same as before until a level is switched off - and the counts sit
 * where the colours are explained, which is where people look for them.
 */
export const MapFilters = ({ counts, active, onToggle, onReset }: MapFiltersProps) => {
  const isFiltered = active.length < RISK_FILTERS.length

  return (
    <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-neutral-200 bg-white/95 p-1.5 shadow-sm backdrop-blur-sm">
      <ul className="flex flex-wrap items-center gap-1">
        {RISK_FILTERS.map((item) => {
          const on = active.includes(item.key)

          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onToggle(item.key)}
                aria-pressed={on}
                className={cn(
                  'flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                  on ? 'text-neutral-800 hover:bg-neutral-100' : 'text-neutral-400 hover:bg-neutral-50'
                )}
              >
                <span
                  className={cn('size-2.5 rounded-full transition-opacity', !on && 'opacity-30')}
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
                <span className={cn('font-semibold tabular-nums', !on && 'opacity-40')}>{counts[item.key] ?? 0}</span>
              </button>
            </li>
          )
        })}

        {isFiltered && (
          <li>
            <button
              type="button"
              onClick={onReset}
              className="text-primary cursor-pointer rounded-lg px-2.5 py-1.5 text-xs hover:bg-neutral-100"
            >
              Tozalash
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}
