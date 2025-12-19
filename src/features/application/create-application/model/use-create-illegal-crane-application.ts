import {
  craneRefinement,
  RegisterIllegalCraneBaseSchema,
  RegisterIllegalCraneDTO,
  RegisterIllegalCraneSchema,
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

export const useRegisterIllegalCrane = (externalSubmit?: (data: RegisterIllegalCraneDTO) => void) => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const tin = searchParams.get('tin')
  const isUpdate = !!id && !!tin
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [manualOwnerData, setManualOwnerData] = useState<any>(null)

  const formSchema = isUpdate
    ? RegisterIllegalCraneBaseSchema.extend({
        phoneNumber: z.string().optional(),
        birthDate: z.string().optional(),
      }).superRefine(craneRefinement)
    : RegisterIllegalCraneSchema

  const form = useForm<RegisterIllegalCraneDTO>({
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
      boomLength: '',
      liftingCapacity: '',
      labelPath: undefined,
      saleContractPath: undefined,
      equipmentCertPath: undefined,
      assignmentDecreePath: undefined,
      expertisePath: undefined,
      expertiseExpiryDate: undefined,
      installationCertPath: undefined,
      additionalFilePath: undefined,
      partialCheckPath: undefined,
      nextPartialCheckDate: undefined,
      fullCheckPath: undefined,
      nextFullCheckDate: undefined,
    },
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/equipments/`, id, isUpdate)

  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/equipments/crane/', id)

  const { mutateAsync: legalMutateAsync, isPending: isLegalPending } = useAdd<any, any, any>('/integration/iip/legal')
  const { mutateAsync: individualMutateAsync, isPending: isIndividualPending } = useAdd<any, any, any>(
    '/integration/iip/individual'
  )

  const regionId = form.watch('regionId')
  const identity = form.watch('identity')
  const isLegal = identity?.length === 9

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: childEquipmentTypes } = useChildEquipmentTypes('CRANE')

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['owner-data', tin],
    queryFn: async () => {
      if (!tin) return null
      if (tin.length === 9) {
        const res = await apiClient.post<any>('/integration/iip/legal', { tin })
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

  const { data: hfoOptions } = useQuery({
    queryKey: ['hfoSelect', identity],
    queryFn: () => getHfoByTinSelect(identity),
    enabled: isLegal && !!currentOwnerData,
  })

  const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

  useEffect(() => {
    if (detail && isUpdate) {
      form.reset({
        phoneNumber: detail.phoneNumber || '',
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        birthDate: isUpdate ? '1900-01-01' : parseDate(detail.birthDate),
        hazardousFacilityId: detail.hfId,
        childEquipmentId: detail.childEquipmentId ? String(detail.childEquipmentId) : '',
        factoryNumber: detail.factoryNumber || '',
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: detail.address || '',
        model: detail.model || '',
        factory: detail.factory || '',
        location: detail.location || '',
        boomLength: detail.parameters?.boomLength || '',
        liftingCapacity: detail.parameters?.liftingCapacity || '',
        manufacturedAt: parseDate(detail.manufacturedAt),
        partialCheckDate: parseDate(detail.partialCheckDate),
        fullCheckDate: parseDate(detail.fullCheckDate),

        labelPath: detail.files?.labelPath?.path,
        saleContractPath: detail.files?.saleContractPath?.path,
        equipmentCertPath: detail.files?.equipmentCertPath?.path,
        assignmentDecreePath: detail.files?.assignmentDecreePath?.path,
        expertisePath: detail.files?.expertisePath?.path,
        expertiseExpiryDate: parseDate(detail.files?.expertisePath?.expiryDate),
        installationCertPath: detail.files?.installationCertPath?.path,
        partialCheckPath: detail.files?.partialCheckPath?.path,
        fullCheckPath: detail.files?.fullCheckPath?.path,
        additionalFilePath: detail.files?.passportPath?.path,
        nextPartialCheckDate: parseDate(detail.files?.partialCheckPath?.expiryDate),
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
      legalMutateAsync({ tin: identity })
        .then((res) => setManualOwnerData(res.data))
        .catch(() => setManualOwnerData(null))
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
    form.setValue('hazardousFacilityId', undefined as any)
  }

  const handleSubmit = (data: RegisterIllegalCraneDTO) => {
    if (isUpdate) {
      const updatePayload = {
        ...data,
        passportPath: data.additionalFilePath,
      }

      updateMutate(updatePayload, {
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
    isLoading: isDetailLoading || isOwnerLoading,
    isSearchLoading: isLegalPending || isIndividualPending,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
