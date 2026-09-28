import { territorialStaffAPI } from '../model/territorial-staffs.api'
import { territorialStaffKeys } from '../model/territorial-staffs.query-keys'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useDeleteTerritorialStaff = () => useSliceMutation(territorialStaffAPI.delete, territorialStaffKeys.root())
