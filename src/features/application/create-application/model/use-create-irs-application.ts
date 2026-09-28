import { CreateIrsApplicationDTO, IrsAppealDtoSchema } from '@/entities/create-application'
import { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums'
import { useDistrictSelectQuery, useRegionSelectQuery } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useRadiationProfileCheck } from '@/shared/api/radiation-profile/use-radiation-profile-check'
import { useAuth } from '@/shared/hooks/use-auth'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { fillFromProfile, requireProfileFiles } from './radiation-profile-files'

const PROFILE_FILE_FIELDS = [
  'file17Path',
  'file2Path',
  'file2ExpiryDate',
  'file5Path',
  'file5ExpiryDate',
  'file15Path',
  'file15ExpiryDate',
] as const

export const useCreateIrsApplication = () => {
  const { user } = useAuth()
  const userTin = user?.tinOrPin?.toString()
  const { data: profileData, isLoading: isProfileLoading } = useRadiationProfileCheck(userTin, 'IRS')

  const formSchema = profileData ? IrsAppealDtoSchema : requireProfileFiles(IrsAppealDtoSchema, PROFILE_FILE_FIELDS)

  const form = useForm<FormDraft<typeof IrsAppealDtoSchema>, unknown, CreateIrsApplicationDTO>({
    resolver: zodFormResolver<FormDraft<typeof IrsAppealDtoSchema>, CreateIrsApplicationDTO>(formSchema),
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
      manufacturedAt: undefined,
      acceptedFrom: '',
      acceptedAt: undefined,
      isValid: true, // Boolean
      usageType: undefined, // Enum
      storageLocation: '',
      file17Path: undefined,
      file18Path: undefined,
      file18ExpiryDate: undefined,
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
    if (profileData?.files) fillFromProfile(form.setValue, profileData.files)
  }, [profileData, form])

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(regionId)

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
      (!profileData.files.file17Path?.path ||
        !profileData.files.file2Path?.path ||
        !profileData.files.file2Path?.expiryDate ||
        !profileData.files.file5Path?.path ||
        !profileData.files.file5Path?.expiryDate ||
        !profileData.files.file15Path?.path ||
        !profileData.files.file15Path?.expiryDate),
  }
}
