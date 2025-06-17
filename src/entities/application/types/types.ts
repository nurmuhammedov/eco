export enum ApplicationStatus {
  ALL = 'ALL',
  NEW = 'NEW',
  IN_PROCESS = 'IN_PROCESS',
  IN_AGREEMENT = 'IN_AGREEMENT',
  IN_APPROVAL = 'IN_APPROVAL',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export enum ApplicationStatusForInspector {
  ALL = 'ALL',
  IN_PROCESS = 'IN_PROCESS',
  IN_AGREEMENT = 'IN_AGREEMENT',
  IN_APPROVAL = 'IN_APPROVAL',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export interface ApplicationFilters {
  name: string;
  search: string;
  type: string;
  status: ApplicationStatus | undefined;
}
