import { APPLICATIONS_DATA, applicationsList } from '../constants/constants'
import { ApplicationTypeEnum } from '../types/enums'

/**
 * Human title of an appeal type.
 *
 * `applicationsList` holds every type the main backend can send, while
 * `APPLICATIONS_DATA` only holds the ones that have a creation card, so the
 * naming list comes first and the card list is a fallback.
 */
export const getApplicationTitle = (type?: ApplicationTypeEnum | string | null): string => {
  if (!type) return ''

  const value = String(type)

  return (
    applicationsList.find((item) => String(item.type) === value)?.title ||
    APPLICATIONS_DATA.find((item) => String(item.type) === value)?.title ||
    ''
  )
}

/**
 * Options for the appeal type filter.
 *
 * The backend takes a single type per request, so this is a flat list. Types
 * that never appear in the appeals table are left out to keep it short.
 */
export const getAppealTypeFilterOptions = (): { id: string; name: string }[] =>
  applicationsList
    .filter((item) => item.filterable !== false)
    .map((item) => ({ id: String(item.type), name: item.title }))

/** Whether the backend still knows this appeal type */
export const isKnownAppealType = (type?: string | null): boolean =>
  !!type && applicationsList.some((item) => String(item.type) === String(type))
