import { RegisterIllegalXrayDTO, RegisterIllegalXraySchema } from '@/entities/create-application'
import { stateService } from '@/entities/create-application/types/enums'
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

export const useRegisterIllegalXray = (externalSubmit?: (data: any) => void) => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const tin = searchParams.get('tin')
  const isUpdate = !!id && !!tin
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [manualOwnerData, setManualOwnerData] = useState<any>(null)

  const formSchema = isUpdate
    ? RegisterIllegalXraySchema.extend({
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
    : RegisterIllegalXraySchema

  const form = useForm<RegisterIllegalXrayDTO>({
    resolver: zodResolver(formSchema),
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
  const { mutateAsync: legalMutateAsync, isPending: isLegalPending } = useAdd<any, any, any>('/integration/iip/legal')

  const regionId = form.watch('regionId')
  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['owner-data', tin],
    queryFn: async () => {
      if (!tin || tin.length !== 9) return null
      const res = await apiClient.post<any>('/integration/iip/legal', { tin })
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

    legalMutateAsync({ tin: identity })
      .then((res) => setManualOwnerData(res.data))
      .catch(() => setManualOwnerData(null))
  }

  const handleClear = () => {
    setManualOwnerData(null)
    form.setValue('identity', '')
  }

  const handleSubmit = (data: RegisterIllegalXrayDTO) => {
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
    isSearchLoading: isLegalPending,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
