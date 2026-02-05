import {
  RegisterIllegalAttractionBaseSchema,
  RegisterIllegalAttractionDTO,
  RegisterIllegalAttractionSchema,
} from '@/entities/create-application'
import { useChildEquipmentTypes, useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { apiClient } from '@/shared/api/api-client'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import useData from '@/shared/hooks/api/useData'
import useAdd from '@/shared/hooks/api/useAdd'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { QK_REGISTRY } from '@/shared/constants/query-keys'
import { toast } from 'sonner'
import { z } from 'zod'

export const useRegisterIllegalAttraction = (externalSubmit?: (data: RegisterIllegalAttractionDTO) => void) => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const tin = searchParams.get('tin')
  const isUpdate = !!id && !!tin
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [manualOwnerData, setManualOwnerData] = useState<any>(null)
  const [isManualSearchLoading, setIsManualSearchLoading] = useState(false)

  const formSchema = isUpdate
    ? RegisterIllegalAttractionBaseSchema.extend({
        phoneNumber: z
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
    : RegisterIllegalAttractionSchema

  const form = useForm<RegisterIllegalAttractionDTO>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      identity: '',
      attractionName: '',
      childEquipmentId: undefined,
      childEquipmentSortId: undefined,
      factory: '',
      manufacturedAt: undefined,
      acceptedAt: undefined,
      servicePeriod: undefined,
      factoryNumber: '',
      country: '',
      regionId: undefined,
      districtId: undefined,
      address: '',
      location: '',
      riskLevel: undefined,
      passportPath: undefined,
      labelPath: undefined,
      conformityCertPath: undefined,
      technicalJournalPath: undefined,
      servicePlanPath: undefined,
      technicalManualPath: undefined,
      seasonalInspectionPath: undefined,
      seasonalInspectionExpiryDate: undefined,
      seasonalReadinessActPath: undefined,
      seasonalReadinessActExpiryDate: undefined,
      technicalReadinessActPath: undefined,
      employeeSafetyKnowledgePath: undefined,
      employeeSafetyKnowledgeExpiryDate: undefined,
      usageRightsPath: undefined,
      usageRightsExpiryDate: undefined,
      preservationActPath: undefined,
      cctvInstallationPath: undefined,
      qrPath: undefined,
    },
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/equipments/`, id, isUpdate)

  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/equipments/attraction/', id)

  const { mutateAsync: individualMutateAsync, isPending: isIndividualPending } = useAdd<any, any, any>(
    '/integration/iip/individual'
  )

  const regionId = form.watch('regionId')?.toString()
  const childEquipmentId = form.watch('childEquipmentId')

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: attractionNames } = useChildEquipmentTypes('ATTRACTION')
  const { data: attractionSorts } = useData<any[]>(`/child-equipment-sorts/select`, !!childEquipmentId, {
    childEquipmentId,
  })

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['owner-data', tin],
    queryFn: async () => {
      if (!tin) return null
      if (tin.length === 9) {
        const res = await apiClient.get<any>('/users/legal/' + tin)
        return res.data?.data
      }
      if (tin.length === 14 && detail?.birthDate) {
        const res = await apiClient.post<any>('/integration/iip/individual', {
          pin: tin,
          birthDate: detail.birthDate,
        })
        return res.data?.data
      }
      return null
    },
    enabled: isUpdate && !!tin && (tin.length === 9 || (tin.length === 14 && !!detail?.birthDate)),
  })

  const currentOwnerData = isUpdate ? fetchedOwnerData : manualOwnerData

  const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

  useEffect(() => {
    if (detail && isUpdate) {
      form.reset({
        phoneNumber: detail.phoneNumber || '',
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        birthDate: parseDate(detail.birthDate),
        attractionName: detail.attractionName || '',
        childEquipmentId: detail.childEquipmentId,
        childEquipmentSortId: detail.childEquipmentSortId,
        factory: detail.factory || '',
        manufacturedAt: parseDate(detail.manufacturedAt),
        acceptedAt: parseDate(detail.acceptedAt),
        servicePeriod: parseDate(detail.servicePeriod),
        factoryNumber: detail.factoryNumber || '',
        country: detail.country || '',
        regionId: detail.regionId ? String(detail.regionId) : '',
        districtId: detail.districtId,
        address: detail.address || '',
        location: detail.location || '',
        riskLevel: detail.riskLevel || undefined,

        passportPath: detail.files?.passportPath?.path,
        labelPath: detail.files?.labelPath?.path,
        conformityCertPath: detail.files?.conformityCertPath?.path,
        technicalJournalPath: detail.files?.technicalJournalPath?.path,
        servicePlanPath: detail.files?.servicePlanPath?.path,
        technicalManualPath: detail.files?.technicalManualPath?.path,
        seasonalInspectionPath: detail.files?.seasonalInspectionPath?.path,
        seasonalInspectionExpiryDate: parseDate(detail.files?.seasonalInspectionPath?.expiryDate),
        seasonalReadinessActPath: detail.files?.seasonalReadinessActPath?.path,
        seasonalReadinessActExpiryDate: parseDate(detail.files?.seasonalReadinessActPath?.expiryDate),
        technicalReadinessActPath: detail.files?.technicalReadinessActPath?.path,
        employeeSafetyKnowledgePath: detail.files?.employeeSafetyKnowledgePath?.path,
        employeeSafetyKnowledgeExpiryDate: parseDate(detail.files?.employeeSafetyKnowledgePath?.expiryDate),
        usageRightsPath: detail.files?.usageRightsPath?.path,
        usageRightsExpiryDate: parseDate(detail.files?.usageRightsPath?.expiryDate),
        preservationActPath: detail.files?.preservationActPath?.path,
        cctvInstallationPath: detail.files?.cctvInstallationPath?.path,
        qrPath: detail.files?.qrPath?.path,
      } as any)

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? detail.districtId : '')
      }, 500)
    }
  }, [detail, form, isUpdate])

  const handleSearch = () => {
    const identity = form.getValues('identity')?.trim()
    const birthDate = form.getValues('birthDate')

    if (!identity) return

    if (identity.length === 9) {
      setIsManualSearchLoading(true)
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
        .then((res) => setManualOwnerData(res.data))
        .catch(() => setManualOwnerData(null))
    } else {
      form.trigger(['identity', 'birthDate'])
    }
  }

  const handleClear = () => {
    setManualOwnerData(null)
    form.setValue('identity', '')
    form.setValue('birthDate', undefined as any)
  }

  const handleSubmit = (data: RegisterIllegalAttractionDTO) => {
    if (isUpdate) {
      updateMutate(data, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QK_REGISTRY] })
          toast.success('Muvaffaqiyatli saqlandi!')
          navigate(-1)
        },
      })
    } else {
      if (externalSubmit) {
        externalSubmit(data)
      }
    }
  }

  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const attractionNameOptions = useMemo(() => getSelectOptions(attractionNames || []), [attractionNames])
  const attractionSortOptions = useMemo(() => getSelectOptions(attractionSorts || []), [attractionSorts])

  const riskLevels = useMemo(
    () =>
      [
        { label: 'I-yuqori', value: 'I' },
        { label: 'II-o‘rta', value: 'II' },
        { label: 'III-past', value: 'III' },
        { label: 'IV-ahamiyatsiz', value: 'IV' },
      ].map((level) => ({ id: level?.value, name: level?.label })),
    []
  )
  const riskLevelOptions = useMemo(() => getSelectOptions(riskLevels), [riskLevels])

  return {
    form,
    isUpdate,
    regionOptions,
    districtOptions,
    attractionNameOptions,
    attractionSortOptions,
    riskLevelOptions,
    ownerData: currentOwnerData,
    isLoading: isDetailLoading || isOwnerLoading,
    isSearchLoading: isIndividualPending || isManualSearchLoading,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
