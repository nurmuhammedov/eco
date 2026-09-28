import { committeeStaffAPI } from '../model/committee-staffs.api'
import { committeeStaffKeys } from '../model/committee-staffs.query-keys'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useUpdateCommitteeStaff = () => useSliceMutation(committeeStaffAPI.update, committeeStaffKeys.root())
