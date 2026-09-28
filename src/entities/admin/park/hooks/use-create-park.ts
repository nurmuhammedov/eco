import { parkAPI } from '../model/park.api'
import { parkKeys } from '../model/park.query-keys'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useCreatePark = () => useSliceMutation(parkAPI.createPark, parkKeys.all)
