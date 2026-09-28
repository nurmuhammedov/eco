import useDetail from '@/shared/hooks/api/use-detail'

/** UserViewByProfile: an organisation's profile in this system */
export interface LegalOrganization {
  id?: string
  identity?: string | number
  name?: string
  legalForm?: string
  legalOwnershipType?: string
  directorName?: string
  address?: string
  phoneNumber?: string
  isActive?: boolean
}

/**
 * An organisation looked up by its taxpayer number. Nearly every appeal form
 * needs it; they used to each write the request out inline under their own
 * query key, so the same organisation was fetched again on every form and a
 * refresh on one screen never reached another.
 */
export const useLegalOrganizationQuery = (tin?: string | number | null, enabled: boolean = true) =>
  useDetail<LegalOrganization>('/users/legal', tin, enabled)
