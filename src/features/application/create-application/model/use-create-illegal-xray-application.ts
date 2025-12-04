// src/features/application/create-application/model/use-create-irs-application.ts
import { CreateIllegalXrayApplicationDTO, XrayIllegalAppealDtoSchema } from '@/entities/create-application'
import { stateService } from '@/entities/create-application/types/enums'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const useCreateIllegalXrayApplication = () => {
  const form = useForm<CreateIllegalXrayApplicationDTO>({
    resolver: zodResolver(XrayIllegalAppealDtoSchema),
    defaultValues: {
      phoneNumber: '',
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
          id: key, // `id` ga kalit (`X_RAY_PERMIT`) tushadi
          name: value, // `name` ga qiymat (`Rentgen...`) tushadi
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
