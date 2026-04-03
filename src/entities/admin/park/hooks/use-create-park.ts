import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parkAPI } from '../models/park.api'
import { parkKeys } from '../models/park.query-keys'

export const useCreatePark = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: parkAPI.createPark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parkKeys.lists() })
    },
  })
}
