import {
  useDistrictSelectQuery,
  useHazardousFacilityByTinQuery,
  useLegalOrganizationQuery,
  useRegionSelectQuery,
} from '@/shared/api/dictionaries'
import { invalidateRegistryQueries } from '@/shared/lib/query/invalidate-registry'
import {
  RegisterIllegalTankerDTO,
  RegisterIllegalTankerSchema,
  TANKER_FILES,
  UpdateTankerSchema,
} from '@/entities/create-application'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { type OwnerData, useOwnerLookup } from './use-owner-lookup'
import type { EquipmentDetail } from '@/entities/registry'
import { KEPT_OWNER_BIRTH_DATE, latinOrEmpty } from './edit-values'
import { useTankerChildTypes } from './use-tanker-child-types'

export type IllegalTankerDraft = FormDraft<typeof RegisterIllegalTankerSchema>

const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

/** The file fields of a registered tanker, each with the date it runs out on */
const filesOf = (detail: EquipmentDetail) =>
  Object.fromEntries(
    TANKER_FILES.flatMap((file) => {
      const stored = detail.files?.[file.path]
      return [
        [file.path, stored?.path ?? undefined],
        ...(file.expiry ? [[file.expiry, parseDate(stored?.expiryDate)]] : []),
      ]
    })
  )

/**
 * An inspector registers a tanker for its owner (`UnofficialTankerDto`), or
 * edits a registered one (`UpdateTankerDto`, `PUT /equipments/tanker/{id}`). An
 * edit keeps the owner and the phone number, so it sends neither.
 */
export const useRegisterIllegalTanker = (externalSubmit?: (data: RegisterIllegalTankerDTO) => void) => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')
  const isUpdate = !!type && !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const ownerLookup = useOwnerLookup()

  const form = useForm<IllegalTankerDraft, unknown, RegisterIllegalTankerDTO>({
    resolver: zodFormResolver<IllegalTankerDraft, RegisterIllegalTankerDTO>(
      isUpdate ? UpdateTankerSchema : RegisterIllegalTankerSchema
    ),
    defaultValues: {
      phoneNumber: '',
      identity: '',
      hazardousFacilityId: undefined,
      childType: '',
      regionId: '',
      districtId: '',
      address: '',
      location: '',
      numberPlate: '',
      model: '',
      factoryNumber: '',
      factory: '',
      capacity: '',
      environment: '',
      pressure: '',
    },
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<EquipmentDetail>(`/equipments/`, id, !!id)

  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/equipments/tanker/', id)

  const ownerIdentity = (detail?.ownerIdentity ? detail?.ownerIdentity?.toString() : null) || tin
  const regionId = form.watch('regionId')
  const identity = form.watch('identity')
  const isLegal = identity?.length === 9

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(regionId)
  const { childTypes, childTypeOptions, childTypeOf } = useTankerChildTypes()

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useLegalOrganizationQuery(ownerIdentity)

  const currentOwnerData: OwnerData | null | undefined = isUpdate ? fetchedOwnerData : ownerLookup.owner

  const { data: hfOptions } = useHazardousFacilityByTinQuery(identity, isLegal && !!currentOwnerData)

  useEffect(() => {
    if (detail && isUpdate) {
      form.reset({
        phoneNumber: '',
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        birthDate: KEPT_OWNER_BIRTH_DATE,
        hazardousFacilityId: detail.hfId,
        childType: '',
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: latinOrEmpty(detail.address || ''),
        location: latinOrEmpty(detail.location || ''),
        numberPlate: detail.numberPlate || '',
        model: latinOrEmpty(detail.model || ''),
        factoryNumber: latinOrEmpty(detail.factoryNumber || ''),
        factory: latinOrEmpty(detail.factory || ''),
        capacity: latinOrEmpty(detail.parameters?.capacity || ''),
        environment: latinOrEmpty(detail.parameters?.environment || ''),
        pressure: latinOrEmpty(detail.parameters?.pressure || ''),
        partialCheckDate: parseDate(detail.partialCheckDate),
        fullCheckDate: parseDate(detail.fullCheckDate),
        nonDestructiveCheckDate: parseDate(detail.nonDestructiveCheckDate),
        servicePeriod: parseDate(detail.servicePeriod),
        ...filesOf(detail),
      })

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form, isUpdate])

  // The record names its sub type only; the kind is read off the sub type list once both are here
  useEffect(() => {
    if (detail && isUpdate && childTypes.length && !form.getValues('childType')) {
      form.setValue('childType', childTypeOf(detail.childEquipmentId), { shouldValidate: true })
    }
    // childTypeOf is rebuilt from childTypes, which is already listed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, childTypes, form, isUpdate])

  const handleSearch = () => {
    const identity = form.getValues('identity')?.trim()

    if (!identity) return

    if (!ownerLookup.search(identity, form.getValues('birthDate'))) {
      form.trigger(['identity', 'birthDate'])
    }
  }

  const handleClear = () => {
    ownerLookup.clear()
    form.setValue('identity', '')
    form.setValue('birthDate', undefined)
    form.setValue('hazardousFacilityId', undefined)
  }

  const handleSubmit = (data: RegisterIllegalTankerDTO) => {
    if (isUpdate) {
      // UpdateTankerDto has no owner and no phone number
      const { phoneNumber: _phone, identity: _identity, birthDate: _birthDate, ...updatePayload } = data

      updateMutate(updatePayload, {
        onSuccess: () => {
          invalidateRegistryQueries(queryClient)
          toast.success('So‘rov mas’ul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!')
          navigate(-1)
        },
      })
    } else if (externalSubmit) {
      externalSubmit(data)
    }
  }

  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hfOptions || []), [hfOptions])

  return {
    form,
    isUpdate,
    regionOptions,
    districtOptions,
    childTypeOptions,
    hazardousFacilitiesOptions,
    ownerData: currentOwnerData,
    detail,
    isLoading: isDetailLoading || isOwnerLoading,
    isSearchLoading: ownerLookup.isSearching,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
