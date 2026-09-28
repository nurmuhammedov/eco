import { useLegalOrganizationQuery } from '@/shared/api/dictionaries'
import { invalidateRegistryQueries } from '@/shared/lib/query/invalidate-registry'
import { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums'
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
import { irsRefinement, RegisterIllegalIrsBaseSchema } from '@/entities/create-application'
import {
  RegisterIllegalIrsDTO,
  RegisterIllegalIrsSchema,
} from '@/entities/create-application/schemas/register-illegal-irs.schema'
import { useRadiationProfileCheck } from '@/shared/api/radiation-profile/use-radiation-profile-check'
import { type OwnerData, useOwnerLookup } from './use-owner-lookup'
import type { IrsDetail } from './radiation-detail'
import { asUpdatePayload, KEPT_OWNER_BIRTH_DATE, latinOrEmpty, withoutBlanks } from './edit-values'
import { fillFromProfile, hasIncompleteFiles, requireProfileFiles, withProfileFiles } from './radiation-profile-files'

type IrsDraft = FormDraft<typeof RegisterIllegalIrsSchema>

const PROFILE_FILE_FIELDS = [
  'file1Path',
  'file1ExpiryDate',
  'file2Path',
  'file2ExpiryDate',
  'file5Path',
  'file5ExpiryDate',
  'file15Path',
  'file15ExpiryDate',
] as const

export const useRegisterIllegalIrs = (
  externalSubmit?: (data: RegisterIllegalIrsDTO & { legalTin?: string }) => void
) => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')
  const isUpdate = !!type && !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const ownerLookup = useOwnerLookup({ type: 'IRS' })

  const { data: detail, isLoading: isDetailLoading } = useDetail<IrsDetail>(`/irs/`, id, !!id)
  const ownerIdentity = detail?.legalTin?.toString() || tin
  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useLegalOrganizationQuery(ownerIdentity)

  const currentOwnerData: OwnerData | null | undefined = isUpdate ? fetchedOwnerData : ownerLookup.owner
  const identityForProfile = String(currentOwnerData?.tin || currentOwnerData?.pin || '') || ownerIdentity

  const { data: profileData, isLoading: isProfileLoading } = useRadiationProfileCheck(
    isUpdate || currentOwnerData ? identityForProfile : null,
    'IRS'
  )

  const isDataNull = !profileData
  const hasIncompleteOrgFiles = !isUpdate && hasIncompleteFiles(profileData?.files)

  const formSchema = isUpdate
    ? RegisterIllegalIrsBaseSchema.extend({
        passportPath: z.string().optional().nullable(),
        phoneNumber: z.string().optional().nullable(),
        identity: z.string().optional().nullable(),
        birthDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
      }).superRefine(irsRefinement)
    : isDataNull
      ? requireProfileFiles(RegisterIllegalIrsSchema, PROFILE_FILE_FIELDS)
      : RegisterIllegalIrsSchema
  const resolveForm = zodFormResolver<IrsDraft, RegisterIllegalIrsDTO>(formSchema)

  const form = useForm<IrsDraft, unknown, RegisterIllegalIrsDTO>({
    resolver: (values, context, options) => resolveForm(isUpdate ? withoutBlanks(values) : values, context, options),
    defaultValues: {
      phoneNumber: '',
      identity: '',
      parentOrganization: '',
      supervisorName: '',
      supervisorPosition: '',
      supervisorStatus: '',
      supervisorEducation: '',
      supervisorPhoneNumber: '',
      division: '',
      identifierType: undefined,
      symbol: '',
      sphere: '',
      factoryNumber: '',
      serialNumber: '',
      activity: undefined,
      type: '',
      category: undefined,
      country: '',
      manufacturedAt: undefined,
      acceptedFrom: '',
      acceptedAt: undefined,
      isValid: true,
      usageType: undefined,
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
      birthDate: undefined,
    },
    mode: 'onChange',
  })

  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/irs/', id, 'put')

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
        parentOrganization: latinOrEmpty(detail.parentOrganization || ''),
        supervisorName: latinOrEmpty(detail.supervisorName || ''),
        supervisorPosition: latinOrEmpty(detail.supervisorPosition || ''),
        supervisorStatus: latinOrEmpty(detail.supervisorStatus || ''),
        supervisorEducation: latinOrEmpty(detail.supervisorEducation || ''),
        supervisorPhoneNumber: detail.supervisorPhoneNumber || '',
        division: latinOrEmpty(detail.division || ''),
        identifierType: detail.identifierType ?? undefined,
        symbol: latinOrEmpty(detail.symbol || ''),
        sphere: latinOrEmpty(detail.sphere || ''),
        factoryNumber: latinOrEmpty(detail.factoryNumber || ''),
        serialNumber: latinOrEmpty(detail.serialNumber || ''),
        activity: detail.activity ?? undefined,
        type: latinOrEmpty(detail.type || ''),
        category: detail.category ?? undefined,
        country: latinOrEmpty(detail.country || ''),
        manufacturedAt: parseDate(detail.manufacturedAt),
        acceptedFrom: latinOrEmpty(detail.acceptedFrom || ''),
        acceptedAt: parseDate(detail.acceptedAt),
        isValid: detail.isValid ?? undefined,
        usageType: detail.usageType ?? undefined,
        storageLocation: latinOrEmpty(detail.storageLocation || ''),
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: latinOrEmpty(detail.address || ''),
        file1Path: detail.files?.file1Path?.path,
        file1ExpiryDate: parseDate(detail.files?.file1Path?.expiryDate),
        file2Path: detail.files?.file2Path?.path,
        file2ExpiryDate: parseDate(detail.files?.file2Path?.expiryDate),
        file5Path: detail.files?.file5Path?.path,
        file5ExpiryDate: parseDate(detail.files?.file5Path?.expiryDate),
        file15Path: detail.files?.file15Path?.path,
        file15ExpiryDate: parseDate(detail.files?.file15Path?.expiryDate),
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

  const handleSubmit = (validated: RegisterIllegalIrsDTO) => {
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

  return {
    form,
    isUpdate,
    regionOptions,
    districtOptions,
    irsIdentifierTypeOptions,
    irsCategoryOptions,
    irsUsageTypeOptions,
    irsStatusOptions,
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
