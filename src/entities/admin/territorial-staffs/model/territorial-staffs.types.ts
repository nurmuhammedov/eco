import type { SearchParamValue } from '@/shared/types/api'
import type { UserRoles } from '@/shared/types/user'
import type { StaffDetail } from '@/entities/admin/committee-staffs/model/committee-staffs.types'

/** OfficeUserView (`GET /users/office-users`) */
export interface TerritorialStaffTableItem {
  id: string
  fullName: string | null
  pin: number | null
  role: UserRoles | null
  directions: string[] | null
  office: string | null
  officeId: number | null
  position: string | null
  phoneNumber: string | null
  enabled: boolean | null
}

export type TerritorialStaffResponse = StaffDetail

/** OfficeUserDto */
export interface TerritorialStaffPayload {
  fullName: string
  pin: number
  role: UserRoles
  directions: string[]
  officeId: number
  position: string
  phoneNumber: string
}

export type FilterTerritorialStaffDTO = { page?: number; size?: number } & Record<string, SearchParamValue>
