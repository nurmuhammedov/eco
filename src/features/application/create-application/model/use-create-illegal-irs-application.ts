import { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { apiClient } from '@/shared/api/api-client'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import useAdd from '@/shared/hooks/api/useAdd'
import { format } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { QK_REGISTRY } from '@/shared/constants/query-keys'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  irsRefinement,
  RegisterIllegalIrsBaseSchema,
  RegisterIllegalIrsDTO,
  RegisterIllegalIrsSchema,
} from '@/entities/create-application/schemas/register-illegal-irs.schema'

export const useRegisterIllegalIrs = (externalSubmit?: (data: any) => void) => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')
  const isUpdate = !!type && !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [manualOwnerData, setManualOwnerData] = useState<any>(null)

  const form = useForm<RegisterIllegalIrsDTO>({
    resolver: (values, context, options) => {
      const actualSchema = isUpdate
        ? RegisterIllegalIrsBaseSchema.extend({
            passportPath: z.string().optional().nullable(),
            phoneNumber: z.string().optional().nullable(),
            identity: z.string().optional().nullable(),
            birthDate: z
              .string()
              .optional()
              .nullable()
              .transform((val) => (val ? val : null)),
          }).superRefine(irsRefinement)
        : RegisterIllegalIrsSchema

      if (isUpdate) {
        const cleanedValues = Object.fromEntries(
          Object.entries(values).map(([k, v]) => {
            if (v === '' || v === null || v === '+998') return [k, undefined]
            return [k, v]
          })
        )
        return zodResolver(actualSchema)(cleanedValues as any, context, options)
      }
      return zodResolver(actualSchema)(values, context, options)
    },
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
      birthDate: undefined,
    },
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/irs/`, id, !!id)
  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/irs/', id, 'put')

  const { mutateAsync: legalMutateAsync, isPending: isLegalPending } = useAdd<any, any, any>('/integration/iip/legal')
  const { mutateAsync: individualMutateAsync, isPending: isIndividualPending } = useAdd<any, any, any>(
    '/integration/iip/individual'
  )

  const ownerIdentity = (detail?.ownerIdentity ? detail?.ownerIdentity?.toString() : null) || tin
  const regionId = form.watch('regionId')

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['owner-data', ownerIdentity],
    queryFn: async () => {
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
        phoneNumber: detail.phoneNumber || '',
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        birthDate: isUpdate ? '1900-01-01' : parseDate(detail.birthDate),
        parentOrganization: getValue(detail.parentOrganization || ''),
        supervisorName: getValue(detail.supervisorName || ''),
        supervisorPosition: getValue(detail.supervisorPosition || ''),
        supervisorStatus: getValue(detail.supervisorStatus || ''),
        supervisorEducation: getValue(detail.supervisorEducation || ''),
        supervisorPhoneNumber: detail?.supervisorPhoneNumber || '',
        division: getValue(detail.division || ''),
        identifierType: detail.identifierType,
        symbol: getValue(detail.symbol || ''),
        sphere: getValue(detail.sphere || ''),
        factoryNumber: getValue(detail.factoryNumber || ''),
        serialNumber: getValue(detail.serialNumber || ''),
        activity: detail.activity,
        type: getValue(detail.type || ''),
        category: detail.category,
        country: getValue(detail.country || ''),
        manufacturedAt: parseDate(detail.manufacturedAt),
        acceptedFrom: getValue(detail.acceptedFrom || ''),
        acceptedAt: parseDate(detail.acceptedAt),
        isValid: detail.isValid,
        usageType: detail.usageType,
        storageLocation: getValue(detail.storageLocation || ''),
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: getValue(detail.address || ''),
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
    const birthDate = form.getValues('birthDate')

    if (!identity) return

    if (identity.length === 9) {
      legalMutateAsync({ tin: identity })
        .then((res) => setManualOwnerData(res.data?.data || res.data))
        .catch(() => setManualOwnerData(null))
    } else if (identity.length === 14 && birthDate) {
      individualMutateAsync({
        pin: identity,
        birthDate: format(birthDate as unknown as Date, 'yyyy-MM-dd'),
      })
        .then((res) => setManualOwnerData(res.data?.data || res.data))
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

  const handleSubmit = (data: RegisterIllegalIrsDTO) => {
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (value === '' || value === null || value === undefined || value === '+998') return [key, null]
        return [key, value]
      })
    )

    if (isUpdate) {
      updateMutate(cleanedData, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QK_REGISTRY] })
          toast.success('So‘rov masʼul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!')
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
    detail,
    isLoading: isDetailLoading || isOwnerLoading,
    isSearchLoading: isLegalPending || isIndividualPending,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
