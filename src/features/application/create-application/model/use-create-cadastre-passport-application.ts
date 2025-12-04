import { CreateCadastrePassportApplicationDTO } from '@/entities/create-application'
import { CadastrePassportAppealDtoSchema } from '@/entities/create-application/schemas'
import {
  useDistrictSelectQueries,
  useHazardousFacilityDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const useCreateCadastrePassportApplication = () => {
  const form = useForm<CreateCadastrePassportApplicationDTO>({
    resolver: zodResolver(CadastrePassportAppealDtoSchema),
    defaultValues: {
      phoneNumber: '',
      hfId: '',
      hfName: '',
      regionId: '',
      districtId: '',
      address: '',
      organizationTin: '',
      organizationName: '',
      organizationAddress: '',
      location: '',
      passportPath: '',
      agreementPath: '',
    },
  })

  const regionId = form.watch('regionId')
  const hfId = form.watch('hfId')

  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect()

  useEffect(() => {
    if (hfId && hazardousFacilities) {
      const selectedFacility = hazardousFacilities.find((f: any) => f?.id === hfId)
      if (selectedFacility) {
        form.setValue('hfName', selectedFacility.name, { shouldValidate: true })
        form.setValue('address', selectedFacility.address, { shouldValidate: true })
      }
    }
  }, [hfId, hazardousFacilities, form.setValue])

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)

  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hazardousFacilities || []), [hazardousFacilities])
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])

  return { form, regionOptions, districtOptions, hazardousFacilitiesOptions }
}
