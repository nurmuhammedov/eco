// src/features/application/create-application/model/use-create-irs-application.ts
import { CreateXrayApplicationDTO, XrayAppealDtoSchema } from '@/entities/create-application'
import { stateService } from '@/entities/create-application/types/enums'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const useCreateXrayApplication = () => {
  const form = useForm<CreateXrayApplicationDTO>({
    resolver: zodResolver(XrayAppealDtoSchema),
    defaultValues: {
      phoneNumber: '',
      licenseNumber: '',
      licenseRegistryNumber: '',
      licenseDate: undefined,
      licenseExpiryDate: undefined,
      serialNumber: '',
      regionId: '',
      districtId: '',
      address: '',
      manufacturedYear: '',
      file1Path: undefined,
      file1ExpiryDate: undefined,
      file2Path: undefined,
      file2ExpiryDate: undefined,
      file3Path: undefined,
      file3ExpiryDate: undefined,
      file4Path: undefined,
      file5Path: undefined,
      file5ExpiryDate: undefined,
      file6Path: undefined,
      file6ExpiryDate: undefined,
      file7Path: undefined,
      file7ExpiryDate: undefined,
      file8Path: undefined,
      file8ExpiryDate: undefined,
      file9Path: undefined,
      file9ExpiryDate: undefined,
      file10Path: undefined,
      file11Path: undefined,
      file11ExpiryDate: undefined,
      file12Path: undefined,
      file13Path: undefined,
      file13ExpiryDate: undefined,
    },
    mode: 'onChange',
  })

  const regionId = form.watch('regionId')
  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])

  const stateServiceOptions = useMemo(
    () =>
      getSelectOptions(
        Object.entries(stateService).map(([key, value]) => ({
          id: key,
          name: value,
        }))
      ),
    []
  )

  return {
    form,
    regionOptions,
    districtOptions,
    stateServiceOptions,
  }
}
