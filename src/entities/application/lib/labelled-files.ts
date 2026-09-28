import type { FileDto } from '@/shared/types'
import type { AppealFile } from '../types/appeal'

/** A record's attachments listed under their labels; only the `...Path` entries are files */
export const toLabelledFiles = (
  files: Record<string, FileDto> | null | undefined,
  labelOf: (field: string) => string
): AppealFile[] =>
  Object.entries(files ?? {})
    .filter(([field]) => field.includes('Path'))
    .map(([field, data]) => ({ label: labelOf(field), data, fieldName: field }))
