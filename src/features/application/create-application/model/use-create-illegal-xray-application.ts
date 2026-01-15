import { RegisterIllegalXrayDTO, RegisterIllegalXraySchema } from '@/entities/create-application'
import { stateService } from '@/entities/create-application/types/enums'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { apiClient } from '@/shared/api/api-client'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { QK_REGISTRY } from '@/shared/constants/query-keys'
import { toast } from 'sonner'
import { z } from 'zod'

export const useRegisterIllegalXray = (externalSubmit?: (data: any) => void) => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const tin = searchParams.get('tin')
  const isUpdate = !!id && !!tin
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [manualOwnerData, setManualOwnerData] = useState<any>(null)
  const [isManualSearchLoading, setIsManualSearchLoading] = useState(false)

  const form = useForm<RegisterIllegalXrayDTO>({
    resolver: (values, context, options) => {
      const actualSchema = isUpdate
        ? RegisterIllegalXraySchema.extend({
            file1Path: z.string().optional().nullable(),
            file1ExpiryDate: z.date().optional().nullable(),
            file2Path: z.string().optional().nullable(),
            file2ExpiryDate: z.date().optional().nullable(),
            file3Path: z.string().optional().nullable(),
            file3ExpiryDate: z.date().optional().nullable(),
            file4Path: z.string().optional().nullable(),
            file5Path: z.string().optional().nullable(),
            file5ExpiryDate: z.date().optional().nullable(),
            file6Path: z.string().optional().nullable(),
            file6ExpiryDate: z.date().optional().nullable(),
            file7Path: z.string().optional().nullable(),
            file7ExpiryDate: z.date().optional().nullable(),
            file8Path: z.string().optional().nullable(),
            file8ExpiryDate: z.date().optional().nullable(),
            file9Path: z.string().optional().nullable(),
            file9ExpiryDate: z.date().optional().nullable(),
            file10Path: z.string().optional().nullable(),
            file11Path: z.string().optional().nullable(),
            file11ExpiryDate: z.date().optional().nullable(),
            file12Path: z.string().optional().nullable(),
            file13Path: z.string().optional().nullable(),
            file13ExpiryDate: z.date().optional().nullable(),
            phoneNumber: z.string().optional().nullable(),
            identity: z.string().optional().nullable(),
          })
        : RegisterIllegalXraySchema

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
      licenseNumber: '',
      licenseRegistryNumber: '',
      licenseDate: undefined,
      licenseExpiryDate: undefined,
      serialNumber: '',
      regionId: '',
      districtId: '',
      address: '',
      manufacturedYear: '',
      stateService: '',
      file1Path: undefined,
      file1ExpiryDate: undefined,
      file2Path: undefined,
      file2ExpiryDate: undefined,
      file3Path: undefined,
      file3ExpiryDate: undefined,
      file4Path: undefined,
      file5Path: undefined,
      file5ExpiryDate: undefined,
      file6Path: undefined,
      file6ExpiryDate: undefined,
      file7Path: undefined,
      file7ExpiryDate: undefined,
      file8Path: undefined,
      file8ExpiryDate: undefined,
      file9Path: undefined,
      file9ExpiryDate: undefined,
      file10Path: undefined,
      file11Path: undefined,
      file11ExpiryDate: undefined,
      file12Path: undefined,
      file13Path: undefined,
      file13ExpiryDate: undefined,
    },
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/xrays`, id, isUpdate)
  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/xrays', id)

  const regionId = form.watch('regionId')
  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['owner-data', tin],
    queryFn: async () => {
      if (!tin || tin.length !== 9) return null
      const res = await apiClient.get<any>('/users/legal/' + tin)
      return res.data?.data
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
        licenseNumber: detail.licenseNumber || '',
        licenseRegistryNumber: detail.licenseRegistryNumber || '',
        licenseDate: parseDate(detail.licenseDate),
        licenseExpiryDate: parseDate(detail.licenseExpiryDate),
        serialNumber: detail.serialNumber || '',
        model: detail.model || '',
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: detail.address || '',
        manufacturedYear: detail.manufacturedYear ? String(detail.manufacturedYear) : '',
        stateService: detail.stateService ? String(detail.stateService) : '',
        file1Path: detail.files?.file1Path?.path,
        file1ExpiryDate: parseDate(detail.files?.file1Path?.expiryDate),
        file2Path: detail.files?.file2Path?.path,
        file2ExpiryDate: parseDate(detail.files?.file2Path?.expiryDate),
        file3Path: detail.files?.file3Path?.path,
        file3ExpiryDate: parseDate(detail.files?.file3Path?.expiryDate),
        file4Path: detail.files?.file4Path?.path,
        file5Path: detail.files?.file5Path?.path,
        file5ExpiryDate: parseDate(detail.files?.file5Path?.expiryDate),
        file6Path: detail.files?.file6Path?.path,
        file6ExpiryDate: parseDate(detail.files?.file6Path?.expiryDate),
        file7Path: detail.files?.file7Path?.path,
        file7ExpiryDate: parseDate(detail.files?.file7Path?.expiryDate),
        file8Path: detail.files?.file8Path?.path,
        file8ExpiryDate: parseDate(detail.files?.file8Path?.expiryDate),
        file9Path: detail.files?.file9Path?.path,
        file9ExpiryDate: parseDate(detail.files?.file9Path?.expiryDate),
        file10Path: detail.files?.file10Path?.path,
        file11Path: detail.files?.file11Path?.path,
        file11ExpiryDate: parseDate(detail.files?.file11Path?.expiryDate),
        file12Path: detail.files?.file12Path?.path,
        file13Path: detail.files?.file13Path?.path,
        file13ExpiryDate: parseDate(detail.files?.file13Path?.expiryDate),
      } as any)

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form, isUpdate])

  const handleSearch = () => {
    const identity = form.getValues('identity')?.trim()
    if (!identity || identity.length !== 9) return

    setIsManualSearchLoading(true)
    setIsManualSearchLoading(true)
    apiClient
      .post<any>('/integration/iip/legal', { tin: identity })
      .then((res) => setManualOwnerData(res.data?.data))
      .catch(() => setManualOwnerData(null))
      .finally(() => setIsManualSearchLoading(false))
  }

  const handleClear = () => {
    setManualOwnerData(null)
    form.setValue('identity', '')
  }

  const handleSubmit = (data: RegisterIllegalXrayDTO) => {
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
  const stateServiceOptions = useMemo(
    () =>
      getSelectOptions(
        Object.entries(stateService).map(([key, value]) => ({
          id: key,
          name: value,
        }))
      ),
    []
  )

  return {
    form,
    isUpdate,
    regionOptions,
    districtOptions,
    stateServiceOptions,
    ownerData: currentOwnerData,
    isLoading: isDetailLoading || isOwnerLoading,
    isSearchLoading: isManualSearchLoading,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
