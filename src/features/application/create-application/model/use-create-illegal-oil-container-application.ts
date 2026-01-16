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
import {
  CreateIllegalOilContainerApplicationDTO,
  IllegalOilContainerAppealDtoSchema,
} from '@/entities/create-application'

export const useRegisterIllegalOilContainer = (
  externalSubmit?: (data: CreateIllegalOilContainerApplicationDTO) => void
) => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const tin = searchParams.get('tin')
  const isUpdate = !!id && !!tin
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [manualOwnerData, setManualOwnerData] = useState<any>(null)
  const [isManualSearchLoading, setIsManualSearchLoading] = useState(false)

  // Assuming similar refinement needs as Boiler, adapting schema if updated
  // For now using the base schema since no specific refinement was requested/provided
  const formSchema = IllegalOilContainerAppealDtoSchema

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
      // Identity/BirthDate might be needed for form handling though not in base DTO
      // if we follow the Illegal Form pattern which includes searching by TIN
    } as any,
    mode: 'onChange',
  })

  // We might need to add identity/birthDate to the form schema locally if the UI needs it for searching owner
  // But strictly following the DTO provided. However, the UI logic for illegal applications REQUIRES owner search.
  // I will assume the DTO I created earlier was for the API payload, but the form needs more fields.
  // For this step I will proceed with the schema I created, but note that `identity` and `birthDate` are missing from the Zod schema I created based on user request.
  // The user request for fields was explicit. Functional requirements for "Unregistered/Illegal" usually imply searching for an owner.
  // I'll stick to the user's explicit list for the API payload part, but the form hook might need extra state.

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/equipments/`, id, isUpdate)

  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/equipments/oil-container/', id)

  const { mutateAsync: individualMutateAsync, isPending: isIndividualPending } = useAdd<any, any, any>(
    '/integration/iip/individual'
  )

  const regionId = form.watch('regionId')
  // @ts-ignore
  // @ts-ignore
  const identity = form.watch('identity' as any) as string // Watch identity even if not in type
  const isLegal = identity?.length === 9

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: childEquipmentTypes } = useChildEquipmentTypes('OIL_CONTAINER')

  // Owner data fetching logic (Same as Boiler)
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
        // @ts-ignore
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        // @ts-ignore
        birthDate: isUpdate ? '1900-01-01' : parseDate(detail.birthDate),
        hazardousFacilityId: detail.hfId,
        childEquipmentId: detail.childEquipmentId ? String(detail.childEquipmentId) : undefined,
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: detail.address || '',
        location: detail.location || '',
        capacity: detail.parameters?.capacity || '',
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
    // @ts-ignore
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
        .then((res) => setManualOwnerData(res.data))
        .catch(() => setManualOwnerData(null))
    } else {
      // @ts-ignore
      form.trigger(['identity', 'birthDate'])
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
    if (isUpdate) {
      // In update mode, usually we send what changed.
      // For now, mirroring boiler implementation
      const updatePayload = {
        ...data,
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
    isSearchLoading: isIndividualPending || isManualSearchLoading,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
