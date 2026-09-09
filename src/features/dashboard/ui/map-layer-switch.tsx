import { cn } from '@/shared/lib/utils'
import { MAP_LAYERS, MapLayerKey } from '../model/map-layers'

interface MapLayerSwitchProps {
  active: MapLayerKey
  counts: Partial<Record<MapLayerKey, number>>
  onSelect: (key: MapLayerKey) => void
}

/**
 * Only one registry is drawn at a time. Mixing facilities, cranes and
 * attractions would put three unrelated colour scales on one map, and the
 * clusters would stop meaning anything.
 */
export const MapLayerSwitch = ({ active, counts, onSelect }: MapLayerSwitchProps) => (
  <div className="border-b border-neutral-100 p-1.5">
    <ul className="flex flex-wrap items-center gap-1">
      {MAP_LAYERS.map((layer) => {
        const on = active === layer.key
        const count = counts[layer.key]

        return (
          <li key={layer.key}>
            <button
              type="button"
              onClick={() => onSelect(layer.key)}
              aria-pressed={on}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                on ? 'bg-primary text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              {layer.label}
              {count !== undefined && (
                <span className={cn('tabular-nums', on ? 'text-white/70' : 'text-neutral-400')}>{count}</span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  </div>
)
