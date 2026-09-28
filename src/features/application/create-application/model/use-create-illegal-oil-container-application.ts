import { useLegalOrganizationQuery } from '@/shared/api/dictionaries'
import { useHazardousFacilityByTinQuery } from '@/shared/api/dictionaries'
import { invalidateRegistryQueries } from '@/shared/lib/query/invalidate-registry'
import { z } from 'zod'
import { useChildEquipmentTypes, useDistrictSelectQuery, useRegionSelectQuery } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import {
  CreateIllegalOilContainerApplicationDTO,
  IllegalOilContainerAppealDtoSchema,
  IllegalOilContainerAppealDtoBaseSchema,
} from '@/entities/create-application'
import { type OwnerData, useOwnerLookup } from './use-owner-lookup'
import type { EquipmentDetail } from '@/entities/registry'
import { KEPT_OWNER_BIRTH_DATE, latinOrEmpty } from './edit-values'

type OilContainerDraft = FormDraft<typeof IllegalOilContainerAppealDtoSchema>

export const useRegisterIllegalOilContainer = (
  externalSubmit?: (data: CreateIllegalOilContainerApplicationDTO) => void
) => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')
  const isUpdate = !!type && !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const ownerLookup = useOwnerLookup()

  const formSchema = isUpdate
    ? IllegalOilContainerAppealDtoBaseSchema.extend({
        // The picker hands the form an ISO string, the record a `yyyy-MM-dd` one
        nonDestructiveCheckDate: z
          .string()
          .optional()
          .nullable()
          .transform((value) => (value ? format(parseISO(value), 'yyyy-MM-dd') : null)),
        expertiseExpiryDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        labelPath: z
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
        assignmentDecreePath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val : null)),
        expertisePath: z
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
      }).superRefine((data, ctx) => checkExpiryDate(data, ctx, 'expertisePath', 'expertiseExpiryDate'))
    : IllegalOilContainerAppealDtoSchema

  const form = useForm<OilContainerDraft, unknown, CreateIllegalOilContainerApplicationDTO>({
    resolver: zodFormResolver<OilContainerDraft, CreateIllegalOilContainerApplicationDTO>(formSchema),
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
      manufacturedAt: undefined,
      labelPath: undefined,
      saleContractPath: undefined,
      equipmentCertPath: undefined,
      assignmentDecreePath: undefined,
      expertisePath: undefined,
      expertiseExpiryDate: undefined,
      installationCertPath: undefined,
      passportPath: undefined,
      servicePeriod: undefined,
    },
    mode: 'onChange',
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<EquipmentDetail>(`/equipments/`, id, !!id)

  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/equipments/oil-container/', id)

  const ownerIdentity = (detail?.ownerIdentity ? detail?.ownerIdentity?.toString() : null) || tin
  const regionId = form.watch('regionId')
  const identity = form.watch('identity')
  const isLegal = identity?.length === 9

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(regionId)
  const { data: childEquipmentTypes } = useChildEquipmentTypes('OIL_CONTAINER')

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
        childEquipmentId: detail.childEquipmentId ? String(detail.childEquipmentId) : undefined,
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: latinOrEmpty(detail.address || ''),
        location: latinOrEmpty(detail.location || ''),
        capacity: latinOrEmpty(detail.parameters?.capacity || ''),
        nonDestructiveCheckDate: detail.nonDestructiveCheckDate ?? undefined,
        manufacturedAt: parseDate(detail.manufacturedAt),
        servicePeriod: parseDate(detail.servicePeriod),
        labelPath: detail.files?.labelPath?.path ?? undefined,
        saleContractPath: detail.files?.saleContractPath?.path ?? undefined,
        equipmentCertPath: detail.files?.equipmentCertPath?.path ?? undefined,
        assignmentDecreePath: detail.files?.assignmentDecreePath?.path ?? undefined,
        expertisePath: detail.files?.expertisePath?.path ?? undefined,
        expertiseExpiryDate: parseDate(detail.files?.expertisePath?.expiryDate),
        installationCertPath: detail.files?.installationCertPath?.path ?? undefined,
        passportPath: detail.files?.passportPath?.path ?? undefined,
      })

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form, isUpdate])

  const handleSearch = () => {
    const identity = form.getValues('identity')?.trim()
    const birthDate = form.getValues('birthDate')

    if (!identity) return

    if (!ownerLookup.search(identity, birthDate ? new Date(birthDate) : undefined)) {
      form.trigger(['identity', 'birthDate'])
    }
  }

  const handleClear = () => {
    ownerLookup.clear()
    form.setValue('identity', '')
    form.setValue('birthDate', undefined)
    form.setValue('hazardousFacilityId', undefined)
  }

  const handleSubmit = (data: CreateIllegalOilContainerApplicationDTO) => {
    const birthDate = form.getValues('birthDate')

    const payload = {
      ...data,
      identity: form.getValues('identity'),
      birthDate: birthDate ? format(new Date(birthDate), 'yyyy-MM-dd') : undefined,
    }

    if (isUpdate) {
      updateMutate(payload, {
        onSuccess: () => {
          invalidateRegistryQueries(queryClient)
          toast.success('So‘rov mas’ul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!')
          navigate(-1)
        },
      })
    } else {
      if (externalSubmit) {
        externalSubmit(payload)
      }
    }
  }

  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const childEquipmentOptions = useMemo(() => getSelectOptions(childEquipmentTypes || []), [childEquipmentTypes])
  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hfOptions || []), [hfOptions])

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
    isSearchLoading: ownerLookup.isSearching,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
