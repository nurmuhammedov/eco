import { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { apiClient } from '@/shared/api/api-client'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import useAdd from '@/shared/hooks/api/useAdd'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { QK_REGISTRY } from '@/shared/constants/query-keys'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  RegisterIllegalIrsDTO,
  RegisterIllegalIrsSchema,
} from '@/entities/create-application/schemas/register-illegal-irs.schema'

export const useRegisterIllegalIrs = (externalSubmit?: (data: any) => void) => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const tin = searchParams.get('tin')
  const isUpdate = !!id && !!tin
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [manualOwnerData, setManualOwnerData] = useState<any>(null)

  const formSchema = isUpdate
    ? RegisterIllegalIrsSchema.extend({
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
      })
    : RegisterIllegalIrsSchema

  const form = useForm<RegisterIllegalIrsDTO>({
    resolver: zodResolver(formSchema),
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
      passportPath: undefined,
      additionalFilePath: undefined,
      regionId: '',
      districtId: '',
      address: '',
    },
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/irs/`, id, isUpdate)
  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/irs/', id, 'put')
  const { mutateAsync: legalMutateAsync, isPending: isLegalPending } = useAdd<any, any, any>('/integration/iip/legal')

  const regionId = form.watch('regionId')

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['owner-data', tin],
    queryFn: async () => {
      if (!tin) return null
      if (tin.length === 9) {
        const res = await apiClient.post<any>('/integration/iip/legal', { tin })
        return res.data?.data
      }
      return null
    },
    enabled: isUpdate && !!tin && tin.length === 9,
  })

  const currentOwnerData = isUpdate ? fetchedOwnerData : manualOwnerData
  const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

  useEffect(() => {
    if (detail && isUpdate) {
      form.reset({
        phoneNumber: detail.phoneNumber || '',
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        parentOrganization: detail.parentOrganization || '',
        supervisorName: detail.supervisorName || '',
        supervisorPosition: detail.supervisorPosition || '',
        supervisorStatus: detail.supervisorStatus || '',
        supervisorEducation: detail.supervisorEducation || '',
        supervisorPhoneNumber: detail?.supervisorPhoneNumber || '',
        division: detail.division || '',
        identifierType: detail.identifierType,
        symbol: detail.symbol || '',
        sphere: detail.sphere || '',
        factoryNumber: detail.factoryNumber || '',
        serialNumber: detail.serialNumber || '',
        activity: detail.activity,
        type: detail.type || '',
        category: detail.category,
        country: detail.country || '',
        manufacturedAt: parseDate(detail.manufacturedAt),
        acceptedFrom: detail.acceptedFrom || '',
        acceptedAt: parseDate(detail.acceptedAt),
        isValid: detail.isValid,
        usageType: detail.usageType,
        storageLocation: detail.storageLocation || '',
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: detail.address || '',
        passportPath: detail.files?.passportPath?.path,
        additionalFilePath: detail.files?.additionalFilePath?.path,
      } as any)

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form, isUpdate])

  const handleSearch = () => {
    const identity = form.getValues('identity')?.trim()

    if (!identity) return

    if (identity.length === 9) {
      legalMutateAsync({ tin: identity })
        .then((res) => setManualOwnerData(res.data))
        .catch(() => setManualOwnerData(null))
    } else {
      form.trigger(['identity'])
    }
  }

  const handleClear = () => {
    setManualOwnerData(null)
    form.setValue('identity', '')
  }

  const handleSubmit = (data: RegisterIllegalIrsDTO) => {
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
    isLoading: isDetailLoading || isOwnerLoading,
    isSearchLoading: isLegalPending,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
