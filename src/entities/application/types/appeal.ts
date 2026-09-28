import type { FileDto } from '@/shared/types'
import type { ApplicationStatus } from './types'

/** Who filed an appeal */
export type OwnerType = 'LEGAL' | 'INDIVIDUAL'

/** AppealCustom: one row of the appeals list */
export interface ApplicationRow {
  id: string
  createdAt: string | null
  status: ApplicationStatus | null
  ownerIdentity: number | null
  number: string | null
  ownerName: string | null
  address: string | null
  phoneNumber: string | null
  appealType: string | null
  executorName: string | null
  deadline: string | null
  officeName: string | null
  isRejected: boolean | null
  departmentName: string | null
  ownerType: OwnerType | null
  /** Where the appeal was filed: MY_GOV or SYSTEM */
  sourceType?: string | null
}

/** One attachment of an appeal, with the label it is shown under */
export interface AppealFile {
  label: string
  fieldName: string
  data: FileDto
}

/**
 * What an appeal says about its object, or what a registry record holds: the
 * detail rows read either. Each kind of object fills only its own fields.
 */
export interface AppealInfoData {
  phoneNumber?: string | null
  email?: string | null
  address?: string | null
  location?: string | null
  registryNumber?: string | null
  oldRegistryNumber?: string | null
  sourceType?: string | null
  type?: string | null

  // Hazardous facility
  upperOrganization?: string | null
  name?: string | null
  categoryName?: string | null
  multiCategoryIds?: (number | string)[] | null
  hfTypeName?: string | null
  spheres?: string[] | null
  extraArea?: string | null
  hazardousSubstance?: string | null
  hazardousSign?: string | null
  legalType?: string | null
  cadastreNumber?: string | null
  startedDate?: string | null
  sign?: string | null
  managerCount?: number | null
  engineerCount?: number | null
  workerCount?: number | null

  // Equipment
  hfId?: string | null
  hfName?: string | null
  hazardousFacilityId?: string | null
  childEquipmentName?: string | null
  childEquipmentSortId?: number | string | null
  childEquipmentSortName?: string | null
  factoryNumber?: string | null
  factory?: string | null
  model?: string | null
  manufacturedAt?: string | null
  partialCheckDate?: string | null
  fullCheckDate?: string | null
  servicePeriod?: string | null
  nonDestructiveCheckDate?: string | null
  liftingCapacity?: string | null
  parameters?: Record<string, string | undefined> | null
  sphere?: string | null
  attractionName?: string | null
  riskLevel?: string | null
  parkName?: string | null

  // X-ray
  licenseNumber?: string | null
  licenseRegistryNumber?: string | null
  licenseDate?: string | null
  licenseExpiryDate?: string | null
  serialNumber?: string | null
  manufacturedYear?: number | string | null
  stateService?: string | null

  // Ionizing radiation source
  parentOrganization?: string | null
  supervisorName?: string | null
  supervisorPosition?: string | null
  supervisorStatus?: string | null
  supervisorEducation?: string | null
  supervisorPhoneNumber?: string | null
  division?: string | null
  identifierType?: string | null
  symbol?: string | null
  activity?: string | number | null
  category?: string | null
  country?: string | null
  acceptedFrom?: string | null
  acceptedAt?: string | null
  isValid?: boolean | null
  usageType?: string | null
  storageLocation?: string | null

  // Declaration check
  legalTin?: number | string | null
  hfRegistryNumber?: string | null

  files?: Record<string, FileDto> | null
  /** One attachment set per declared category, keyed by its id */
  multiCategoryFiles?: Record<string, Record<string, FileDto>> | null
}

/** AppealViewById (`GET /appeals/{id}`) */
export interface ApplicationDetail {
  id: string
  createdAt: string | null
  appealType: string | null
  number: string | null
  address: string | null
  executorName: string | null
  approverName: string | null
  deadline: string | null
  officeName: string | null
  status: ApplicationStatus | null
  ownerIdentity: number | null
  ownerName: string | null
  ownerType: OwnerType | null
  resolution: string | null
  conclusion: string | null
  departmentName: string | null
  mode: string | null
  /** The appeal's own payload, shaped by its type */
  data: AppealInfoData | null
  phoneNumber: string | null
  basisPath: string | null
  sourceType?: string | null
}

/** An appeal as its screen shows it: the payload's attachments listed under their labels */
export interface ApplicationDetailWithFiles extends ApplicationDetail {
  files: AppealFile[]
  multiCategoryFiles: Record<string, AppealFile[]>
}
