import { invalidateRegistryQueries } from '@/shared/lib/query/invalidate-registry'
import { useApplicationFormConstants } from '@/entities/create-application'
import {
  useDistrictSelectQueries,
  useHazardousFacilityTypeDictionarySelect,
  useHazardousFacilityCategoryDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { apiClient } from '@/shared/api/api-client'
import { getSelectOptions, getHazardousFacilityTypeOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import useAdd from '@/shared/hooks/api/useAdd'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  RegisterIllegalHfDTO,
  RegisterIllegalHfSchema,
  UpdateIllegalHfBaseSchema,
} from '@/entities/create-application/schemas/register-illegal-hf-shcema'
import { checkCategoryMode } from '@/entities/create-application/schemas/register-hf.schema'
import { hfFilesToForm } from '@/entities/create-application/schemas/hf-appeal-files'
import { HF_CATEGORY_MODE } from '@/features/application/create-application/ui/forms/parts/hf-category-files-section'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'

export const useRegisterIllegalHf = (externalSubmit?: (data: any) => void) => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')
  const isUpdate = !!type && !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [manualOwnerData, setManualOwnerData] = useState<any>(null)
  const form = useForm<RegisterIllegalHfDTO>({
    resolver: zodResolver(
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

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/hf/`, id, !!id)
  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/hf/', id, 'put')

  const { mutateAsync: legalMutateAsync, isPending: isLegalPending } = useAdd<any, any, any>('/integration/iip/legal')

  const ownerIdentity = (detail?.ownerIdentity ? detail?.ownerIdentity?.toString() : null) || tin
  const regionId = form.watch('regionId')
  const { spheres } = useApplicationFormConstants()

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()
  const { data: hazardousFacilityCategories } = useHazardousFacilityCategoryDictionarySelect()

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['owner-data', ownerIdentity],
    queryFn: async () => {
      if (!ownerIdentity) return null
      const res = await apiClient.get<any>('/users/legal/' + ownerIdentity)
      return res.data?.data
    },
    enabled: !!ownerIdentity,
  })

  const currentOwnerData = isUpdate ? fetchedOwnerData : manualOwnerData
  const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

  useEffect(() => {
    if (detail && isUpdate) {
      const getValue = (val: any) => (typeof val === 'string' && /[\u0400-\u04FF]/.test(val) ? '' : val)

      form.reset({
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        phoneNumber: detail.phoneNumber || '',
        upperOrganization: getValue(detail.upperOrganization || ''),
        name: getValue(detail.name || ''),
        categoryId: detail.categoryId ? String(detail.categoryId) : undefined,
        hfTypeId:
          detail.hfTypeName && ['3.1', '3.2', '3.3'].includes(detail.hfTypeName)
            ? detail.hfTypeId
              ? String(detail.hfTypeId)
              : undefined
            : undefined,
        spheres: detail.spheres || [],
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: getValue(detail.address || ''),
        location: getValue(detail.location || ''),
        extraArea: getValue(detail.extraArea || ''),
        hazardousSubstance: getValue(detail.hazardousSubstance || ''),
        hazardousSign: detail.hazardousSign || undefined,
        legalType: detail.legalType || undefined,
        cadastreNumber: getValue(detail.cadastreNumber || ''),
        startedDate: parseDate(detail.startedDate),
        categoryMode: detail.multiCategoryIds?.length ? HF_CATEGORY_MODE.MULTI : HF_CATEGORY_MODE.SINGLE,
        multiCategoryIds: detail.multiCategoryIds?.map(String) || [],
        hfAppealFilesDto: hfFilesToForm(detail),
        managerCount: detail.managerCount ? detail.managerCount?.toString() : '',
        engineerCount: detail.engineerCount ? detail.engineerCount?.toString() : '',
        workerCount: detail.workerCount ? detail.workerCount?.toString() : '',
      } as any)

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form, isUpdate])

  const handleSearch = () => {
    const identity = form.getValues('identity')?.trim()

    if (identity && identity.length === 9) {
      legalMutateAsync({ tin: identity })
        .then((res) => setManualOwnerData(res.data?.data || res.data))
        .catch(() => setManualOwnerData(null))
    } else {
      form.trigger('identity')
    }
  }

  const handleClear = () => {
    setManualOwnerData(null)
    form.setValue('identity', '')
  }

  const handleSubmit = (data: RegisterIllegalHfDTO) => {
    if (isUpdate) {
      updateMutate(data, {
        onSuccess: () => {
          invalidateRegistryQueries(queryClient)
          toast.success('So‘rov masʼul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!')
          navigate(-1)
        },
      })
    } else {
      if (externalSubmit) {
        externalSubmit({ ...data, legalTin: data?.identity })
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
    isSearchLoading: isLegalPending,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
