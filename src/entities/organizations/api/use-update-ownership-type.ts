import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { API_ENDPOINTS } from '@/shared/api/endpoints'

interface UpdateOwnershipParams {
  id: string
  ownershipType: 'STATE' | 'NON_STATE'
}

export const useUpdateOwnershipType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ownershipType }: UpdateOwnershipParams) => {
      const { data } = await apiClient.post(`${API_ENDPOINTS.PROFILES_LEGALS}/${id}/ownership-type`, {
        ownershipType,
      })
      return data
    },
    onSuccess: () => {
      invalidateEndpoint(queryClient, API_ENDPOINTS.PROFILES_LEGALS)
    },
  })
}
