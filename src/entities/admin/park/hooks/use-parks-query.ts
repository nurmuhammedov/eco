import { useQuery } from '@tanstack/react-query'
import { parkAPI } from '../models/park.api'
import { parkKeys } from '../models/park.query-keys'
import { FilterParkDTO } from '../models/park.types'

export const useParksQuery = (params: FilterParkDTO) => {
  return useQuery({
    queryKey: parkKeys.list(params),
    queryFn: () => parkAPI.fetchParks(params),
  })
}
