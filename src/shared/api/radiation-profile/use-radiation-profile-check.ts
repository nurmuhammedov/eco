import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import type { ApiResponse } from '@/shared/types'

/** A stored file with the registry details attached to it (backend FileDto) */
export interface FileDto {
  path: string | null
  number: string | null
  expiryDate: string | null
  uploadDate: string | null
}

/** The organization's radiation profile for one kind of device (RadiationProfileResById), or null when it has none */
export type RadiationProfileCheck = {
  id: string
  legalTin: number
  isActive: boolean
  files: Record<string, FileDto>
} | null

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
