import { useQuery } from '@tanstack/react-query'
import { parkAPI } from '../models/park.api'
import { parkKeys } from '../models/park.query-keys'

export const useParkSelectQuery = (regionId?: number | string | null, districtId?: number | string | null) => {
  return useQuery({
    queryFn: () =>
      parkAPI.fetchParksSelect({
        regionId: regionId && regionId !== 'ALL' ? regionId : null,
        districtId: districtId && districtId !== 'ALL' ? districtId : null,
      }),
    queryKey: parkKeys.entity(`park-select-${regionId}-${districtId}`),
  })
}
