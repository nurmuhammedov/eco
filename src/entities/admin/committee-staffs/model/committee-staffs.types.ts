import type { SearchParamValue } from '@/shared/types/api'
import type { UserRoles } from '@/shared/types/user'

/** CommitteeUserView (`GET /users/committee-users`) */
export interface CommitteeStaffTableItem {
  id: string
  fullName: string | null
  pin: number | null
  role: UserRoles | null
  directions: string[] | null
  department: string | null
  departmentId: number | null
  position: string | null
  phoneNumber: string | null
  enabled: boolean | null
}

/** UserViewById (`GET /users/{id}`): a staff member of either kind, their unit by id only */
export interface StaffDetail {
  id: string
  fullName: string | null
  pin: number | null
  role: UserRoles | null
  directions: string[] | null
  departmentId: number | null
  officeId: number | null
  position: string | null
  phoneNumber: string | null
  enabled: boolean | null
}

export type CommitteeStaffResponse = StaffDetail

/** CommitteeUserDto */
export interface CommitteeStaffPayload {
  fullName: string
  pin: number
  role: UserRoles
  directions: string[]
  departmentId: number
  position: string
  phoneNumber: string
}

export type FilterCommitteeStaffDTO = { page?: number; size?: number } & Record<string, SearchParamValue>
