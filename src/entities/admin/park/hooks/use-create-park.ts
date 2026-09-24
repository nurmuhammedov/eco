import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parkAPI } from '../model/park.api'
import { parkKeys } from '../model/park.query-keys'

export const useCreatePark = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: parkAPI.createPark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parkKeys.lists() })
    },
  })
}
