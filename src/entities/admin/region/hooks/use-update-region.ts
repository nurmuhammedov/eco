import { regionAPI } from '../model/region.api'
import { regionKeys } from '../model/region.query-keys'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useUpdateRegion = () =>
  useSliceMutation(regionAPI.updateRegion, regionKeys.root(), [API_ENDPOINTS.REGIONS])
