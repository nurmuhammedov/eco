import type { HfHazardousSign, HfLegalType } from '@/shared/constants/hf-attributes'
import type { FileDto, HFSphere } from '@/shared/types'
import type { RegistrationMode, RegistryStatus } from './registry-status'

/** HfViewById (`GET /hf/{id}`) */
export interface HfDetail {
  legalTin: number | null
  legalName: string | null
  registrationDate: string | null
  registryNumber: string | null
  profileId: string | null
  upperOrganization: string | null
  name: string | null
  address: string | null
  location: string | null
  hazardousSubstance: string | null
  appealId: string | null
  hfTypeId: number | null
  hfTypeName: string | null
  categoryId: number | null
  categoryName: string | null
  extraArea: string | null
  description: string | null
  spheres: HFSphere[] | null
  deregisterReason: string | null
  deregisterFilePath: string | null
  periodicUpdateReason: string | null
  periodicUpdateFilePath: string | null
  active: boolean
  files: Record<string, FileDto> | null
  registryFilePath: string | null
  inspectorName: string | null
  mode: RegistrationMode | null
  regionId: number | null
  districtId: number | null
  managerCount: number | null
  engineerCount: number | null
  workerCount: number | null
  deregisterBasisPath: string | null
  regionName: string | null
  districtName: string | null
  deactivationDate: string | null
  status: RegistryStatus | null
  hazardousSign: HfHazardousSign | null
  legalType: HfLegalType | null
  cadastreNumber: string | null
  startedDate: string | null
  /** Keyed by category id */
  multiCategoryFiles: Record<string, Record<string, FileDto>> | null
  multiCategoryIds: number[] | null
}
