import { useLegalOrganizationQuery } from '@/shared/api/dictionaries'
import { invalidateRegistryQueries } from '@/shared/lib/query/invalidate-registry'
import {
  RegisterIllegalXrayBaseSchema,
  RegisterIllegalXrayDTO,
  RegisterIllegalXraySchema,
  xrayRefinement,
} from '@/entities/create-application'
import { stateService } from '@/entities/create-application/types/enums'
import { useDistrictSelectQuery, useRegionSelectQuery } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { format } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { useRadiationProfileCheck } from '@/shared/api/radiation-profile/use-radiation-profile-check'
import { type OwnerData, useOwnerLookup } from './use-owner-lookup'
import type { XrayDetail } from './radiation-detail'
import { asUpdatePayload, KEPT_OWNER_BIRTH_DATE, latinOrEmpty, withoutBlanks } from './edit-values'
import { fillFromProfile, hasIncompleteFiles, requireProfileFiles, withProfileFiles } from './radiation-profile-files'

type XrayDraft = FormDraft<typeof RegisterIllegalXraySchema>

const PROFILE_FILE_FIELDS = [
  'file5Path',
  'file5ExpiryDate',
  'file7Path',
  'file7ExpiryDate',
  'file9Path',
  'file9ExpiryDate',
] as const

export const useRegisterIllegalXray = (
  externalSubmit?: (data: RegisterIllegalXrayDTO & { legalTin?: string }) => void
) => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')
  const isUpdate = !!type && !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const ownerLookup = useOwnerLookup({ type: 'XRAY' })

  const { data: detail, isLoading: isDetailLoading } = useDetail<XrayDetail>(`/xrays`, id, !!id)
  const ownerIdentity = detail?.legalTin?.toString() || tin
  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useLegalOrganizationQuery(ownerIdentity)

  const currentOwnerData: OwnerData | null | undefined = isUpdate ? fetchedOwnerData : ownerLookup.owner
  const identityForProfile = String(currentOwnerData?.tin || currentOwnerData?.pin || '') || ownerIdentity

  const { data: profileData, isLoading: isProfileLoading } = useRadiationProfileCheck(
    isUpdate || currentOwnerData ? identityForProfile : null,
    'XRAY'
  )

  const isDataNull = !profileData
  const hasIncompleteOrgFiles = !isUpdate && hasIncompleteFiles(profileData?.files)

  const formSchema = isUpdate
    ? RegisterIllegalXrayBaseSchema.extend({
        file1Path: z.string().optional().nullable(),
        file1ExpiryDate: z.date().optional().nullable(),
        file2Path: z.string().optional().nullable(),
        file2ExpiryDate: z.date().optional().nullable(),
        file3Path: z.string().optional().nullable(),
        file3ExpiryDate: z.date().optional().nullable(),
        file4Path: z.string().optional().nullable(),
        file5Path: z.string().optional().nullable(),
        file5ExpiryDate: z.date().optional().nullable(),
        file6Path: z.string().optional().nullable(),
        file6ExpiryDate: z.date().optional().nullable(),
        file7Path: z.string().optional().nullable(),
        file7ExpiryDate: z.date().optional().nullable(),
        file8Path: z.string().optional().nullable(),
        file8ExpiryDate: z.date().optional().nullable(),
        file9Path: z.string().optional().nullable(),
        file9ExpiryDate: z.date().optional().nullable(),
        file10Path: z.string().optional().nullable(),
        file11Path: z.string().optional().nullable(),
        file11ExpiryDate: z.date().optional().nullable(),
        file12Path: z.string().optional().nullable(),
        file13Path: z.string().optional().nullable(),
        file13ExpiryDate: z.date().optional().nullable(),
        file14Path: z.string().optional().nullable(),
        file14ExpiryDate: z.date().optional().nullable(),
        phoneNumber: z.string().optional().nullable(),
        identity: z.string().optional().nullable(),
        birthDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
      }).superRefine(xrayRefinement)
    : isDataNull
      ? requireProfileFiles(RegisterIllegalXraySchema, PROFILE_FILE_FIELDS)
      : RegisterIllegalXraySchema
  const resolveForm = zodFormResolver<XrayDraft, RegisterIllegalXrayDTO>(formSchema)

  const form = useForm<XrayDraft, unknown, RegisterIllegalXrayDTO>({
    resolver: (values, context, options) => resolveForm(isUpdate ? withoutBlanks(values) : values, context, options),
    defaultValues: {
      phoneNumber: '',
      identity: '',
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
      birthDate: undefined,
    },
    mode: 'onChange',
  })

  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/xrays', id)

  const regionId = form.watch('regionId')
  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(regionId)

  const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

  useEffect(() => {
    if (detail && isUpdate) {
      form.reset({
        phoneNumber: '',
        identity: '',
        birthDate: KEPT_OWNER_BIRTH_DATE,
        licenseNumber: latinOrEmpty(detail.licenseNumber || ''),
        licenseRegistryNumber: latinOrEmpty(detail.licenseRegistryNumber || ''),
        licenseDate: parseDate(detail.licenseDate),
        // XRayResById has no licenseExpiryDate; the key is kept so the edit still sends it as null
        licenseExpiryDate: undefined,
        serialNumber: latinOrEmpty(detail.serialNumber || ''),
        model: latinOrEmpty(detail.model || ''),
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: latinOrEmpty(detail.address || ''),
        manufacturedYear: detail.manufacturedYear ? String(detail.manufacturedYear) : '',
        stateService: detail.stateService ? String(detail.stateService) : '',
        file5Path: detail.files?.file5Path?.path,
        file5ExpiryDate: parseDate(detail.files?.file5Path?.expiryDate),
        file7Path: detail.files?.file7Path?.path,
        file7ExpiryDate: parseDate(detail.files?.file7Path?.expiryDate),
        file9Path: detail.files?.file9Path?.path,
        file9ExpiryDate: parseDate(detail.files?.file9Path?.expiryDate),
        file14Path: detail.files?.file14Path?.path ?? undefined,
        file14ExpiryDate: parseDate(detail.files?.file14Path?.expiryDate),
        file8Path: detail.files?.file8Path?.path ?? undefined,
        file8ExpiryDate: parseDate(detail.files?.file8Path?.expiryDate),
      })

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form, isUpdate])

  useEffect(() => {
    if (profileData?.files) fillFromProfile(form.setValue, profileData.files)
  }, [profileData, form, detail])

  const handleSearch = () => {
    const identity = form.getValues('identity')?.trim()

    if (!identity) return

    if (!ownerLookup.search(identity, form.getValues('birthDate'))) {
      form.trigger(['identity', 'birthDate'])
    }
  }

  const handleClear = () => {
    ownerLookup.clear()
    form.setValue('identity', '')
    form.setValue('birthDate', undefined)
  }

  const handleSubmit = (validated: RegisterIllegalXrayDTO) => {
    const data = withProfileFiles(form.getValues(), validated)

    if (isUpdate) {
      updateMutate(asUpdatePayload(data), {
        onSuccess: () => {
          invalidateRegistryQueries(queryClient)
          toast.success('So‘rov mas’ul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!')
          navigate(-1)
        },
      })
    } else {
      if (externalSubmit) {
        externalSubmit({ ...data, legalTin: data.identity })
      }
    }
  }

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
    isUpdate,
    regionOptions,
    districtOptions,
    stateServiceOptions,
    ownerData: currentOwnerData,
    profileData,
    isProfileLoading,
    isDataNull,
    hasIncompleteOrgFiles,
    detail,
    isLoading: isDetailLoading || isOwnerLoading,
    isSearchLoading: ownerLookup.isSearching,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
