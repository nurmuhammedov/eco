import { inspectionChecklistAPI as checklistAPI } from '../model/checklist.api'
import { checklistKeys } from '../model/checklist.query-keys'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useCreateChecklist = () => useSliceMutation(checklistAPI.createChecklist, checklistKeys.root())
