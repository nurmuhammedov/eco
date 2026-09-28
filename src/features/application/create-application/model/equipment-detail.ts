import type { FileDto } from '@/shared/types'

/** EquipmentViewById: the fields an edit form fills itself from */
export interface EquipmentDetail {
  id: string
  ownerIdentity: number | null
  hfId: string | null
  childEquipmentId: number | null
  childEquipmentSortId: number | null
  factoryNumber: string | null
  regionId: number | null
  districtId: number | null
  parkId: number | null
  address: string | null
  model: string | null
  factory: string | null
  location: string | null
  country: string | null
  attractionName: string | null
  manufacturedAt: string | null
  servicePeriod: string | null
  acceptedAt: string | null
  nonDestructiveCheckDate: string | null
  riskLevel: 'I' | 'II' | 'III' | 'IV' | null
  partialCheckDate: string | null
  nextPartialCheckDate: string | null
  fullCheckDate: string | null
  nextFullCheckDate: string | null
  parameters: Record<string, string> | null
  files: Record<string, FileDto> | null
}

/**
 * An edit keeps the owner, yet the schemas still ask a citizen owner for a
 * birth date. Any date passes; the update endpoints do not read it.
 */
export const KEPT_OWNER_BIRTH_DATE = new Date(1900, 0, 1)

/** Old records hold Cyrillic in fields the forms now take in Latin only; those start empty */
export const latinOrEmpty = <T>(value: T) => (typeof value === 'string' && /[\u0400-\u04FF]/.test(value) ? '' : value)
