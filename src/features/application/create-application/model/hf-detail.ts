import type { HfHazardousSign, HfLegalType } from '@/shared/constants/hf-attributes'
import type { FileDto } from '@/shared/types'

/** A hazardous facility record (`GET /hf/{id}`): the fields an edit or re-registration form fills itself from */
export interface HfDetail {
  id: string
  ownerIdentity?: number | null
  legalTin?: number | null
  phoneNumber: string | null
  upperOrganization: string | null
  name: string | null
  categoryId: number | null
  multiCategoryIds: number[] | null
  hfTypeId: number | string | null
  hfTypeName: string | null
  spheres: string[] | null
  regionId: number | null
  districtId: number | null
  address: string | null
  location: string | null
  extraArea: string | null
  hazardousSubstance: string | null
  hazardousSign: HfHazardousSign | null
  legalType: HfLegalType | null
  cadastreNumber: string | null
  startedDate: string | null
  managerCount: number | null
  engineerCount: number | null
  workerCount: number | null
  files: Record<string, FileDto> | null
  multiCategoryFiles: Record<string, Record<string, FileDto>> | null
}
