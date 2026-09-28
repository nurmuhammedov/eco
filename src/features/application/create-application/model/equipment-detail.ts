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
