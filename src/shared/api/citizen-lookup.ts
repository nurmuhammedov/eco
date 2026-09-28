import { format } from 'date-fns'
import { apiClient } from './api-client'
import type { ApiResponse } from '@/shared/types/api'

/** IndividualUserDto: a citizen as the state register knows them */
export interface CitizenRecord {
  pin?: number | null
  fullName?: string | null
  address?: string | null
}

/** A citizen found in the state register by their PIN and birth date; null when the lookup failed */
export const lookupCitizen = async (pin: string, birthDate: Date) => {
  try {
    const { data } = await apiClient.post<ApiResponse<CitizenRecord>>('/integration/iip/individual', {
      pin,
      birthDate: format(birthDate, 'yyyy-MM-dd'),
    })
    return data.data
  } catch {
    // The request has already shown its error toast
    return null
  }
}
