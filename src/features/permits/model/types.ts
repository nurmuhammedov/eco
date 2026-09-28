export enum PermitTabKey {
  ALL = 'ALL',
  PERMIT = 'PERMISSION',
  LICENSE = 'LICENSE',
  CONCLUSION = 'CONCLUSION',
  NEARING_EXPIRY = 'nearing_expiry',
  EXPIRED = 'expired',
}

export type PermitType = 'LICENSE' | 'CONCLUSION' | 'PERMISSION'

/**
 * A permit as SearchResultDisplay shows it: the licence register's answer
 * while one is being added (LicenseRes), or the saved permit (PermitResById).
 * The two name a few things differently, so those are optional.
 */
export interface PermitSearchResult {
  id?: string
  registerId: number | null
  name: string | null
  tin: number | null
  pin: number | null
  /** A number from the register, the PermitType once saved */
  type: number | PermitType | null
  registerNumber: string | null
  registrationDate: string | null
  expiryDate: string | null
  documentType?: string | null
  documentName: string | null
  organizationName: string | null
  activityTypes?: { typeId: number | null; name: string | null }[] | null
  activityTypeNames?: string[] | null
  status: string | null
  licenseStatus?: string | null
  filePath?: string | null
  category?: string | null
  documentId?: number | null
  brandMark?: string | null
}

/** PermitRes (`GET /permits`) */
export interface PermitRow {
  id: string
  tin: number | null
  pin: number | null
  name: string | null
  type: PermitType | null
  documentName: string | null
  registerNumber: string | null
  createdAt: string | null
  registrationDate: string | null
  expiryDate: string | null
  status: string | null
  licenseStatus: 'ACTIVE' | 'EXPIRED' | 'CANCELED' | null
}

/** PermitCountView (`GET /permits/count`) */
export interface PermitCount {
  allCount: number | null
  permissionCount: number | null
  licenseCount: number | null
  conclusionCount: number | null
}

/** LegalPermitDto / IndividualPermitDto: a permit is added by the owner's TIN or PIN */
export type PermitPayload = ({ tin: string } | { pin: string }) & { registerNumber: string; filePath: string }

/** LegalLicenseDto / IndividualLicenseDto */
export type LicenseSearch = ({ tin: string } | { pin: string }) & { registerNumber: string }
