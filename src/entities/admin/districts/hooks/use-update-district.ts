import { districtAPI } from '../model/district.api'
import { districtKeys } from '../model/district.query-keys'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useUpdateDistrict = () =>
  useSliceMutation(districtAPI.updateDistrict, districtKeys.root(), [API_ENDPOINTS.DISTRICTS])
