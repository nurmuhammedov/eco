import { z } from 'zod'
import { useChildEquipmentTypes, useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { apiClient } from '@/shared/api/api-client'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import useAdd from '@/shared/hooks/api/useAdd'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getHfoByTinSelect } from '@/entities/expertise/api/expertise.api'
import { QK_REGISTRY } from '@/shared/constants/query-keys'
import { toast } from 'sonner'
import {
  CreateIllegalOilContainerApplicationDTO,
  IllegalOilContainerAppealDtoSchema,
} from '@/entities/create-application'

export const useRegisterIllegalOilContainer = (
  externalSubmit?: (data: CreateIllegalOilContainerApplicationDTO) => void
) => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')
  const isUpdate = !!type && !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [manualOwnerData, setManualOwnerData] = useState<any>(null)
  const [isManualSearchLoading, setIsManualSearchLoading] = useState(false)

  const formSchema = isUpdate
    ? IllegalOilContainerAppealDtoSchema.extend({
        // Dates
        nonDestructiveCheckDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        expertiseExpiryDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        // Paths
        labelPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val : null)),
        saleContractPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val : null)),
        equipmentCertPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val : null)),
        assignmentDecreePath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val : null)),
        expertisePath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val : null)),
        installationCertPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val : null)),
        passportPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val : null)),
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
        birthDate: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val : null)),
      })
    : IllegalOilContainerAppealDtoSchema

  const form = useForm<CreateIllegalOilContainerApplicationDTO>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      hazardousFacilityId: undefined,
      childEquipmentId: undefined,
      regionId: '',
      districtId: '',
      address: '',
      location: '',
      capacity: '',
      nonDestructiveCheckDate: undefined,
      labelPath: undefined,
      saleContractPath: undefined,
      equipmentCertPath: undefined,
      assignmentDecreePath: undefined,
      expertisePath: undefined,
      expertiseExpiryDate: undefined,
      installationCertPath: undefined,
      passportPath: undefined,
    } as any,
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/equipments/`, id, !!id)

  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/equipments/oil-container/', id)

  const { mutateAsync: individualMutateAsync, isPending: isIndividualPending } = useAdd<any, any, any>(
    '/integration/iip/individual'
  )

  const ownerIdentity = (detail?.ownerIdentity ? detail?.ownerIdentity?.toString() : null) || tin
  const regionId = form.watch('regionId')
  // @ts-ignore
  const identity = form.watch('identity' as any) as string // Watch identity even if not in type
  const isLegal = identity?.length === 9

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: childEquipmentTypes } = useChildEquipmentTypes('OIL_CONTAINER')

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['owner-data', ownerIdentity],
    queryFn: async () => {
      const res = await apiClient.get<any>('/users/legal/' + ownerIdentity)
      return res.data?.data
    },
    enabled: !!ownerIdentity,
  })

  const currentOwnerData = isUpdate ? fetchedOwnerData : manualOwnerData

  const { data: hfoOptions } = useQuery({
    queryKey: ['hfoSelect', identity],
    queryFn: () => getHfoByTinSelect(identity),
    enabled: isLegal && !!currentOwnerData,
  })

  const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

  useEffect(() => {
    if (detail && isUpdate) {
      const getValue = (val: any) => (typeof val === 'string' && /[\u0400-\u04FF]/.test(val) ? '' : val)

      form.reset({
        phoneNumber: detail.phoneNumber || '',
        // @ts-ignore
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        // @ts-ignore
        birthDate: isUpdate ? '1900-01-01' : parseDate(detail.birthDate),
        hazardousFacilityId: detail.hfId,
        childEquipmentId: detail.childEquipmentId ? String(detail.childEquipmentId) : undefined,
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: getValue(detail.address || ''),
        location: getValue(detail.location || ''),
        capacity: getValue(detail.parameters?.capacity || ''),
        nonDestructiveCheckDate: parseDate(detail.nonDestructiveCheckDate),

        labelPath: detail.files?.labelPath?.path,
        saleContractPath: detail.files?.saleContractPath?.path,
        equipmentCertPath: detail.files?.equipmentCertPath?.path,
        assignmentDecreePath: detail.files?.assignmentDecreePath?.path,
        expertisePath: detail.files?.expertisePath?.path,
        expertiseExpiryDate: parseDate(detail.files?.expertisePath?.expiryDate),
        installationCertPath: detail.files?.installationCertPath?.path,
        passportPath: detail.files?.passportPath?.path,
      } as any)

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form, isUpdate])

  const handleSearch = () => {
    // @ts-ignore
    const identity = form.getValues('identity')?.trim()
    const birthDate = form.getValues('birthDate')

    if (!identity) return

    if (identity.length === 9) {
      setIsManualSearchLoading(true)
      apiClient
        .post<any>('/integration/iip/legal', { tin: identity })
        .then((res) => setManualOwnerData(res.data?.data || res.data))
        .catch(() => setManualOwnerData(null))
        .finally(() => setIsManualSearchLoading(false))
    } else if (identity.length === 14 && birthDate) {
      individualMutateAsync({
        pin: identity,
        birthDate: format(birthDate as unknown as Date, 'yyyy-MM-dd'),
      })
        .then((res) => setManualOwnerData(res.data?.data || res.data))
        .catch(() => setManualOwnerData(null))
    } else {
      form.trigger(['identity', 'birthDate'] as any)
    }
  }

  const handleClear = () => {
    setManualOwnerData(null)
    // @ts-ignore
    form.setValue('identity', '')
    // @ts-ignore
    form.setValue('birthDate', undefined)
    form.setValue('hazardousFacilityId', undefined as any)
  }

  const handleSubmit = (data: CreateIllegalOilContainerApplicationDTO) => {
    // @ts-ignore
    const identity = form.getValues('identity')
    // @ts-ignore
    const birthDate = form.getValues('birthDate')

    const formattedBirthDate = birthDate ? format(new Date(birthDate), 'yyyy-MM-dd') : undefined

    const payload = {
      ...data,
      identity,
      birthDate: formattedBirthDate,
    }

    if (isUpdate) {
      updateMutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QK_REGISTRY] })
          toast.success('So‘rov masʼul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!')
          navigate(-1)
        },
      })
    } else {
      if (externalSubmit) {
        externalSubmit(payload as any)
      }
    }
  }

  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const childEquipmentOptions = useMemo(() => getSelectOptions(childEquipmentTypes || []), [childEquipmentTypes])
  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hfoOptions || []), [hfoOptions])

  return {
    form,
    isUpdate,
    regionOptions,
    districtOptions,
    childEquipmentOptions,
    hazardousFacilitiesOptions,
    ownerData: currentOwnerData,
    detail,
    isLoading: isDetailLoading || isOwnerLoading,
    isSearchLoading: isIndividualPending || isManualSearchLoading,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
