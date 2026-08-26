import { UserRoles, UserState } from '@/entities/user'

/**
 * FVV and SES each take part as one legal entity with one account, so the role
 * alone cannot tell them apart from any other organisation - the TIN does.
 *
 * Kept in one place because the same check runs in the list and in the detail
 * page: a TIN corrected in only one of them fails silently, with the buttons
 * simply never appearing.
 */
export const FVV_TIN = '201862006'
export const SES_TIN = '200794614'

const isLegalWithTin = (user: UserState | undefined, tin: string) =>
  user?.role === UserRoles.LEGAL && String(user?.tinOrPin ?? '') === tin

export const isFvvUser = (user: UserState | undefined) => isLegalWithTin(user, FVV_TIN)

export const isSesUser = (user: UserState | undefined) => isLegalWithTin(user, SES_TIN)

/**
 * The committee closes the passport by signing it, which needs a person holding
 * an E-IMZO key - not a system account.
 */
export const COMMITTEE_ROLES = [UserRoles.MANAGER, UserRoles.CHAIRMAN]

export const isCommitteeUser = (user: UserState | undefined) => COMMITTEE_ROLES.includes(user?.role as UserRoles)
