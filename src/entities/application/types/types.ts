export enum ApplicationStatus {
  ALL = 'ALL',
  NEW = 'NEW',
  IN_PROCESS = 'IN_PROCESS',
  IN_AGREEMENT = 'IN_AGREEMENT',
  IN_APPROVAL = 'IN_APPROVAL',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export enum ApplicationStatusForInspector {
  ALL = 'ALL',
  IN_PROCESS = 'IN_PROCESS',
  IN_AGREEMENT = 'IN_AGREEMENT',
  IN_APPROVAL = 'IN_APPROVAL',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export interface ApplicationFilters {
  name: string
  search: string
  type: string
  status: ApplicationStatus | undefined
}

export enum AppealStatusDuration {
  UP_TO_5_DAYS = 'UP_TO_5_DAYS',
  FROM_6_TO_15_DAYS = 'FROM_6_TO_15_DAYS',
  OVER_15_DAYS = 'OVER_15_DAYS',
}
