import { useQuery } from '@tanstack/react-query'
import { parkAPI } from '../model/park.api'
import { parkKeys } from '../model/park.query-keys'
import { FilterParkDTO } from '../model/park.types'

export const useParksQuery = (params: FilterParkDTO) => {
  return useQuery({
    queryKey: parkKeys.list(params),
    queryFn: () => parkAPI.fetchParks(params),
  })
}
