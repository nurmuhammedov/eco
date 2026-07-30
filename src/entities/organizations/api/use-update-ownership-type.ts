import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance as api } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/api/endpoints'

interface UpdateOwnershipParams {
  id: string
  ownershipType: 'STATE' | 'NON_STATE'
}

export const useUpdateOwnershipType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ownershipType }: UpdateOwnershipParams) => {
      const { data } = await api.post(`${API_ENDPOINTS.PROFILES_LEGALS}/${id}/ownership-type`, { ownershipType })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}
