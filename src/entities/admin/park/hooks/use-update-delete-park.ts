import { parkAPI } from '../model/park.api'
import { parkKeys } from '../model/park.query-keys'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

// The selects in the equipment forms read the same slice, so they refresh with the list
export const useUpdatePark = () => useSliceMutation(parkAPI.updatePark, parkKeys.all)

export const useDeletePark = () => useSliceMutation(parkAPI.deletePark, parkKeys.all)
