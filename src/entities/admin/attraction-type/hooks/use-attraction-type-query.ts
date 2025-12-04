import { useQuery } from '@tanstack/react-query'
import { attractionTypeAPI } from '../models/attraction-type.api'

const ATTRACTION_TYPE_QUERY_KEY = 'attraction-type'

export const useAttractionTypeList = (params: any) => {
  return useQuery({
    queryKey: [ATTRACTION_TYPE_QUERY_KEY, 'list', params],
    queryFn: () => attractionTypeAPI.getAll(params),
  })
}

export const useAttractionTypeDetail = (id?: number) => {
  return useQuery({
    queryKey: [ATTRACTION_TYPE_QUERY_KEY, 'detail', id],
    queryFn: () => attractionTypeAPI.getById(id!),
    enabled: !!id,
  })
}

export const useAttractionsSelect = () => {
  return useQuery({
    queryKey: [ATTRACTION_TYPE_QUERY_KEY, 'select'],
    queryFn: () => attractionTypeAPI.getAttractionsSelect(),
  })
}
