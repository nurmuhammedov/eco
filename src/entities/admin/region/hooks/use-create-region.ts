import { regionKeys } from '../model/region.query-keys'
import { regionAPI } from '@/entities/admin/region/model/region.api'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useCreateRegion = () =>
  useSliceMutation(regionAPI.createRegion, regionKeys.root(), [API_ENDPOINTS.REGIONS])
