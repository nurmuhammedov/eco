import { useLegalOrganizationQuery } from '@/shared/api/dictionaries'
import { invalidateRegistryQueries } from '@/shared/lib/query/invalidate-registry'
import {
  RegisterIllegalAttractionBaseSchema,
  RegisterIllegalAttractionDTO,
  RegisterIllegalAttractionSchema,
} from '@/entities/create-application'
import { useChildEquipmentTypes, useDistrictSelectQuery, useRegionSelectQuery } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDetail, useUpdate } from '@/shared/hooks'
import useData from '@/shared/hooks/api/use-data'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import type { OptionItem } from '@/shared/types'
import { type OwnerData, useOwnerLookup } from './use-owner-lookup'
import type { EquipmentDetail } from '@/entities/registry'
import { KEPT_OWNER_BIRTH_DATE, latinOrEmpty } from './edit-values'

export const useRegisterIllegalAttraction = (externalSubmit?: (data: RegisterIllegalAttractionDTO) => void) => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')
  const isUpdate = !!type && !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const ownerLookup = useOwnerLookup()

  const formSchema = isUpdate
    ? RegisterIllegalAttractionBaseSchema.extend({
        phoneNumber: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val : null)),
        birthDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        passportPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => val || null),
        labelPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => val || null),
        technicalJournalPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => val || null),
        servicePlanPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => val || null),
        technicalManualPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => val || null),
        seasonalInspectionPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => val || null),
        seasonalInspectionExpiryDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        seasonalReadinessActPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => val || null),
        seasonalReadinessActExpiryDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        employeeSafetyKnowledgePath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => val || null),
        employeeSafetyKnowledgeExpiryDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        usageRightsPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => val || null),
        usageRightsExpiryDate: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
        cctvInstallationPath: z
          .string()
          .optional()
          .nullable()
          .transform((val) => val || null),
        servicePeriod: z
          .date()
          .optional()
          .nullable()
          .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
      })
    : RegisterIllegalAttractionSchema

  const form = useForm<FormDraft<typeof RegisterIllegalAttractionSchema>, unknown, RegisterIllegalAttractionDTO>({
    resolver: zodFormResolver<FormDraft<typeof RegisterIllegalAttractionSchema>, RegisterIllegalAttractionDTO>(
      formSchema
    ),
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

  const { data: detail, isLoading: isDetailLoading } = useDetail<EquipmentDetail>(`/equipments/`, id, !!id)

  const { mutateAsync: updateMutate, isPending: isUpdatePending } = useUpdate('/equipments/attraction/', id)

  const ownerIdentity = (detail?.ownerIdentity ? detail?.ownerIdentity?.toString() : null) || tin
  const regionId = form.watch('regionId')?.toString()
  const childEquipmentId = form.watch('childEquipmentId')

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(regionId)
  const { data: attractionNames } = useChildEquipmentTypes('ATTRACTION')
  const { data: attractionSorts } = useData<OptionItem<number>[]>(`/child-equipment-sorts/select`, !!childEquipmentId, {
    childEquipmentId,
  })

  const { data: fetchedOwnerData, isLoading: isOwnerLoading } = useLegalOrganizationQuery(ownerIdentity)

  const currentOwnerData: OwnerData | null | undefined = isUpdate ? fetchedOwnerData : ownerLookup.owner

  const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

  useEffect(() => {
    if (detail && isUpdate) {
      form.reset({
        phoneNumber: '',
        identity: detail.ownerIdentity ? String(detail.ownerIdentity) : '',
        birthDate: KEPT_OWNER_BIRTH_DATE,
        attractionName: latinOrEmpty(detail.attractionName || ''),
        childEquipmentId: detail.childEquipmentId ?? undefined,
        childEquipmentSortId: detail.childEquipmentSortId ?? undefined,
        factory: latinOrEmpty(detail.factory || ''),
        manufacturedAt: parseDate(detail.manufacturedAt),
        acceptedAt: parseDate(detail.acceptedAt),
        servicePeriod: parseDate(detail.servicePeriod),
        factoryNumber: latinOrEmpty(detail.factoryNumber || ''),
        country: detail.country || '',
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: latinOrEmpty(detail.address || ''),
        location: latinOrEmpty(detail.location || ''),
        riskLevel: detail.riskLevel || undefined,

        passportPath: detail.files?.passportPath?.path ?? undefined,
        labelPath: detail.files?.labelPath?.path ?? undefined,
        conformityCertPath: detail.files?.conformityCertPath?.path ?? undefined,
        technicalJournalPath: detail.files?.technicalJournalPath?.path ?? undefined,
        servicePlanPath: detail.files?.servicePlanPath?.path ?? undefined,
        technicalManualPath: detail.files?.technicalManualPath?.path ?? undefined,
        seasonalInspectionPath: detail.files?.seasonalInspectionPath?.path ?? undefined,
        seasonalInspectionExpiryDate: parseDate(detail.files?.seasonalInspectionPath?.expiryDate),
        seasonalReadinessActPath: detail.files?.seasonalReadinessActPath?.path ?? undefined,
        seasonalReadinessActExpiryDate: parseDate(detail.files?.seasonalReadinessActPath?.expiryDate),
        technicalReadinessActPath: detail.files?.technicalReadinessActPath?.path ?? undefined,
        employeeSafetyKnowledgePath: detail.files?.employeeSafetyKnowledgePath?.path ?? undefined,
        employeeSafetyKnowledgeExpiryDate: parseDate(detail.files?.employeeSafetyKnowledgePath?.expiryDate),
        usageRightsPath: detail.files?.usageRightsPath?.path ?? undefined,
        usageRightsExpiryDate: parseDate(detail.files?.usageRightsPath?.expiryDate),
        preservationActPath: detail.files?.preservationActPath?.path ?? undefined,
        cctvInstallationPath: detail.files?.cctvInstallationPath?.path ?? undefined,
        qrPath: detail.files?.qrPath?.path ?? undefined,
      })

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? detail.districtId : '')
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
  }

  const handleSubmit = (data: RegisterIllegalAttractionDTO) => {
    if (isUpdate) {
      updateMutate(data, {
        onSuccess: () => {
          invalidateRegistryQueries(queryClient)
          toast.success('So‘rov mas’ul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!')
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
    detail,
    isLoading: isDetailLoading || isOwnerLoading,
    isSearchLoading: ownerLookup.isSearching,
    isSubmitPending: isUpdatePending,
    handleSearch,
    handleClear,
    handleSubmit,
  }
}
