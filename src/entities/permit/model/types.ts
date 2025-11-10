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
  ALL = 'all',
  PERMIT = 'permit',
  LICENSE = 'license',
  CONCLUSION = 'conclusion',
  NEARING_EXPIRY = 'nearing_expiry',
  EXPIRED = 'expired',
}

export interface PermitSearchResult {
  stir: string;
  organizationName: string;
  status: string;
  documentType: PermitDocumentType;
  documentId: string;
  registrationNumber: string;
  registrationDate: string;
  expiryDate: string;
  documentName: string;
}
