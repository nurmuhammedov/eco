import { useQuery } from '@tanstack/react-query'
import { getPublicEquipmentById } from '../api/public-equipment'

export const usePublicEquipmentDetail = (id?: string) => {
  return useQuery({
    queryKey: ['publicEquipment', id],
    queryFn: () => getPublicEquipmentById(id!),
    enabled: !!id,
    retry: 1,
  })
}
