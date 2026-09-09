import { cn } from '@/shared/lib/utils'
import { LegendItem } from '../model/map-layers'

interface MapFiltersProps {
  legend: LegendItem[]
  counts: Record<string, number>
  active: string[]
  archivedCount: number
  showArchived: boolean
  onToggleArchived: () => void
  onToggle: (key: string) => void
  onReset: () => void
}

/**
 * The legend doubles as the filter. Everything is on by default, so the map
 * reads the same as before until a level is switched off - and the counts sit
 * where the colours are explained, which is where people look for them.
 */
export const MapFilters = ({
  legend,
  counts,
  active,
  archivedCount,
  showArchived,
  onToggleArchived,
  onToggle,
  onReset,
}: MapFiltersProps) => {
  const isFiltered = active.length < legend.length

  return (
    <div className="p-1.5">
      <ul className="flex flex-wrap items-center gap-1">
        {legend.map((item) => {
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

        {archivedCount > 0 && (
          <li className="ml-1 border-l border-neutral-200 pl-1">
            <button
              type="button"
              onClick={onToggleArchived}
              aria-pressed={showArchived}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                showArchived ? 'text-neutral-800 hover:bg-neutral-100' : 'text-neutral-400 hover:bg-neutral-50'
              )}
            >
              <span
                className={cn('size-2.5 rounded-full transition-opacity', !showArchived && 'opacity-30')}
                style={{ backgroundColor: '#cbd5e1' }}
              />
              Reyestrdan chiqarilgan
              <span className={cn('font-semibold tabular-nums', !showArchived && 'opacity-40')}>{archivedCount}</span>
            </button>
          </li>
        )}

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
