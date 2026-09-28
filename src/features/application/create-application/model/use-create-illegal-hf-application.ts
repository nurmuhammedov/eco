import { useLegalOrganizationQuery } from '@/shared/api/dictionaries'
import { invalidateRegistryQueries } from '@/shared/lib/query/invalidate-registry'
import { useApplicationFormConstants } from '@/entities/create-application'
import {
  useDistrictSelectQuery,
  useHazardousFacilityTypeDictionarySelect,
  useHazardousFacilityCategoryDictionarySelect,
  useRegionSelectQuery,
} from '@/shared/api/dictionaries'
import { getSelectOptions, getHazardousFacilityTypeOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  RegisterIllegalHfDTO,
  RegisterIllegalHfSchema,
  UpdateIllegalHfBaseSchema,
} from '@/entities/create-application/schemas/register-illegal-hf.schema'
import { checkCategoryMode } from '@/entities/create-application/schemas/register-hf.schema'
import { hfFilesToForm } from '@/entities/create-application/schemas/hf-appeal-files'
import { HF_CATEGORY_MODE } from '@/features/application/create-application/ui/forms/parts/hf-category-files-section'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'
import { type OwnerData, useOwnerLookup } from './use-owner-lookup'
import type { HfDetail } from './hf-detail'
import { latinOrEmpty } from './edit-values'

type HfDraft = FormDraft<typeof RegisterIllegalHfSchema>

export const useRegisterIllegalHf = (externalSubmit?: (data: RegisterIllegalHfDTO & { legalTin?: string }) => void) => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')
  const isUpdate = !!type && !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const ownerLookup = useOwnerLookup({ legalOnly: true })
  const form = useForm<HfDraft, unknown, RegisterIllegalHfDTO>({
    resolver: zodFormResolver<HfDraft, RegisterIllegalHfDTO>(
      isUpdate
        ? // An edit already knows the applicant, and the relaxed file set drops
          // the identification card and the fee receipt the registration holds.
          UpdateIllegalHfBaseSchema.extend({
            phoneNumber: z
              .string()
              .optional()
              .nullable()
              .transform((val) => (val ? val : null)),
            identity: z
              .string()
              .optional()
              .nullable()
              .transform((val) => (val ? val : null)),
            managerCount: z
              .string({ required_error: FORM_ERROR_MESSAGES.required })
              .regex(/^\d+$/, { message: FORM_ERROR_MESSAGES.invalid })
              .min(1, FORM_ERROR_MESSAGES.required),
            engineerCount: z
              .string({ required_error: FORM_ERROR_MESSAGES.required })
              .regex(/^\d+$/, { message: FORM_ERROR_MESSAGES.invalid })
              .min(1, FORM_ERROR_MESSAGES.required),
            workerCount: z
              .string({ required_error: FORM_ERROR_MESSAGES.required })
              .regex(/^\d+$/, { message: FORM_ERROR_MESSAGES.invalid })
              .min(1, FORM_ERROR_MESSAGES.required),
          }).superRefine(checkCategoryMode)
        : RegisterIllegalHfSchema
    ),
    defaultValues: {
      identity: '',
      phoneNumber: '',
      upperOrganization: '',
      name: '',
      categoryId: undefined,
      hfTypeId: undefined,
      spheres: [],
      regionId: '',
      districtId: '',
      address: '',
      location: '',
      extraArea: '',
      hazardousSubstance: '',
      hazardousSign: undefined,
      legalType: undefined,
      cadastreNumber: '',
      startedDate: undefined,
      categoryMode: undefined,
      multiCategoryIds: [],
      hfAppealFilesDto: {},
    },
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<HfDetail>(`/hf/`, id, !!id)
  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/hf/', id, 'put')

  const ownerIdentity = (detail?.ownerIdentity ? detail?.ownerIdentity?.toString() : null) || tin
  const regionId = form.watch('regionId')
  const { spheres } = useApplicationFormConstants()

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(regionId)
  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()
  const { data: hazardousFacilityCategories } = useHazardousFacilityCategoryDictionarySelect()

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useLegalOrganizationQuery(ownerIdentity)

  const currentOwnerData: OwnerData | null | undefined = isUpdate ? fetchedOwnerData : ownerLookup.owner
  const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

  useEffect(() => {
    if (detail && isUpdate) {
      form.reset({
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        phoneNumber: detail.phoneNumber || '',
        upperOrganization: latinOrEmpty(detail.upperOrganization || ''),
        name: latinOrEmpty(detail.name || ''),
        categoryId: detail.categoryId ? String(detail.categoryId) : undefined,
        hfTypeId:
          detail.hfTypeName && ['3.1', '3.2', '3.3'].includes(detail.hfTypeName)
            ? detail.hfTypeId
              ? String(detail.hfTypeId)
              : undefined
            : undefined,
        spheres: detail.spheres || [],
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: latinOrEmpty(detail.address || ''),
        location: latinOrEmpty(detail.location || ''),
        extraArea: latinOrEmpty(detail.extraArea || ''),
        hazardousSubstance: latinOrEmpty(detail.hazardousSubstance || ''),
        hazardousSign: detail.hazardousSign || undefined,
        legalType: detail.legalType || undefined,
        cadastreNumber: latinOrEmpty(detail.cadastreNumber || ''),
        startedDate: parseDate(detail.startedDate),
        categoryMode: detail.multiCategoryIds?.length ? HF_CATEGORY_MODE.MULTI : HF_CATEGORY_MODE.SINGLE,
        multiCategoryIds: detail.multiCategoryIds?.map(String) || [],
        hfAppealFilesDto: hfFilesToForm(detail),
        managerCount: detail.managerCount ? detail.managerCount.toString() : '',
        engineerCount: detail.engineerCount ? detail.engineerCount.toString() : '',
        workerCount: detail.workerCount ? detail.workerCount.toString() : '',
      })

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form, isUpdate])

  const handleSearch = () => {
    const identity = form.getValues('identity')?.trim()

    if (!ownerLookup.search(identity)) {
      form.trigger('identity')
    }
  }

  const handleClear = () => {
    ownerLookup.clear()
    form.setValue('identity', '')
  }

  const handleSubmit = (data: RegisterIllegalHfDTO) => {
    if (isUpdate) {
      // The update endpoint takes the attachment map under its own name; the
      // registration one still reads hfAppealFilesDto.
      const { hfAppealFilesDto, ...rest } = data

      updateMutate(
        { ...rest, categoryFilesDto: hfAppealFilesDto },
        {
          onSuccess: () => {
            invalidateRegistryQueries(queryClient)
            toast.success('So‘rov mas’ul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!')
            navigate(-1)
          },
        }
      )
    } else {
      if (externalSubmit) {
        externalSubmit({ ...data, legalTin: data.identity })
      }
    }
  }

  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const hazardousFacilityTypeOptions = useMemo(
    () => getHazardousFacilityTypeOptions(hazardousFacilityTypes || []),
    [hazardousFacilityTypes]
  )
  const hazardousFacilityCategoryOptions = useMemo(
    () => getSelectOptions(hazardousFacilityCategories || []),
    [hazardousFacilityCategories]
  )

  return {
    form,
    isUpdate,
    spheres,
    regionOptions,
    districtOptions,
    hazardousFacilityTypeOptions,
    hazardousFacilityCategoryOptions,
    ownerData: currentOwnerData,
    detail,
    isLoading: isDetailLoading || isOwnerLoading,
    isSearchLoading: ownerLookup.isSearching,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
