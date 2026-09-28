import { hazardousFacilityTypeAPI } from '../model/hazardous-facility-type.api'
import { hazardousFacilityTypeKeys } from '../model/hazardous-facility-type.query-keys'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useDeleteHazardousFacilityType = () =>
  useSliceMutation(hazardousFacilityTypeAPI.delete, hazardousFacilityTypeKeys.root(), [
    API_ENDPOINTS.HAZARDOUS_FACILITY_TYPES,
  ])
