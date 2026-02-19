import {
  escalatorRefinement,
  RegisterIllegalEscalatorBaseSchema,
  RegisterIllegalEscalatorDTO,
  RegisterIllegalEscalatorSchema,
} from '@/entities/create-application'
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
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getHfoByTinSelect } from '@/entities/expertise/api/expertise.api'
import { QK_REGISTRY } from '@/shared/constants/query-keys'
import { toast } from 'sonner'
import { z } from 'zod'

export const useRegisterIllegalEscalator = (externalSubmit?: (data: RegisterIllegalEscalatorDTO) => void) => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const tin = searchParams.get('tin')
  const isUpdate = !!id && !!tin
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [manualOwnerData, setManualOwnerData] = useState<any>(null)
  const [isManualSearchLoading, setIsManualSearchLoading] = useState(false)

  const formSchema = isUpdate
    ? RegisterIllegalEscalatorBaseSchema.extend({
        // Dates
        partialCheckDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        fullCheckDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        expertiseExpiryDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        nextFullCheckDate: z
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
        assignmentDecreePath: z
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
        expertisePath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val : null)),
        fullCheckPath: z
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
      }).superRefine(escalatorRefinement)
    : RegisterIllegalEscalatorSchema

  const form = useForm<RegisterIllegalEscalatorDTO>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      identity: '',
      hazardousFacilityId: undefined,
      childEquipmentId: '',
      factoryNumber: '',
      regionId: '',
      districtId: '',
      address: '',
      model: '',
      factory: '',
      location: '',
      manufacturedAt: undefined,
      partialCheckDate: undefined,
      fullCheckDate: undefined,
      passengersPerMinute: '',
      length: '',
      speed: '',
      height: '',
      labelPath: undefined,
      saleContractPath: undefined,
      equipmentCertPath: undefined,
      assignmentDecreePath: undefined,
      expertisePath: undefined,
      expertiseExpiryDate: undefined,
      installationCertPath: undefined,
      passportPath: undefined,
      fullCheckPath: undefined,
      nextFullCheckDate: undefined,
    },
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/equipments/`, id, !!id)

  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/equipments/escalator/', id)

  const { mutateAsync: individualMutateAsync, isPending: isIndividualPending } = useAdd<any, any, any>(
    '/integration/iip/individual'
  )

  const ownerIdentity = detail?.ownerIdentity || tin
  const regionId = form.watch('regionId')
  const identity = form.watch('identity')
  const isLegal = identity?.length === 9

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: childEquipmentTypes } = useChildEquipmentTypes('ESCALATOR')

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['owner-data', ownerIdentity],
    queryFn: async () => {
      if (!ownerIdentity) return null
      if (ownerIdentity.length === 9) {
        const res = await apiClient.get<any>('/users/legal/' + ownerIdentity)
        return res.data?.data
      }
      if (ownerIdentity.length === 14 && detail?.birthDate) {
        const res = await apiClient.post<any>('/integration/iip/individual', {
          pin: ownerIdentity,
          birthDate: detail.birthDate,
        })
        return res.data?.data
      }
      return null
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
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        birthDate: isUpdate ? '1900-01-01' : parseDate(detail.birthDate),
        hazardousFacilityId: detail.hfId,
        childEquipmentId: detail.childEquipmentId ? String(detail.childEquipmentId) : '',
        factoryNumber: getValue(detail.factoryNumber || ''),
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: getValue(detail.address || ''),
        model: getValue(detail.model || ''),
        factory: getValue(detail.factory || ''),
        location: getValue(detail.location || ''),
        manufacturedAt: parseDate(detail.manufacturedAt),
        partialCheckDate: parseDate(detail.partialCheckDate),
        fullCheckDate: parseDate(detail.fullCheckDate),
        passengersPerMinute: getValue(detail.parameters?.passengersPerMinute || ''),
        length: getValue(detail.parameters?.length || ''),
        speed: getValue(detail.parameters?.speed || ''),
        height: getValue(detail.parameters?.height || ''),
        labelPath: detail.files?.labelPath?.path,
        saleContractPath: detail.files?.saleContractPath?.path,
        equipmentCertPath: detail.files?.equipmentCertPath?.path,
        assignmentDecreePath: detail.files?.assignmentDecreePath?.path,
        expertisePath: detail.files?.expertisePath?.path,
        expertiseExpiryDate: parseDate(detail.files?.expertisePath?.expiryDate),
        installationCertPath: detail.files?.installationCertPath?.path,
        fullCheckPath: detail.files?.fullCheckPath?.path,
        passportPath: detail.files?.passportPath?.path,
        nextFullCheckDate: parseDate(detail.files?.fullCheckPath?.expiryDate),
      } as any)

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form, isUpdate])

  const handleSearch = () => {
    const identity = form.getValues('identity')?.trim()
    const birthDate = form.getValues('birthDate')

    if (!identity) return

    if (identity.length === 9) {
      setIsManualSearchLoading(true)
      apiClient
        .post<any>('/integration/iip/legal', { tin: identity })
        .then((res) => setManualOwnerData(res.data?.data))
        .catch(() => setManualOwnerData(null))
        .finally(() => setIsManualSearchLoading(false))
    } else if (identity.length === 14 && birthDate) {
      individualMutateAsync({
        pin: identity,
        birthDate: format(birthDate as unknown as Date, 'yyyy-MM-dd'),
      })
        .then((res) => setManualOwnerData(res.data?.data))
        .catch(() => setManualOwnerData(null))
    } else {
      form.trigger(['identity', 'birthDate'])
    }
  }

  const handleClear = () => {
    setManualOwnerData(null)
    form.setValue('identity', '')
    form.setValue('birthDate', undefined as any)
    form.setValue('hazardousFacilityId', undefined as any)
  }

  const handleSubmit = (data: RegisterIllegalEscalatorDTO) => {
    if (isUpdate) {
      const updatePayload = {
        ...data,
        passportPath: data.passportPath,
      }

      updateMutate(updatePayload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QK_REGISTRY] })
          toast.success('So‘rov masʼul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!')
          navigate(-1)
        },
      })
    } else {
      if (externalSubmit) {
        externalSubmit(data)
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
