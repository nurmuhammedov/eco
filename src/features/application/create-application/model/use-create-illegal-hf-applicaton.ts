import { applicationFormConstants } from '@/entities/create-application'
import {
  useDistrictSelectQueries,
  useHazardousFacilityTypeDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { apiClient } from '@/shared/api/api-client'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import useAdd from '@/shared/hooks/api/useAdd'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { QK_REGISTRY } from '@/shared/constants/query-keys'
import { toast } from 'sonner'
import {
  RegisterIllegalHfDTO,
  RegisterIllegalHfSchema,
} from '@/entities/create-application/schemas/register-illegal-hf-shcema'
import z from 'zod'

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
        ? RegisterIllegalHfSchema.extend({
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
              .string({ required_error: 'Majburiy maydon!' })
              .regex(/^\d+$/, { message: 'Faqat raqamlar kiritilishi kerak!' })
              .min(1, 'Majburiy maydon!'),
            engineerCount: z
              .string({ required_error: 'Majburiy maydon!' })
              .regex(/^\d+$/, { message: 'Faqat raqamlar kiritilishi kerak!' })
              .min(1, 'Majburiy maydon!'),
            workerCount: z
              .string({ required_error: 'Majburiy maydon!' })
              .regex(/^\d+$/, { message: 'Faqat raqamlar kiritilishi kerak!' })
              .min(1, 'Majburiy maydon!'),
          })
        : RegisterIllegalHfSchema
    ),
    defaultValues: {
      identity: '',
      phoneNumber: '',
      upperOrganization: '',
      name: '',
      hfTypeId: undefined,
      spheres: [],
      regionId: '',
      districtId: '',
      address: '',
      location: '',
      extraArea: '',
      hazardousSubstance: '',
      identificationCardPath: undefined,
      receiptPath: undefined,
      insurancePolicyPath: undefined,
      insurancePolicyExpiryDate: undefined,
      cadastralPassportPath: undefined,
      projectDocumentationPath: undefined,
      licensePath: undefined,
      licenseExpiryDate: undefined,
      expertOpinionPath: undefined,
      appointmentOrderPath: undefined,
      permitPath: undefined,
      permitExpiryDate: undefined,
      industrialSafetyDeclarationPath: undefined,
      regulationPath: undefined,
      regulationExpiryDate: undefined,
      staffAttestationPath: undefined,
      staffAttestationExpiryDate: undefined,
      managerAttestationPath: undefined,
      managerAttestationExpiryDate: undefined,
    },
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/hf/`, id, !!id)
  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/hf/', id, 'put')

  const { mutateAsync: legalMutateAsync, isPending: isLegalPending } = useAdd<any, any, any>('/integration/iip/legal')

  const ownerIdentity = (detail?.ownerIdentity ? detail?.ownerIdentity?.toString() : null) || tin
  const regionId = form.watch('regionId')
  const { spheres } = applicationFormConstants()

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

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
        hfTypeId: detail.hfTypeId ? String(detail.hfTypeId) : undefined,
        spheres: detail.spheres || [],
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: getValue(detail.address || ''),
        location: getValue(detail.location || ''),
        extraArea: getValue(detail.extraArea || ''),
        hazardousSubstance: getValue(detail.hazardousSubstance || ''),
        identificationCardPath: detail.files?.identificationCardPath?.path,
        receiptPath: detail.files?.receiptPath?.path,
        insurancePolicyPath: detail.files?.insurancePolicyPath?.path,
        insurancePolicyExpiryDate: parseDate(detail.files?.insurancePolicyPath?.expiryDate),
        cadastralPassportPath: detail.files?.cadastralPassportPath?.path,
        projectDocumentationPath: detail.files?.projectDocumentationPath?.path,
        licensePath: detail.files?.licensePath?.path,
        licenseExpiryDate: parseDate(detail.files?.licensePath?.expiryDate),
        expertOpinionPath: detail.files?.expertOpinionPath?.path,
        appointmentOrderPath: detail.files?.appointmentOrderPath?.path,
        permitPath: detail.files?.permitPath?.path,
        permitExpiryDate: parseDate(detail.files?.permitPath?.expiryDate),
        industrialSafetyDeclarationPath: detail.files?.industrialSafetyDeclarationPath?.path,
        regulationPath: detail.files?.regulationPath?.path,
        regulationExpiryDate: parseDate(detail.files?.regulationPath?.expiryDate),
        staffAttestationPath: detail.files?.staffAttestationPath?.path,
        staffAttestationExpiryDate: parseDate(detail.files?.staffAttestationPath?.expiryDate),
        managerAttestationPath: detail.files?.managerAttestationPath?.path,
        managerAttestationExpiryDate: parseDate(detail.files?.managerAttestationPath?.expiryDate),
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
          queryClient.invalidateQueries({ queryKey: [QK_REGISTRY] })
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
    () => getSelectOptions(hazardousFacilityTypes || []),
    [hazardousFacilityTypes]
  )

  return {
    form,
    isUpdate,
    spheres,
    regionOptions,
    districtOptions,
    hazardousFacilityTypeOptions,
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
