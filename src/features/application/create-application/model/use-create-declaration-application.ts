import { CreateDeclarationApplicationDTO } from '@/entities/create-application'
import { DeclarationAppealDtoSchema } from '@/entities/create-application/schemas'
import {
  useDistrictSelectQueries,
  useHazardousFacilityDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const useCreateDeclarationApplication = () => {
  const form = useForm<CreateDeclarationApplicationDTO>({
    resolver: zodResolver(DeclarationAppealDtoSchema),
    defaultValues: {
      phoneNumber: '',
      hfId: '',
      hfName: '',
      hfRegistryNumber: '',
      address: '',
      regionId: '',
      districtId: '',
      information: '',
      producingOrganizationTin: '',
      producingOrganizationName: '',
      operatingOrganizationName: '',
      expertiseNumber: '',
      expertiseDate: undefined,
      registrationOrganizationName: '',
      declarationPath: '',
      agreementPath: '',
    },
    mode: 'onChange',
  })

  const regionId = form.watch('regionId')
  const hfId = form.watch('hfId')

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilities, isLoading: isHfLoading } = useHazardousFacilityDictionarySelect()

  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hazardousFacilities || []), [hazardousFacilities])

  useEffect(() => {
    if (hfId && hazardousFacilities) {
      const selectedFacility = hazardousFacilities.find((f: any) => f?.id === hfId)
      if (selectedFacility) {
        form.setValue('hfName', selectedFacility.name, { shouldValidate: true })
        form.setValue('address', selectedFacility.address, { shouldValidate: true })
      }
    }
  }, [hfId, hazardousFacilities, form.setValue])

  return {
    form,
    regionOptions,
    districtOptions,
    hazardousFacilitiesOptions,
    isHfLoading,
  }
}
