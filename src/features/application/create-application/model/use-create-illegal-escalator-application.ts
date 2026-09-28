import { useLegalOrganizationQuery } from '@/shared/api/dictionaries'
import { useHazardousFacilityByTinQuery } from '@/shared/api/dictionaries'
import { invalidateRegistryQueries } from '@/shared/lib/query/invalidate-registry'
import {
  requireCitizenBirthDate,
  RegisterIllegalEscalatorBaseSchema,
  RegisterIllegalEscalatorDTO,
  RegisterIllegalEscalatorSchema,
} from '@/entities/create-application'
import { useParkSelectQuery } from '@/entities/admin/park'
import { useChildEquipmentTypes, useDistrictSelectQuery, useRegionSelectQuery } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { type OwnerData, useOwnerLookup } from './use-owner-lookup'
import type { EquipmentDetail } from '@/entities/registry'
import { KEPT_OWNER_BIRTH_DATE, latinOrEmpty } from './edit-values'

export const useRegisterIllegalEscalator = (externalSubmit?: (data: RegisterIllegalEscalatorDTO) => void) => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')
  const isUpdate = !!type && !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const ownerLookup = useOwnerLookup()

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
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        servicePeriod: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
      }).superRefine(requireCitizenBirthDate)
    : RegisterIllegalEscalatorSchema

  const form = useForm<FormDraft<typeof RegisterIllegalEscalatorSchema>, unknown, RegisterIllegalEscalatorDTO>({
    resolver: zodFormResolver<FormDraft<typeof RegisterIllegalEscalatorSchema>, RegisterIllegalEscalatorDTO>(
      formSchema
    ),
    defaultValues: {
      phoneNumber: '',
      identity: '',
      hazardousFacilityId: undefined,
      childEquipmentId: '',
      factoryNumber: '',
      regionId: '',
      districtId: '',
      parkId: '',
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
      servicePeriod: undefined,
    },
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<EquipmentDetail>(`/equipments/`, id, !!id)

  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/equipments/escalator/', id)

  const ownerIdentity = (detail?.ownerIdentity ? detail?.ownerIdentity?.toString() : null) || tin
  const regionId = form.watch('regionId')
  const districtId = form.watch('districtId')
  const identity = form.watch('identity')
  const isLegal = identity?.length === 9

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(regionId)
  const { data: childEquipmentTypes } = useChildEquipmentTypes('ESCALATOR')
  const { data: parks } = useParkSelectQuery(Number(districtId))

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useLegalOrganizationQuery(ownerIdentity)

  const currentOwnerData: OwnerData | null | undefined = isUpdate ? fetchedOwnerData : ownerLookup.owner

  const { data: hfOptions } = useHazardousFacilityByTinQuery(identity, isLegal && !!currentOwnerData)

  const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

  useEffect(() => {
    if (detail && isUpdate) {
      form.reset({
        phoneNumber: '',
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        birthDate: KEPT_OWNER_BIRTH_DATE,
        hazardousFacilityId: detail.hfId,
        childEquipmentId: detail.childEquipmentId ? String(detail.childEquipmentId) : '',
        factoryNumber: latinOrEmpty(detail.factoryNumber || ''),
        regionId: detail.regionId ? String(detail.regionId) : '',
        parkId: detail.parkId ? Number(detail.parkId) : '',
        address: latinOrEmpty(detail.address || ''),
        model: latinOrEmpty(detail.model || ''),
        factory: latinOrEmpty(detail.factory || ''),
        location: latinOrEmpty(detail.location || ''),
        manufacturedAt: parseDate(detail.manufacturedAt),
        servicePeriod: parseDate(detail.servicePeriod),
        partialCheckDate: parseDate(detail.partialCheckDate),
        fullCheckDate: parseDate(detail.fullCheckDate),
        passengersPerMinute: latinOrEmpty(detail.parameters?.passengersPerMinute || ''),
        length: latinOrEmpty(detail.parameters?.length || ''),
        speed: latinOrEmpty(detail.parameters?.speed || ''),
        height: latinOrEmpty(detail.parameters?.height || ''),
        labelPath: detail.files?.labelPath?.path ?? undefined,
        saleContractPath: detail.files?.saleContractPath?.path ?? undefined,
        equipmentCertPath: detail.files?.equipmentCertPath?.path ?? undefined,
        assignmentDecreePath: detail.files?.assignmentDecreePath?.path ?? undefined,
        expertisePath: detail.files?.expertisePath?.path ?? undefined,
        expertiseExpiryDate: parseDate(detail.files?.expertisePath?.expiryDate),
        installationCertPath: detail.files?.installationCertPath?.path ?? undefined,
        fullCheckPath: detail.files?.fullCheckPath?.path ?? undefined,
        passportPath: detail.files?.passportPath?.path ?? undefined,
        nextFullCheckDate: parseDate(detail.files?.fullCheckPath?.expiryDate),
      })

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form, isUpdate])

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

  const handleSubmit = (data: RegisterIllegalEscalatorDTO) => {
    if (isUpdate) {
      const updatePayload = {
        ...data,
        parkId: data.parkId ? Number(data.parkId) : null,
        passportPath: data.passportPath,
      }

      updateMutate(updatePayload, {
        onSuccess: () => {
          invalidateRegistryQueries(queryClient)
          toast.success('So‘rov mas’ul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!')
          navigate(-1)
        },
      })
    } else {
      if (externalSubmit) {
        externalSubmit({
          ...data,
          parkId: data.parkId ? Number(data.parkId) : null,
        })
      }
    }
  }

  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const childEquipmentOptions = useMemo(() => getSelectOptions(childEquipmentTypes || []), [childEquipmentTypes])
  const parkOptions = useMemo(() => getSelectOptions(parks || []), [parks])
  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hfOptions || []), [hfOptions])

  return {
    form,
    isUpdate,
    regionOptions,
    districtOptions,
    parkOptions,
    childEquipmentOptions,
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
