import { UserRoles } from '@/entities/user'
import { APPLICATIONS_DATA } from '../constants/constants'
import { ApplicationCategory, ApplicationTypeEnum } from '../types/enums'

/**
 * Which application categories a role may submit.
 *
 * The lists mirror the tabs each role sees in the application grid, so a type
 * cannot be reached by typing its enum name into the URL.
 * CHAIRMAN is intentionally absent: it is not limited to a single grid.
 */
const CATEGORIES_BY_ROLE: Partial<Record<UserRoles, ApplicationCategory[]>> = {
  [UserRoles.LEGAL]: [
    ApplicationCategory.HF,
    ApplicationCategory.EQUIPMENTS,
    ApplicationCategory.IRS,
    ApplicationCategory.XRAY,
    ApplicationCategory.ACCREDITATION,
  ],
  [UserRoles.INDIVIDUAL]: [ApplicationCategory.EQUIPMENTS],
  [UserRoles.INSPECTOR]: [ApplicationCategory.ILLEGAL_HF, ApplicationCategory.ILLEGAL_EQUIPMENTS],
  [UserRoles.MANAGER]: [ApplicationCategory.ILLEGAL_IRS, ApplicationCategory.ILLEGAL_XRAY],
}

/** Temporarily unavailable, both in the grid and by direct URL */
export const isApplicationDisabled = (type: ApplicationTypeEnum): boolean =>
  APPLICATIONS_DATA.some((item) => item.type === type && item.disabled)

export type ApplicationAccess = 'allowed' | 'disabled' | 'forbidden'

export const getApplicationAccess = (type: ApplicationTypeEnum, role?: UserRoles): ApplicationAccess => {
  if (isApplicationDisabled(type)) return 'disabled'

  const allowedCategories = role ? CATEGORIES_BY_ROLE[role] : undefined

  // Roles without an explicit list are not restricted here
  if (!allowedCategories) return 'allowed'

  const category = APPLICATIONS_DATA.find((item) => item.type === type)?.category

  if (!category) return 'allowed'

  return allowedCategories.includes(category) ? 'allowed' : 'forbidden'
}
