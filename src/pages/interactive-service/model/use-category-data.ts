import { useMemo } from 'react'
import { useData } from '@/shared/hooks'
import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import { InquiryStatus } from '@/features/inquiries/model/types'
import { useDashboardStats } from '@/features/dashboard/model/use-dashboard-stats'
import { useRiskAnalysisStats } from '@/features/dashboard/model/use-risk-analysis-stats'
import { FacilityLocation } from '@/features/dashboard/model/facility-location'
import {
  EquipmentLocation,
  MapPoint,
  isArchived,
  toEquipmentPoint,
  toHfPoint,
} from '@/features/dashboard/model/map-layers'
import { CategoryId } from './categories'

export interface Metric {
  key: string
  label: string
  value: number
  color: string
}

export interface CategoryData {
  total: number
  totalLabel: string
  metrics: Metric[]
  /** Deregistered records, reported beside the registry rather than inside it. */
  archived: number | null
  /** Empty for the categories with no location endpoint behind them. */
  points: MapPoint[]
  regionCounts: Record<string, number> | null
  isLoading: boolean
}

interface Options {
  category: CategoryId
  regionId?: string
  year: string
  month: string
}

const asArray = <T>(value: T[] | undefined): T[] => (Array.isArray(value) ? value : [])

const countBy = (points: MapPoint[]) =>
  points.reduce<Record<string, number>>((totals, point) => {
    const key = String(point.regionId ?? '')
    totals[key] = (totals[key] ?? 0) + 1

    return totals
  }, {})

export const useCategoryData = ({ category, regionId, year, month }: Options): CategoryData => {
  const base = regionId ? { regionId } : {}

  const stats = useDashboardStats(regionId, category)

  const hfLocations = useData<FacilityLocation[]>('/hf/locations', category === 'hf')
  const craneLocations = useData<EquipmentLocation[]>('/equipments/cranes/locations', category === 'crane')
  const attractionLocations = useData<EquipmentLocation[]>(
    '/equipments/attractions/locations',
    category === 'attraction'
  )

  const risk = useRiskAnalysisStats({ year: Number(year), month, regionId, enabled: category === 'risk' })

  /**
   * The inspection endpoints reject a request without `belongType`, so the
   * period is broken down by the object type inspected rather than hiding a
   * default of HF behind a total that would only ever cover facilities.
   */
  const inspectionEnabled = category === 'inspection'
  const inspectionParams = { ...base, page: 1, size: 1, year, month, type: 'RISK_BASED' }
  const inspHf = usePaginatedData('/inspections', { ...inspectionParams, belongType: 'HF' }, inspectionEnabled)
  const inspElevator = usePaginatedData(
    '/inspections',
    { ...inspectionParams, belongType: 'ELEVATOR' },
    inspectionEnabled
  )
  const inspAttraction = usePaginatedData(
    '/inspections',
    { ...inspectionParams, belongType: 'ATTRACTION' },
    inspectionEnabled
  )
  const inspIrs = usePaginatedData('/inspections', { ...inspectionParams, belongType: 'IRS' }, inspectionEnabled)
  const inspXray = usePaginatedData('/inspections', { ...inspectionParams, belongType: 'XRAY' }, inspectionEnabled)
  const inspLpg = usePaginatedData(
    '/inspections',
    { ...inspectionParams, belongType: 'LPG_POWERED' },
    inspectionEnabled
  )

  const inquiryEnabled = category === 'inquiry'
  const inquiryParams = { ...base, page: 1, size: 1 }
  const inqNew = usePaginatedData('/inquiries', { ...inquiryParams, status: InquiryStatus.NEW }, inquiryEnabled)
  const inqProcess = usePaginatedData(
    '/inquiries',
    { ...inquiryParams, status: InquiryStatus.IN_PROCESS },
    inquiryEnabled
  )
  const inqCourt = usePaginatedData('/inquiries', { ...inquiryParams, status: InquiryStatus.IN_COURT }, inquiryEnabled)
  const inqReward = usePaginatedData(
    '/inquiries',
    { ...inquiryParams, status: InquiryStatus.REWARD_PAYMENT },
    inquiryEnabled
  )
  const inqDone = usePaginatedData('/inquiries', { ...inquiryParams, status: InquiryStatus.COMPLETED }, inquiryEnabled)
  const inqRejected = usePaginatedData(
    '/inquiries',
    { ...inquiryParams, status: InquiryStatus.REJECTED },
    inquiryEnabled
  )

  const equipmentPoints = useMemo(() => {
    if (category === 'crane') return asArray(craneLocations.data).map(toEquipmentPoint('CRANE'))
    if (category === 'attraction') return asArray(attractionLocations.data).map(toEquipmentPoint('ATTRACTION'))

    return []
  }, [category, craneLocations.data, attractionLocations.data])

  const points = useMemo(() => {
    const all = category === 'hf' ? asArray(hfLocations.data).map(toHfPoint) : equipmentPoints

    return all.filter((point) => !isArchived(point))
  }, [category, hfLocations.data, equipmentPoints])

  const archivedPoints = useMemo(() => {
    const all = category === 'hf' ? asArray(hfLocations.data).map(toHfPoint) : equipmentPoints
    const inRegion = regionId ? all.filter((point) => String(point.regionId) === regionId) : all

    return inRegion.filter(isArchived).length
  }, [category, hfLocations.data, equipmentPoints, regionId])

  /**
   * The location endpoints take no parameters, so the region filter every other
   * section gets from the API has to be applied here before anything is counted.
   */
  const regionPoints = useMemo(
    () => (regionId ? points.filter((point) => String(point.regionId) === regionId) : points),
    [points, regionId]
  )

  return useMemo<CategoryData>(() => {
    switch (category) {
      case 'hf':
        return {
          total: stats.hf.active,
          totalLabel: 'Reyestrdagi XICHOlar',
          metrics: [
            { key: 'valid', label: 'Faol', value: stats.hf.valid, color: '#0d9488' },
            { key: 'invalid', label: 'Nofaol', value: stats.hf.invalid, color: '#94a3b8' },
          ],
          archived: stats.hf.inactive,
          points,
          regionCounts: countBy(points),
          isLoading: stats.hf.isLoading,
        }

      case 'crane':
      case 'attraction': {
        const byStatus = (status: string) => regionPoints.filter((point) => point.status === status).length

        return {
          total: regionPoints.length,
          totalLabel: category === 'crane' ? 'Reyestrdagi kranlar' : 'Reyestrdagi attraksionlar',
          metrics: [
            { key: 'VALID', label: 'Amaldagi', value: byStatus('VALID'), color: '#0b626b' },
            { key: 'EXPIRED', label: 'Muddati o‘tgan', value: byStatus('EXPIRED'), color: '#f43f5e' },
            { key: 'NO_DATE', label: 'Muddati kiritilmagan', value: byStatus('NO_DATE'), color: '#f59e0b' },
          ],
          archived: archivedPoints,
          points,
          regionCounts: countBy(points),
          isLoading: category === 'crane' ? craneLocations.isLoading : attractionLocations.isLoading,
        }
      }

      case 'equipment':
        return {
          total: stats.equipment.active,
          totalLabel: 'Reyestrdagi qurilmalar',
          metrics: [
            { key: 'expired', label: 'Muddati o‘tgan', value: stats.equipment.expired, color: '#f43f5e' },
            { key: 'noDate', label: 'Muddati kiritilmagan', value: stats.equipment.noDate, color: '#f59e0b' },
            { key: 'valid', label: 'Muddati amaldagi', value: stats.equipment.valid, color: '#0d9488' },
          ],
          archived: stats.equipment.inactive,
          points: [],
          regionCounts: null,
          isLoading: stats.equipment.isLoading,
        }

      // IrsParamsDto has no status of its own, so `valid` is the whole story:
      // what is on the register, and what has come off it.
      case 'irs':
        return {
          total: stats.irs.active,
          totalLabel: 'Reyestrdagi INMlar',
          metrics: [],
          archived: stats.irs.inactive,
          points: [],
          regionCounts: null,
          isLoading: stats.irs.isLoading,
        }

      case 'xray':
        return {
          total: stats.xray.active,
          totalLabel: 'Reyestrdagi rentgenlar',
          metrics: [
            { key: 'expired', label: 'Muddati o‘tgan', value: stats.xray.expired, color: '#f43f5e' },
            { key: 'noDate', label: 'Muddati kiritilmagan', value: stats.xray.noDate, color: '#f59e0b' },
            {
              key: 'valid',
              label: 'Muddati amaldagi',
              value: Math.max(0, stats.xray.active - stats.xray.expired - stats.xray.noDate),
              color: '#0d9488',
            },
          ],
          archived: stats.xray.inactive,
          points: [],
          regionCounts: null,
          isLoading: stats.xray.isLoading,
        }

      case 'risk':
        return {
          total: risk.highRisk + risk.mediumRisk + risk.lowRisk,
          totalLabel: 'Tahlil qilingan obyektlar',
          metrics: [
            { key: 'high', label: 'Xavfi yuqori', value: risk.highRisk, color: '#e11d48' },
            { key: 'medium', label: 'Xavfi o‘rta', value: risk.mediumRisk, color: '#d97706' },
            { key: 'low', label: 'Xavfi past', value: risk.lowRisk, color: '#0d9488' },
          ],
          archived: null,
          points: [],
          regionCounts: null,
          isLoading: risk.isLoading,
        }

      case 'inspection': {
        const queries = [inspHf, inspElevator, inspAttraction, inspIrs, inspXray, inspLpg]
        const byBelongType = [
          { key: 'HF', label: 'XICHOlar', query: inspHf, color: '#0b626b' },
          { key: 'ELEVATOR', label: 'Liftlar', query: inspElevator, color: '#2563eb' },
          { key: 'ATTRACTION', label: 'Attraksionlar', query: inspAttraction, color: '#7c3aed' },
          { key: 'IRS', label: 'INMlar', query: inspIrs, color: '#0d9488' },
          { key: 'XRAY', label: 'Rentgenlar', query: inspXray, color: '#d97706' },
          {
            key: 'LPG_POWERED',
            label: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalar',
            query: inspLpg,
            color: '#64748b',
          },
        ].map(({ query, ...rest }) => ({ ...rest, value: Number(query.totalElements ?? 0) }))

        return {
          total: byBelongType.reduce((sum, item) => sum + item.value, 0),
          totalLabel: 'Xavf tahlili asosidagi tekshiruvlar',
          metrics: byBelongType,
          archived: null,
          points: [],
          regionCounts: null,
          isLoading: queries.some((query) => query.isLoading),
        }
      }

      case 'inquiry': {
        const counts = {
          new: inqNew.totalElements ?? 0,
          process: inqProcess.totalElements ?? 0,
          court: inqCourt.totalElements ?? 0,
          reward: inqReward.totalElements ?? 0,
          done: inqDone.totalElements ?? 0,
          rejected: inqRejected.totalElements ?? 0,
        }

        return {
          total: Object.values(counts).reduce((sum, value) => sum + value, 0),
          totalLabel: 'Kelib tushgan murojaatlar',
          metrics: [
            { key: 'new', label: 'Yangi', value: counts.new, color: '#3b82f6' },
            { key: 'process', label: 'Ko‘rib chiqilmoqda', value: counts.process, color: '#f59e0b' },
            { key: 'court', label: 'Sud jarayonida', value: counts.court, color: '#8b5cf6' },
            { key: 'done', label: 'Yakunlangan', value: counts.done, color: '#10b981' },
            { key: 'rejected', label: 'Rad etilgan', value: counts.rejected, color: '#ef4444' },
          ],
          archived: null,
          points: [],
          regionCounts: null,
          isLoading: [inqNew, inqProcess, inqCourt, inqReward, inqDone, inqRejected].some((query) => query.isLoading),
        }
      }

      default:
        return {
          total: 0,
          totalLabel: '',
          metrics: [],
          archived: null,
          points: [],
          regionCounts: null,
          isLoading: false,
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    category,
    stats,
    risk,
    points,
    regionPoints,
    archivedPoints,
    equipmentPoints,
    craneLocations.isLoading,
    attractionLocations.isLoading,
    inspHf,
    inspElevator,
    inspAttraction,
    inspIrs,
    inspXray,
    inspLpg,
    inqNew.totalElements,
    inqProcess.totalElements,
    inqCourt.totalElements,
    inqReward.totalElements,
    inqDone.totalElements,
    inqRejected.totalElements,
  ])
}
