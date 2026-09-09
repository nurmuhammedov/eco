import { LegendItem, MapPoint, bucketOf } from './map-layers'

export const UNKNOWN_REGION = 'UNKNOWN'

export interface RegionStat {
  id: string
  name: string
  total: number
  counts: Record<string, number>
}

/**
 * The list is built from the region dictionary rather than from the points, so
 * every region keeps its row even with nothing registered in it - the panel
 * reads the same on every visit, and an empty region is itself information.
 */
export const buildRegionStats = (
  points: MapPoint[],
  regions: { id: number | string; name: string }[]
): RegionStat[] => {
  const stats = new Map<string, RegionStat>(
    regions.map((region) => [String(region.id), { id: String(region.id), name: region.name, total: 0, counts: {} }])
  )

  const unknown: RegionStat = { id: UNKNOWN_REGION, name: 'Hududi ko‘rsatilmagan', total: 0, counts: {} }

  for (const point of points) {
    const stat = stats.get(String(point.regionId)) ?? unknown
    const bucket = bucketOf(point)

    stat.total += 1
    stat.counts[bucket] = (stat.counts[bucket] ?? 0) + 1
  }

  const list = [...stats.values()]

  return unknown.total > 0 ? [...list, unknown] : list
}

export const share = (stat: RegionStat, legend: LegendItem[]) =>
  legend.map((item) => {
    const count = stat.counts[item.key] ?? 0

    return { ...item, count, percent: stat.total > 0 ? (count / stat.total) * 100 : 0 }
  })
