import { FacilityLocation, HfStatus, RISK_STYLE, RiskLevel, STATUS_STYLE } from './facility-location'

export type MapLayerKey = 'HF' | 'CRANE' | 'ATTRACTION'

export type EquipmentStatus = 'VALID' | 'INVALID' | 'INACTIVE' | 'EXPIRED' | 'NO_DATE'

/** One entry of `/equipments/cranes/locations` and `/equipments/attractions/locations`. */
export interface EquipmentLocation {
  id: string
  name: string
  ownerIdentity: number | null
  ownerName: string
  location: string
  registryNumber: string
  regionId: number | null
  status: EquipmentStatus
}

/** What a pin needs, whichever registry it came from. */
export interface MapPoint {
  layer: MapLayerKey
  id: string
  name: string
  ownerName: string
  ownerTin: number | null
  location: string
  registryNumber: string
  regionId: number | null
  status: string
  riskLevel: RiskLevel | null
  detailPath: string
}

export interface LegendItem {
  key: string
  label: string
  color: string
}

const FALLBACK_COLOR = '#94a3b8'

export const EQUIPMENT_STATUS_STYLE: Record<EquipmentStatus, LegendItem> = {
  VALID: { key: 'VALID', label: 'Soz holatdagi', color: '#0b626b' },
  EXPIRED: { key: 'EXPIRED', label: 'Muddati o‘tgan', color: '#f43f5e' },
  NO_DATE: { key: 'NO_DATE', label: 'Muddati kiritilmagan', color: '#f59e0b' },
  INVALID: { key: 'INVALID', label: 'Vaqtinchalik nofaol', color: FALLBACK_COLOR },
  INACTIVE: { key: 'INACTIVE', label: 'Reyestrdan chiqarilgan', color: '#cbd5e1' },
}

/**
 * Risk carries the colour for facilities, because that is what the cards on the
 * same page are keyed to. Equipment has no daily analysis, so its own registry
 * status is the only thing left to separate one pin from another.
 */
const HF_LEGEND: LegendItem[] = [
  { key: 'HIGH', label: RISK_STYLE.HIGH.label, color: RISK_STYLE.HIGH.color },
  { key: 'MEDIUM', label: RISK_STYLE.MEDIUM.label, color: RISK_STYLE.MEDIUM.color },
  { key: 'LOW', label: RISK_STYLE.LOW.label, color: RISK_STYLE.LOW.color },
  { key: 'NONE', label: 'Tahlil qilinmagan', color: STATUS_STYLE.VALID.color },
]

/** The archive is never drawn, so it has no place in the legend either. */
const EQUIPMENT_LEGEND: LegendItem[] = (['VALID', 'EXPIRED', 'NO_DATE', 'INVALID'] as EquipmentStatus[]).map(
  (key) => EQUIPMENT_STATUS_STYLE[key]
)

interface MapLayer {
  key: MapLayerKey
  label: string
  endpoint: string
  legend: LegendItem[]
  heading: string
  empty: string
}

export const MAP_LAYERS: MapLayer[] = [
  {
    key: 'HF',
    label: 'XICHOlar',
    endpoint: '/hf/locations',
    legend: HF_LEGEND,
    heading: 'Xavfli ishlab chiqarish obyektlari xaritasi',
    empty: 'Koordinatasi ko‘rsatilgan obyekt topilmadi',
  },
  {
    key: 'CRANE',
    label: 'Minorali kranlar',
    endpoint: '/equipments/cranes/locations',
    legend: EQUIPMENT_LEGEND,
    heading: 'Minorali kranlar xaritasi',
    empty: 'Koordinatasi ko‘rsatilgan minorali kran topilmadi',
  },
  {
    key: 'ATTRACTION',
    label: 'Attraksionlar',
    endpoint: '/equipments/attractions/locations',
    legend: EQUIPMENT_LEGEND,
    heading: 'Attraksionlar xaritasi',
    empty: 'Koordinatasi ko‘rsatilgan attraksion topilmadi',
  },
]

export const layerOf = (key: MapLayerKey) => MAP_LAYERS.find((layer) => layer.key === key) ?? MAP_LAYERS[0]

export const toHfPoint = (item: FacilityLocation): MapPoint => ({
  layer: 'HF',
  id: item.id,
  name: item.name,
  ownerName: item.legalName,
  ownerTin: item.legalTin ?? null,
  location: item.location,
  registryNumber: item.registryNumber,
  regionId: item.regionId,
  status: item.status,
  riskLevel: item.riskLevel,
  detailPath: `/register/${item.id}/hf`,
})

export const toEquipmentPoint =
  (layer: MapLayerKey) =>
  (item: EquipmentLocation): MapPoint => ({
    layer,
    id: item.id,
    name: item.name,
    ownerName: item.ownerName,
    ownerTin: item.ownerIdentity ?? null,
    location: item.location,
    registryNumber: item.registryNumber,
    regionId: item.regionId,
    status: item.status,
    riskLevel: null,
    detailPath: `/register/${item.id}/equipments`,
  })

export const bucketOf = (point: MapPoint) => (point.layer === 'HF' ? (point.riskLevel ?? 'NONE') : point.status)

/**
 * The location endpoints return the archive alongside the live registry, and
 * the facility legend is keyed to risk rather than status - so a deregistered
 * facility would otherwise sit in the map's counts with no way to tell.
 */
export const isArchived = (point: MapPoint) => point.status === 'INACTIVE'

export const pointColor = (point: MapPoint) => {
  if (point.layer !== 'HF') return EQUIPMENT_STATUS_STYLE[point.status as EquipmentStatus]?.color ?? FALLBACK_COLOR

  return (
    (point.riskLevel && RISK_STYLE[point.riskLevel]?.color) ||
    STATUS_STYLE[point.status as HfStatus]?.color ||
    FALLBACK_COLOR
  )
}

export const statusOf = (point: MapPoint): LegendItem | undefined =>
  point.layer === 'HF'
    ? STATUS_STYLE[point.status as HfStatus] && { key: point.status, ...STATUS_STYLE[point.status as HfStatus] }
    : EQUIPMENT_STATUS_STYLE[point.status as EquipmentStatus]
