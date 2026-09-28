import { territorialDepartmentsAPI } from '../model/territorial-departments.api'
import { territorialDepartmentsKeys } from '../model/territorial-departments.query-keys'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useCreateTerritorialDepartment = () =>
  useSliceMutation(territorialDepartmentsAPI.create, territorialDepartmentsKeys.root(), [API_ENDPOINTS.OFFICES])
