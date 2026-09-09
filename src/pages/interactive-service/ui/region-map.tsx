import { useMemo } from 'react'
import uzGeoData from '@/shared/assets/uz-regions.json'
import { regionByCode } from '../model/regions'

interface GeoFeature {
  properties: { id?: string; name?: string }
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: any[] }
}

interface RegionMapProps {
  /** Keyed by registry region id; absent means the category has no regional breakdown. */
  counts: Record<string, number> | null
  activeRegionId: number | null
  onSelect: (regionId: number | null) => void
  accent: string
}

const BOUNDS = { minLon: 56, maxLon: 73.2, minLat: 37.2, maxLat: 45.6 }
const WIDTH = 800
const HEIGHT = 500

const project = (lon: number, lat: number): [number, number] => [
  ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * WIDTH,
  HEIGHT - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * HEIGHT,
]

const ringPath = (ring: number[][]) =>
  ring.map((coord, index) => `${index === 0 ? 'M' : 'L'}${project(coord[0], coord[1]).join(',')}`).join('') + 'Z '

const buildPath = (feature: GeoFeature) => {
  const { type, coordinates } = feature.geometry

  return type === 'Polygon'
    ? (coordinates as number[][][]).map(ringPath).join('')
    : (coordinates as number[][][][]).map((polygon) => polygon.map(ringPath).join('')).join('')
}

const isInside = (x: number, y: number, ring: [number, number][]) => {
  let inside = false

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || 1e-12) + xi) inside = !inside
  }

  return inside
}

/**
 * A ring's centroid lands outside a concave region - Namangan wraps around
 * Andijon far enough that its label would sit in the neighbouring province. The
 * fallback picks the interior sample furthest from the outline, which reads as
 * the visual centre of the shape.
 */
const labelPoint = (feature: GeoFeature): [number, number] => {
  const rings: number[][][] =
    feature.geometry.type === 'Polygon'
      ? (feature.geometry.coordinates as number[][][])
      : (feature.geometry.coordinates as number[][][][]).flat()

  const largest = rings.reduce((best, ring) => (ring.length > best.length ? ring : best), rings[0] ?? [])
  const ring = largest.map(([lon, lat]) => project(lon, lat))

  const sum = ring.reduce(([x, y], [px, py]) => [x + px, y + py], [0, 0])
  const centroid: [number, number] = [sum[0] / (ring.length || 1), sum[1] / (ring.length || 1)]

  if (isInside(centroid[0], centroid[1], ring)) return centroid

  const box = ring.reduce(
    ([minX, minY, maxX, maxY], [x, y]) => [Math.min(minX, x), Math.min(minY, y), Math.max(maxX, x), Math.max(maxY, y)],
    [Infinity, Infinity, -Infinity, -Infinity]
  )

  const steps = 28
  let best = centroid
  let bestClearance = -1

  for (let i = 1; i < steps; i++) {
    for (let j = 1; j < steps; j++) {
      const x = box[0] + ((box[2] - box[0]) * i) / steps
      const y = box[1] + ((box[3] - box[1]) * j) / steps
      if (!isInside(x, y, ring)) continue

      const clearance = ring.reduce((nearest, [px, py]) => Math.min(nearest, (px - x) ** 2 + (py - y) ** 2), Infinity)

      if (clearance > bestClearance) {
        bestClearance = clearance
        best = [x, y]
      }
    }
  }

  return best
}

/** Shoelace area of the outer ring, in viewBox units. */
const ringArea = (feature: GeoFeature) => {
  const rings: number[][][] =
    feature.geometry.type === 'Polygon'
      ? (feature.geometry.coordinates as number[][][])
      : (feature.geometry.coordinates as number[][][][]).flat()

  const ring = rings.reduce((best, item) => (item.length > best.length ? item : best), rings[0] ?? [])
  const projected = ring.map(([lon, lat]) => project(lon, lat))

  const twice = projected.reduce((sum, [x, y], index) => {
    const [nx, ny] = projected[(index + 1) % projected.length]

    return sum + (x * ny - nx * y)
  }, 0)

  return Math.abs(twice) / 2
}

/** Below this a polygon cannot hold a figure, so its label is called out instead. */
const CALLOUT_AREA = 300
const CALLOUT_OFFSET: [number, number] = [38, -30]

/**
 * The shading floor is well above zero: keyed straight to the counts, a region
 * holding a handful of records washed out to almost nothing and the whole map
 * read as switched off.
 */
const MIN_SHADE = 0.35
const MAX_SHADE = 1

const format = (value: number) => value.toLocaleString('ru-RU').replace(/\s/g, ' ')

export const RegionMap = ({ counts, activeRegionId, onSelect, accent }: RegionMapProps) => {
  const shapes = useMemo(
    () =>
      (uzGeoData as unknown as { features: GeoFeature[] }).features.flatMap((feature) => {
        const region = regionByCode(feature.properties.id ?? '')
        if (!region) return []

        return [
          {
            region,
            path: buildPath(feature),
            label: labelPoint(feature),
            isCallout: ringArea(feature) < CALLOUT_AREA,
          },
        ]
      }),
    []
  )

  const max = useMemo(() => Math.max(1, ...Object.values(counts ?? {})), [counts])

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full max-h-full w-full max-w-full"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label="Hududlar xaritasi"
      >
        {shapes.map(({ region, path, label, isCallout }) => {
          const count = counts?.[String(region.id)] ?? 0
          const isActive = activeRegionId === region.id
          const dimmed = activeRegionId !== null && !isActive

          /**
           * Square-root rather than linear: one region holding a third of the
           * registry would otherwise flatten every other shade into the same
           * pale wash.
           */
          const intensity = counts ? Math.sqrt(count / max) : 0.55
          const opacity = dimmed ? 0.18 : isActive ? 1 : MIN_SHADE + intensity * (MAX_SHADE - MIN_SHADE)

          return (
            <g key={region.code}>
              <path
                d={path}
                // The selection is the map's own colour at full strength and its
                // neighbours stepped back, rather than a second hue on top.
                fill={accent}
                fillOpacity={opacity}
                stroke="#ffffff"
                strokeWidth={1}
                /**
                 * The browser draws its focus ring around an SVG path's bounding
                 * box, which lands as a black rectangle across the neighbouring
                 * regions. The fill already says which one is selected.
                 */
                className="cursor-pointer transition-[fill,fill-opacity] duration-300 outline-none focus:outline-none focus-visible:outline-none"
                onClick={() => onSelect(isActive ? null : region.id)}
                role="button"
                tabIndex={0}
                aria-label={`${region.name}${counts ? `: ${count}` : ''}`}
                aria-pressed={isActive}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return
                  event.preventDefault()
                  onSelect(isActive ? null : region.id)
                }}
              />

              {counts &&
                count > 0 &&
                (isCallout ? (
                  <g className="pointer-events-none" opacity={dimmed ? 0.3 : 1}>
                    <line
                      x1={label[0]}
                      y1={label[1]}
                      x2={label[0] + CALLOUT_OFFSET[0]}
                      y2={label[1] + CALLOUT_OFFSET[1]}
                      stroke="#94a3b8"
                      strokeWidth={1}
                    />
                    <circle cx={label[0]} cy={label[1]} r={2.5} fill={accent} />
                    <rect
                      x={label[0] + CALLOUT_OFFSET[0] - 20}
                      y={label[1] + CALLOUT_OFFSET[1] - 11}
                      width={40}
                      height={22}
                      rx={6}
                      fill="#ffffff"
                      stroke="#e2e8f0"
                    />
                    <text
                      x={label[0] + CALLOUT_OFFSET[0]}
                      y={label[1] + CALLOUT_OFFSET[1]}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-semibold tabular-nums"
                      fontSize={13}
                      fill="#0f172a"
                    >
                      {format(count)}
                    </text>
                  </g>
                ) : (
                  <text
                    x={label[0]}
                    y={label[1]}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none font-semibold tabular-nums"
                    fontSize={13 + intensity * 6}
                    fill={isActive || intensity > 0.45 ? '#ffffff' : '#0f172a'}
                    /**
                     * A halo in the opposite tone rather than a plate behind the
                     * figure: the number stays legible wherever the shading puts
                     * it, without fourteen boxes cluttering the outline.
                     */
                    stroke={isActive || intensity > 0.45 ? accent : '#ffffff'}
                    strokeWidth={3}
                    paintOrder="stroke"
                    strokeLinejoin="round"
                    opacity={dimmed ? 0.25 : 1}
                  >
                    {format(count)}
                  </text>
                ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
