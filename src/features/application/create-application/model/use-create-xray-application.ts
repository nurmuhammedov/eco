// src/features/application/create-application/model/use-create-irs-application.ts
import { XrayAppealDtoSchema } from '@/entities/create-application'
import { stateService } from '@/entities/create-application/types/enums'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useAuth } from '@/shared/hooks/use-auth'
import { useRadiationProfileCheck } from '@/shared/api/radiation-profile/use-radiation-profile-check'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const useCreateXrayApplication = () => {
  const { user } = useAuth()
  const userTin = user?.tinOrPin?.toString()
  const { data: profileData, isLoading: isProfileLoading } = useRadiationProfileCheck(userTin, 'XRAY')

  const form = useForm<z.input<typeof XrayAppealDtoSchema>>({
    resolver: (values, context, options) => {
      const isDataNull = !profileData
      const dynamicSchema = XrayAppealDtoSchema.superRefine((data, ctx) => {
        if (isDataNull) {
          if (!data.file5Path)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file5Path'] })
          if (!data.file5ExpiryDate)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file5ExpiryDate'] })
          if (!data.file7Path)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file7Path'] })
          if (!data.file7ExpiryDate)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file7ExpiryDate'] })
          if (!data.file9Path)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file9Path'] })
          if (!data.file9ExpiryDate)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file9ExpiryDate'] })
        }
      })
      return zodResolver(dynamicSchema)(values, context, options)
    },
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
      stateService: '',
      file5Path: undefined,
      file5ExpiryDate: undefined,
      file7Path: undefined,
      file7ExpiryDate: undefined,
      file9Path: undefined,
      file9ExpiryDate: undefined,
      file14Path: undefined,
      file14ExpiryDate: undefined,
      file8Path: undefined,
      file8ExpiryDate: undefined,
    },
    mode: 'onChange',
  })

  const regionId = form.watch('regionId')

  useEffect(() => {
    if (profileData && profileData.files) {
      Object.keys(profileData.files).forEach((key) => {
        const fileInfo = profileData.files[key]
        if (fileInfo?.path) form.setValue(key as any, fileInfo.path, { shouldValidate: true })
        const dateKey = key.replace('Path', 'ExpiryDate')
        if (fileInfo?.expiryDate)
          form.setValue(dateKey as any, new Date(fileInfo.expiryDate) as any, { shouldValidate: true })
      })
    }
  }, [profileData, form])

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
    isProfileLoading,
    profileData,
    hasIncompleteOrgFiles:
      !!profileData &&
      !!profileData.files &&
      Object.values(profileData.files).some((f: any) => !f?.path || !f?.expiryDate),
  }
}
