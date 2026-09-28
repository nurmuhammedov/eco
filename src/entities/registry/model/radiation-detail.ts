import type { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums'
import type { FileDto } from '@/shared/types'
import type { RegistrationMode } from './registry-status'

/** IrsViewById (`GET /irs/{id}`) */
export interface IrsDetail {
  appealId: string | null
  registryNumber: string | null
  registrationDate: string | null
  legalTin: number | null
  parentOrganization: string | null
  address: string | null
  supervisorName: string | null
  supervisorPosition: string | null
  supervisorStatus: string | null
  supervisorEducation: string | null
  supervisorPhoneNumber: string | null
  division: string | null
  identifierType: IrsIdentifierType | null
  symbol: string | null
  sphere: string | null
  factoryNumber: string | null
  serialNumber: string | null
  activity: string | null
  type: string | null
  category: IrsCategory | null
  country: string | null
  manufacturedAt: string | null
  acceptedFrom: string | null
  acceptedAt: string | null
  isValid: boolean | null
  usageType: IrsUsageType | null
  storageLocation: string | null
  files: Record<string, FileDto> | null
  inspectorName: string | null
  regionId: number | null
  districtId: number | null
  regionName: string | null
  districtName: string | null
}

/** XRayResById (`GET /xrays/{id}`) */
export interface XrayDetail {
  appealId: string | null
  legalTin: number | null
  registryNumber: string | null
  registrationDate: string | null
  licenseNumber: string | null
  licenseRegistryNumber: string | null
  licenseDate: string | null
  address: string | null
  stateService: 'X_RAY_PERMIT' | null
  model: string | null
  serialNumber: string | null
  manufacturedYear: number | null
  isActive: boolean | null
  files: Record<string, FileDto> | null
  mode: RegistrationMode | null
  managerName: string | null
  regionId: number | null
  districtId: number | null
  regionName: string | null
  districtName: string | null
  deregisterReason: string | null
  deregisterBasisPath: string | null
  deactivationDate: string | null
}
