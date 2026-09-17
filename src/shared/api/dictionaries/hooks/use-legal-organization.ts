import useDetail from '@/shared/hooks/api/use-detail'

export interface LegalOrganization {
  name?: string
  directorName?: string
  address?: string
  phoneNumber?: string
  regionId?: number
  districtId?: number
  [key: string]: unknown
}

/**
 * An organisation looked up by its taxpayer number. Nearly every appeal form
 * needs it; they used to each write the request out inline under their own
 * query key, so the same organisation was fetched again on every form and a
 * refresh on one screen never reached another.
 */
export const useLegalOrganizationQuery = (tin?: string | number | null, enabled: boolean = true) =>
  useDetail<LegalOrganization>('/users/legal', tin, enabled)
