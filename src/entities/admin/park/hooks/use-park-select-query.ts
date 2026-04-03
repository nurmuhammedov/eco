import { useQuery } from '@tanstack/react-query'
import { parkAPI } from '../models/park.api'
import { parkKeys } from '../models/park.query-keys'

export const useParkSelectQuery = (districtId: number) => {
  return useQuery({
    enabled: !!districtId,
    queryFn: () => parkAPI.fetchParksSelect(districtId),
    queryKey: parkKeys.entity('park-select-' + districtId),
  })
}
