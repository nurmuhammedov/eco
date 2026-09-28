import {
  useApplicationFormConstants,
  type CreateHFApplicationDTO,
  HFAppealDtoSchema,
} from '@/entities/create-application'
import {
  useDistrictSelectQuery,
  useHazardousFacilityTypeDictionarySelect,
  useHazardousFacilityCategoryDictionarySelect,
  useRegionSelectQuery,
} from '@/shared/api/dictionaries'
import { getSelectOptions, getHazardousFacilityTypeOptions } from '@/shared/lib/get-select-options'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

type HfDraft = FormDraft<typeof HFAppealDtoSchema>

export const useCreateHfApplication = () => {
  const form = useForm<HfDraft, unknown, CreateHFApplicationDTO>({
    resolver: zodFormResolver<HfDraft, CreateHFApplicationDTO>(HFAppealDtoSchema),
    defaultValues: {
      phoneNumber: '',
      upperOrganization: '',
      name: '',
      categoryId: undefined,
      hfTypeId: undefined,
      spheres: [],
      regionId: '',
      districtId: '',
      address: '',
      location: '',
      extraArea: '',
      hazardousSubstance: '',
      hazardousSign: undefined,
      legalType: undefined,
      cadastreNumber: '',
      startedDate: undefined,
      categoryMode: undefined,
      multiCategoryIds: [],
      hfAppealFilesDto: {},
    },
  })

  const { spheres } = useApplicationFormConstants()
  const regionId = form.watch('regionId')

  const { data: regions } = useRegionSelectQuery()

  const { data: districts } = useDistrictSelectQuery(regionId)

  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

  const { data: hazardousFacilityCategories } = useHazardousFacilityCategoryDictionarySelect()

  const districtOptions = useMemo(() => getSelectOptions(districts), [districts])

  const regionOptions = useMemo(() => getSelectOptions(regions), [regions])

  const hazardousFacilityTypeOptions = useMemo(
    () => getHazardousFacilityTypeOptions(hazardousFacilityTypes),
    [hazardousFacilityTypes]
  )

  const hazardousFacilityCategoryOptions = useMemo(
    () => getSelectOptions(hazardousFacilityCategories),
    [hazardousFacilityCategories]
  )

  return {
    form,
    spheres,
    regionOptions,
    districtOptions,
    hazardousFacilityTypeOptions,
    hazardousFacilityCategoryOptions,
  }
}
