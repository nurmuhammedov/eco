import { useQuery } from '@tanstack/react-query'
import { departmentsAPI } from '@/shared/api/dictionaries'

export const useDepartmentSelectQueries = () => {
  return useQuery({
    staleTime: 0,
    queryKey: ['department-select'],
    queryFn: () => departmentsAPI.list(),
  })
}
