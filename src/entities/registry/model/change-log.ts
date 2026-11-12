/** ChangeLog: one field of a registry record as a change left it */
export interface ChangeLogEntry {
  id: string
  fieldName: string | null
  fieldNameUz: string | null
  oldValue: string | null
  newValue: string | null
  /** The values are file paths */
  isFile: boolean | null
  userName: string | null
  createdAt: string | null
  updatedAt: string | null
  changeId: string | null
  status: 'NEW' | 'COMPLETED' | null
}

/**
 * Fields whose values are file paths even though the backend logs them with
 * isFile false: the deregistration documents a restore clears.
 */
const FILE_LOG_FIELDS = new Set(['restoreFile', 'deregisterFile', 'deregisterFilePath', 'deregisterBasisPath'])

/** Whether the log's values should be shown as file links */
export const isFileLog = (entry: Pick<ChangeLogEntry, 'isFile' | 'fieldName'>) =>
  !!entry.isFile || (!!entry.fieldName && FILE_LOG_FIELDS.has(entry.fieldName))
