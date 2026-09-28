import { useState } from 'react'
import { format } from 'date-fns'
import { apiClient } from '@/shared/api/api-client'
import type { ApiResponse } from '@/shared/types'

/**
 * The owner an application is filed for, however it was found: this system's
 * own record (`/users/legal`) or the state registers (IIP `LegalUserDto`,
 * `IndividualUserDto`). The screens show whichever of the names is there.
 */
export interface OwnerData {
  /** The IIP answers carry the number they were looked up by */
  tin?: number
  pin?: number
  name?: string
  legalName?: string
  fullName?: string
  directorName?: string
  address?: string
  legalAddress?: string
  phoneNumber?: string
}

interface OwnerLookupOptions {
  /** Only organisations can own the object, so a citizen number is not looked up */
  legalOnly?: boolean
}

/**
 * Looks the owner up in the state registers by a taxpayer number, or by a
 * citizen number with a birth date.
 */
export const useOwnerLookup = ({ legalOnly = false }: OwnerLookupOptions = {}) => {
  const [owner, setOwner] = useState<OwnerData | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const lookup = (endpoint: string, body: Record<string, string>) => {
    setIsSearching(true)
    apiClient
      .post<ApiResponse<OwnerData>>(endpoint, body)
      .then((res) => setOwner(res.data?.data ?? null))
      .catch(() => setOwner(null))
      .finally(() => setIsSearching(false))
  }

  /** Starts the lookup; false when the numbers typed are not enough for one */
  const search = (identity?: string | null, birthDate?: Date | null) => {
    if (identity?.length === 9) {
      lookup('/integration/iip/legal', { tin: identity })
      return true
    }
    if (!legalOnly && identity?.length === 14 && birthDate) {
      lookup('/integration/iip/individual', { pin: identity, birthDate: format(birthDate, 'yyyy-MM-dd') })
      return true
    }
    return false
  }

  const clear = () => setOwner(null)

  return { owner, isSearching, search, clear }
}
