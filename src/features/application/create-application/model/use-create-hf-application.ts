import { applicationFormConstants, type CreateHFApplicationDTO, HFAppealDtoSchema } from '@/entities/create-application'
import {
  useDistrictSelectQueries,
  useHazardousFacilityTypeDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
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
      hfTypeId: undefined,
      spheres: [],
      regionId: '',
      districtId: '',
      address: '',
      location: '',
      extraArea: '',
      hazardousSubstance: '',
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

  const { spheres } = applicationFormConstants()
  const regionId = form.watch('regionId')

  const { data: regions } = useRegionSelectQueries()

  const { data: districts } = useDistrictSelectQueries(regionId)

  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

  const districtOptions = useMemo(() => getSelectOptions(districts), [districts])

  const regionOptions = useMemo(() => getSelectOptions(regions), [regions, regionId])

  const hazardousFacilityTypeOptions = useMemo(() => getSelectOptions(hazardousFacilityTypes), [hazardousFacilityTypes])

  return { form, spheres, regionOptions, districtOptions, hazardousFacilityTypeOptions }
}
