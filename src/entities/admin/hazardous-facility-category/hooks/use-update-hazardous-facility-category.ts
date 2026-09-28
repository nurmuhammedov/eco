import { hazardousFacilityCategoryAPI } from '../model/hazardous-facility-category.api'
import { hazardousFacilityCategoryKeys } from '../model/hazardous-facility-category.query-keys'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useUpdateHazardousFacilityCategory = () =>
  useSliceMutation(hazardousFacilityCategoryAPI.update, hazardousFacilityCategoryKeys.root(), [
    API_ENDPOINTS.HAZARDOUS_FACILITY_CATEGORIES,
  ])
