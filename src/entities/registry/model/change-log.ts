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
