import {
  useApplicationFormConstants,
  type CreateHFApplicationDTO,
  HFAppealDtoSchema,
} from '@/entities/create-application'
import {
  useDistrictSelectQueries,
  useHazardousFacilityTypeDictionarySelect,
  useHazardousFacilityCategoryDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { getSelectOptions, getHazardousFacilityTypeOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const useCreateHfApplication = () => {
  const form = useForm<CreateHFApplicationDTO>({
    resolver: zodResolver(HFAppealDtoSchema),
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
      identificationCardPath: undefined,
      receiptPath: undefined,
      insurancePolicyPath: undefined,
      insurancePolicyExpiryDate: undefined,
      cadastralPassportPath: undefined,
      projectDocumentationPath: undefined,
      licensePath: undefined,
      licenseExpiryDate: undefined,
      expertOpinionPath: undefined,
      appointmentOrderPath: undefined,
      permitPath: undefined,
      permitExpiryDate: undefined,
      industrialSafetyDeclarationPath: undefined,
      regulationPath: undefined,
      regulationExpiryDate: undefined,
      staffAttestationPath: undefined,
      staffAttestationExpiryDate: undefined,
      managerAttestationPath: undefined,
      managerAttestationExpiryDate: undefined,
    },
  })

  const { spheres } = useApplicationFormConstants()
  const regionId = form.watch('regionId')

  const { data: regions } = useRegionSelectQueries()

  const { data: districts } = useDistrictSelectQueries(regionId)

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
