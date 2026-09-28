import { territorialStaffAPI } from '../model/territorial-staffs.api'
import { territorialStaffKeys } from '../model/territorial-staffs.query-keys'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useCreateTerritorialStaff = () => useSliceMutation(territorialStaffAPI.create, territorialStaffKeys.root())
