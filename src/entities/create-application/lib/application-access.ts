import { UserRoles } from '@/shared/types/user'
import { APPLICATIONS_DATA } from '../constants/constants'
import { ApplicationCategory, ApplicationTypeEnum } from '../types/enums'
import type { ApplicationCardItem } from '../types/types'

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

/** Whole categories closed for now; drop one from the list to open it again */
const CLOSED_CATEGORIES: ApplicationCategory[] = [
  ApplicationCategory.EQUIPMENTS,
  ApplicationCategory.IRS,
  ApplicationCategory.XRAY,
]

/** A closed category keeps its tab out of the application grid */
export const isCategoryClosed = (category: ApplicationCategory): boolean => CLOSED_CATEGORIES.includes(category)

/** Temporarily unavailable: shown as such in the grid */
export const isCardDisabled = (item: ApplicationCardItem): boolean =>
  !!item.disabled || (!!item.category && isCategoryClosed(item.category))

/** Temporarily unavailable, both in the grid and by direct URL */
export const isApplicationDisabled = (type: ApplicationTypeEnum): boolean =>
  APPLICATIONS_DATA.some((item) => item.type === type && isCardDisabled(item))

export type ApplicationAccess = 'allowed' | 'disabled' | 'forbidden'

/**
 * `isUpdate` marks an edit of a record that already exists in the register.
 *
 * Neither gate below applies to an edit. Both answer "may this role submit a
 * new application of this type", while /register/update/:type/:id names an
 * ILLEGAL_REGISTER_* form for every record, whoever registered the object -
 * that segment picks the form, it does not claim who may act. Judging an edit
 * by it locked LEGAL and INDIVIDUAL out of their own records entirely, since
 * no ILLEGAL_* category is on either list. Who may edit record 123 depends on
 * owning it, which only the backend can answer.
 */
export const getApplicationAccess = (
  type: ApplicationTypeEnum,
  role?: UserRoles,
  { isUpdate = false }: { isUpdate?: boolean } = {}
): ApplicationAccess => {
  if (isUpdate) return 'allowed'

  if (isApplicationDisabled(type)) return 'disabled'

  const allowedCategories = role ? CATEGORIES_BY_ROLE[role] : undefined

  // Roles without an explicit list are not restricted here
  if (!allowedCategories) return 'allowed'

  const category = APPLICATIONS_DATA.find((item) => item.type === type)?.category

  if (!category) return 'allowed'

  return allowedCategories.includes(category) ? 'allowed' : 'forbidden'
}
