import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parkAPI } from '../models/park.api'
import { parkKeys } from '../models/park.query-keys'

export const useUpdatePark = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: parkAPI.updatePark,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: parkKeys.lists() })
      queryClient.invalidateQueries({ queryKey: parkKeys.detail(variables.id) })
    },
  })
}

export const useDeletePark = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: parkAPI.deletePark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parkKeys.lists() })
    },
  })
}
