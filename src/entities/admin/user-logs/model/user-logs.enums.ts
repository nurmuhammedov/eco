/**
 * The enum is a runtime value the schema validates against, so it cannot live
 * beside the types the schema itself produces - that made the two files depend
 * on each other.
 */
export enum UserLogsTypeEnum {
  NEW = 'NEW',
  IN_PROCESS = 'IN_PROCESS',
  IN_AGREEMENT = 'IN_AGREEMENT',
  IN_APPROVAL = 'IN_APPROVAL',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
}
