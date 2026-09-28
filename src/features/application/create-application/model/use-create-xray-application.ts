import { CreateXrayApplicationDTO, XrayAppealDtoSchema } from '@/entities/create-application'
import { stateService } from '@/entities/create-application/types/enums'
import { useDistrictSelectQuery, useRegionSelectQuery } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useAuth } from '@/shared/hooks/use-auth'
import { useRadiationProfileCheck } from '@/shared/api/radiation-profile/use-radiation-profile-check'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { fillFromProfile, requireProfileFiles } from './radiation-profile-files'

const PROFILE_FILE_FIELDS = [
  'file5Path',
  'file5ExpiryDate',
  'file7Path',
  'file7ExpiryDate',
  'file9Path',
  'file9ExpiryDate',
] as const

export const useCreateXrayApplication = () => {
  const { user } = useAuth()
  const userTin = user?.tinOrPin?.toString()
  const { data: profileData, isLoading: isProfileLoading } = useRadiationProfileCheck(userTin, 'XRAY')

  const formSchema = profileData ? XrayAppealDtoSchema : requireProfileFiles(XrayAppealDtoSchema, PROFILE_FILE_FIELDS)

  const form = useForm<FormDraft<typeof XrayAppealDtoSchema>, unknown, CreateXrayApplicationDTO>({
    resolver: zodFormResolver<FormDraft<typeof XrayAppealDtoSchema>, CreateXrayApplicationDTO>(formSchema),
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
    if (profileData?.files) fillFromProfile(form.setValue, profileData.files)
  }, [profileData, form])

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(regionId)
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
      (!profileData.files.file5Path?.path ||
        !profileData.files.file5Path?.expiryDate ||
        !profileData.files.file7Path?.path ||
        !profileData.files.file7Path?.expiryDate ||
        !profileData.files.file9Path?.path ||
        !profileData.files.file9Path?.expiryDate),
  }
}
