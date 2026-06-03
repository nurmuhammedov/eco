// src/features/application/create-application/model/use-create-irs-application.ts
import { CreateIrsApplicationDTO, IrsAppealDtoSchema } from '@/entities/create-application'
import { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useRadiationProfileCheck } from '@/shared/api/radiation-profile/use-radiation-profile-check'
import { useAuth } from '@/shared/hooks/use-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const useCreateIrsApplication = () => {
  const { user } = useAuth()
  const userTin = user?.tinOrPin?.toString()
  const { data: profileData, isLoading: isProfileLoading } = useRadiationProfileCheck(userTin, 'IRS')

  const form = useForm<CreateIrsApplicationDTO>({
    resolver: (values, context, options) => {
      const isDataNull = !profileData
      const dynamicSchema = IrsAppealDtoSchema.superRefine((data: any, ctx: any) => {
        if (isDataNull) {
          if (!data.file1Path)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file1Path'] })
          if (!data.file1ExpiryDate)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file1ExpiryDate'] })
          if (!data.file2Path)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file2Path'] })
          if (!data.file2ExpiryDate)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file2ExpiryDate'] })
          if (!data.file5Path)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file5Path'] })
          if (!data.file5ExpiryDate)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file5ExpiryDate'] })
          if (!data.file15Path)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file15Path'] })
          if (!data.file15ExpiryDate)
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Majburiy maydon!', path: ['file15ExpiryDate'] })
        }
      })
      return zodResolver(dynamicSchema)(values, context, options)
    },
    defaultValues: {
      phoneNumber: '',
      parentOrganization: '',
      supervisorName: '',
      supervisorPosition: '',
      supervisorStatus: '',
      supervisorEducation: '',
      supervisorPhoneNumber: '',
      division: '',
      identifierType: undefined, // Enum
      symbol: '',
      sphere: '',
      factoryNumber: '',
      serialNumber: '',
      activity: undefined, // Number
      type: '',
      category: undefined, // Enum
      country: '',
      manufacturedAt: '', // String (date)
      acceptedFrom: '',
      acceptedAt: '', // String (date)
      isValid: true, // Boolean
      usageType: undefined, // Enum
      storageLocation: '',
      file1Path: undefined,
      file1ExpiryDate: undefined,
      file2Path: undefined,
      file2ExpiryDate: undefined,
      file5Path: undefined,
      file5ExpiryDate: undefined,
      file15Path: undefined,
      file15ExpiryDate: undefined,
      regionId: '',
      districtId: '',
      address: '',
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

  const irsIdentifierTypeOptions = useMemo(
    () =>
      getSelectOptions(
        Object.values(IrsIdentifierType).map((val) => ({
          id: val,
          name: val,
        }))
      ),
    []
  )
  const irsCategoryOptions = useMemo(
    () =>
      getSelectOptions(
        Object.values(IrsCategory).map((val) => ({
          id: val,
          name: val,
        }))
      ),
    []
  )
  const irsUsageTypeOptions = useMemo(
    () =>
      getSelectOptions([
        { id: IrsUsageType.USAGE, name: 'Ishlatish (foydalanish) uchun' },
        { id: IrsUsageType.DISPOSAL, name: 'Ko‘mish uchun' },
        { id: IrsUsageType.EXPORT, name: 'Chet-elga olib chiqish uchun' },
        { id: IrsUsageType.STORAGE, name: 'Vaqtinchalik saqlash uchun' },
      ]),
    []
  )
  const irsStatusOptions = useMemo(
    () => [
      { id: 'true', name: 'Aktiv' },
      { id: 'false', name: 'Aktiv emas' },
    ],
    []
  )

  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])

  return {
    form,
    regionOptions,
    districtOptions,
    irsIdentifierTypeOptions,
    irsCategoryOptions,
    irsUsageTypeOptions,
    irsStatusOptions,
    isProfileLoading,
    profileData,
    hasIncompleteOrgFiles:
      !!profileData &&
      !!profileData.files &&
      Object.values(profileData.files).some((f: any) => !f?.path || !f?.expiryDate),
  }
}
