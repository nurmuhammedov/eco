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
