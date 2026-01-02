import { applicationFormConstants } from '@/entities/create-application'
import {
  useDistrictSelectQueries,
  useHazardousFacilityTypeDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import useAdd from '@/shared/hooks/api/useAdd'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  RegisterIllegalHfDTO,
  RegisterIllegalHfSchema,
} from '@/entities/create-application/schemas/register-illegal-hf-shcema'

export const useRegisterIllegalHf = (externalSubmit?: (data: RegisterIllegalHfDTO) => void) => {
  const [manualOwnerData, setManualOwnerData] = useState<any>(null)

  const form = useForm<RegisterIllegalHfDTO>({
    resolver: zodResolver(RegisterIllegalHfSchema),
    defaultValues: {
      identity: '',
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
    },
    mode: 'onChange',
  })

  const { mutateAsync: legalMutateAsync, isPending: isLegalPending } = useAdd<any, any, any>('/integration/iip/legal')

  const regionId = form.watch('regionId')
  const { spheres } = applicationFormConstants()

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

  const handleSearch = () => {
    const identity = form.getValues('identity')?.trim()

    if (identity && identity.length === 9) {
      legalMutateAsync({ tin: identity })
        .then((res) => setManualOwnerData(res.data))
        .catch(() => setManualOwnerData(null))
    } else {
      form.trigger('identity')
    }
  }

  const handleClear = () => {
    setManualOwnerData(null)
    form.setValue('identity', '')
  }

  const handleSubmit = (data: any) => {
    if (externalSubmit) {
      externalSubmit({ ...data, legalTin: data?.identity })
    }
  }

  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const hazardousFacilityTypeOptions = useMemo(
    () => getSelectOptions(hazardousFacilityTypes || []),
    [hazardousFacilityTypes]
  )

  return {
    form,
    spheres,
    regionOptions,
    districtOptions,
    hazardousFacilityTypeOptions,
    ownerData: manualOwnerData,
    isSearchLoading: isLegalPending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
