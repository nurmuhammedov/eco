import type { UserRoles } from '@/shared/types/user'

/** UserDelegationRes (`GET /user-delegation`) */
export interface UserDelegation {
  id: string
  delegatorFullName: string | null
  delegatorRole: UserRoles | null
  delegateeFullName: string | null
  delegateeRole: UserRoles | null
  startDate: string | null
  endDate: string | null
  /** Jackson drops the "is" of a primitive boolean getter */
  active: boolean
  basisPath: string | null
  reasonType: string | null
}

/** UserDelegationCreateDto */
export interface UserDelegationPayload {
  delegatorId: string
  delegateeId: string
  startDate: string
  endDate: string
  basisPath: string
  reasonType: string
}
