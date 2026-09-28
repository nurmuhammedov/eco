import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import type { ApiResponse, FileDto } from '@/shared/types'

/** RadiationProfileResById: the files an organisation keeps for one kind of radiation device */
/** RadiationProfileResById */
export interface RadiationProfile {
  id: string
  legalTin: number | null
  isActive: boolean | null
  files: Record<string, FileDto> | null
}

/** The organisation's profile, or null when it has none */
export type RadiationProfileCheck = RadiationProfile | null

export const useRadiationProfileCheck = (tin?: string | null, type?: 'IRS' | 'XRAY') => {
  return useQuery({
    queryKey: ['radiation-profile-check', tin, type],
    queryFn: async () => {
      if (!tin || !type) return null
      // Using direct string interpolation to ensure the parameter is correctly passed to the backend
      const res = await apiClient.get<ApiResponse<RadiationProfileCheck>>(
        `/radiation-profiles/check-by-tin/${tin}?type=${type}`
      )
      return res.data.data ?? null
    },
    enabled: !!tin && !!type,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
