import { Direction, UserRoles, UserState } from '@/entities/user'

interface Parties {
  preparerTin: number | null
  customerTin: number | null
}

// /users/me carries no profileId; a legal profile maps to exactly one TIN.
const isLegalWithTin = (user: UserState | undefined, tin: number | null) =>
  user?.role === UserRoles.LEGAL && tin !== null && String(user.tinOrPin) === String(tin)

export const isPreparer = (user: UserState | undefined, passport: Parties) => isLegalWithTin(user, passport.preparerTin)

export const isCustomer = (user: UserState | undefined, passport: Parties) => isLegalWithTin(user, passport.customerTin)

export const canSignAsCommittee = (user: UserState | undefined) =>
  user?.role === UserRoles.MANAGER && !!user.directions?.includes(Direction.CADASTRE_PASSPORT)
