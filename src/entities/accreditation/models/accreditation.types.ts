import { AccreditationSphere } from './accreditation.enums';

export interface BaseAccreditationFilesDto {
  accreditationFieldPath: string;
  organizationCharterPath: string;
  declarationConformityPath: string;
  receiptPath: string;
  employeesInfoPath: string;
  accreditationResourcedPath: string;
  propertyOwnerShipPath: string;
  qualityPerformanceInstructionPath: string;
  qualityManagementSystemPath: string;
}

export interface BaseAccreditationDataDto {
  organizationName: string;
  stir: string;
  regionId: number;
  districtId: number;
  legalAddress: string;
  phone: string;
  email: string;
  leaderFio: string;
  accreditationSpheres: AccreditationSphere[];
}

export type AccreditationDto = BaseAccreditationDataDto & BaseAccreditationFilesDto;

export type ReAccreditationDto = AccreditationDto & {
  certificateIssueDate: string;
  certificateEndDate: string;
  certificateNumber: string;
};

export type ExpandAccreditationDto = BaseAccreditationDataDto & BaseAccreditationFilesDto;

export interface AccreditationList {
  id: number;
  nomi: string;
}
