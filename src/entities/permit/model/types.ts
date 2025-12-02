export enum PermitDocumentType {
  PERMIT = 'permit',
  LICENSE = 'license',
  CONCLUSION = 'conclusion',
}

export interface Permit {
  id: string | number;
  organizationStir: string;
  organizationName: string;
  documentType: PermitDocumentType;
  documentName: string;
  registrationNumber: string;
  registrationDate: string;
}

export enum PermitTabKey {
  ALL = 'ALL',
  PERMIT = 'PERMISSION',
  LICENSE = 'LICENSE',
  CONCLUSION = 'CONCLUSION',
  NEARING_EXPIRY = 'nearing_expiry',
  EXPIRED = 'expired',
}

export interface PermitSearchResult {
  registerId: number;
  name: string;
  filePath: string;
  tin: number;
  pin: number;
  type: number;
  registerNumber: string;
  registrationDate: string;
  expiryDate: string;
  documentType: string;
  documentName: string;
  organizationName: string;
  activityAddresses: string[];
  activityTypes: { typeId: number; name: string }[];
  category: string | null;
  documentId: number;
  status: string;
  brandMark: string | null;
}
