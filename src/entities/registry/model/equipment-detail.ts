import type { FileDto } from '@/shared/types'
import type { RegistryStatus } from './registry-status'

/** EquipmentViewById (`GET /equipments/{id}`) */
export interface EquipmentDetail {
  id: string
  registrationDate: string | null
  type:
    | 'CRANE'
    | 'CONTAINER'
    | 'BOILER'
    | 'ELEVATOR'
    | 'ESCALATOR'
    | 'CABLEWAY'
    | 'HOIST'
    | 'PIPELINE'
    | 'ATTRACTION'
    | 'CHEMICAL_CONTAINER'
    | 'HEAT_PIPELINE'
    | 'BOILER_UTILIZER'
    | 'LPG_CONTAINER'
    | 'LPG_POWERED'
    | 'OIL_CONTAINER'
    | null
  appealId: string | null
  registryNumber: string | null
  ownerIdentity: number | null
  ownerType: string | null
  hfId: string | null
  hfName: string | null
  childEquipmentId: number | null
  childEquipmentName: string | null
  factoryNumber: string | null
  address: string | null
  model: string | null
  factory: string | null
  location: string | null
  manufacturedAt: string | null
  oldRegistryNumber: string | null
  parameters: Record<string, string> | null
  /** Where an elevator works */
  sphere: 'RESIDENTIAL' | 'HOTEL' | 'SOCIAL' | 'INDUSTRIAL' | 'SERVICE' | 'OTHER' | null
  attractionName: string | null
  acceptedAt: string | null
  childEquipmentSortId: number | null
  childEquipmentSortName: string | null
  country: string | null
  servicePeriod: string | null
  riskLevel: 'I' | 'II' | 'III' | 'IV' | null
  nonDestructiveCheckDate: string | null
  description: string | null
  inspectorName: string | null
  isActive: boolean | null
  files: Record<string, FileDto> | null
  registryFilePath: string | null
  inquiryCount: number | null
  partialCheckDate: string | null
  nextPartialCheckDate: string | null
  fullCheckDate: string | null
  nextFullCheckDate: string | null
  regionId: number | null
  districtId: number | null
  parkId: number | null
  parkName: string | null
  deactivationDate: string | null
  deregisterReason: string | null
  deregisterFilePath: string | null
  regionName: string | null
  districtName: string | null
  deregisterBasisPath: string | null
  status: RegistryStatus | 'EXPIRED' | 'NO_DATE' | null
}
