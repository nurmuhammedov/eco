import { FacilityLocation } from './facility-location'
import { RISK_FILTERS, RiskKey, riskKeyOf } from './map-icons'

export const UNKNOWN_REGION = 'UNKNOWN'

export interface RegionStat {
  id: string
  name: string
  total: number
  counts: Record<RiskKey, number>
}

const emptyCounts = (): Record<RiskKey, number> => ({ HIGH: 0, MEDIUM: 0, LOW: 0, NONE: 0 })

/**
 * The list is built from the region dictionary rather than from the facilities,
 * so every region keeps its row even with nothing registered in it - the panel
 * reads the same on every visit, and an empty region is itself information.
 */
export const buildRegionStats = (
  facilities: FacilityLocation[],
  regions: { id: number | string; name: string }[]
): RegionStat[] => {
  const stats = new Map<string, RegionStat>(
    regions.map((region) => [
      String(region.id),
      { id: String(region.id), name: region.name, total: 0, counts: emptyCounts() },
    ])
  )

  const unknown: RegionStat = { id: UNKNOWN_REGION, name: 'Hududi ko‘rsatilmagan', total: 0, counts: emptyCounts() }

  for (const facility of facilities) {
    const stat = stats.get(String(facility.regionId)) ?? unknown

    stat.total += 1
    stat.counts[riskKeyOf(facility)] += 1
  }

  const list = [...stats.values()]

  return unknown.total > 0 ? [...list, unknown] : list
}

export const riskShare = (stat: RegionStat) =>
  RISK_FILTERS.map((filter) => ({
    ...filter,
    count: stat.counts[filter.key],
    percent: stat.total > 0 ? (stat.counts[filter.key] / stat.total) * 100 : 0,
  }))
