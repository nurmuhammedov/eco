import { useHazardousFacilityByTinQuery } from '@/shared/api/dictionaries'
import { useApplicationFormConstants, ReRegisterIllegalHFApplicationDTO } from '@/entities/create-application'
import { ReRegisterIllegalHFSchema } from '@/entities/create-application/schemas/reregister-illegal-hf.schema'
import {
  useDistrictSelectQuery,
  useHazardousFacilityTypeDictionarySelect,
  useRegionSelectQuery,
} from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { useDetail } from '@/shared/hooks'
import { useOwnerLookup } from './use-owner-lookup'
import type { HfDetail } from './hf-detail'

type ReRegisterIllegalHfDraft = FormDraft<typeof ReRegisterIllegalHFSchema>

export const useReRegisterIllegalHFApplication = () => {
  const form = useForm<ReRegisterIllegalHfDraft, unknown, ReRegisterIllegalHFApplicationDTO>({
    resolver: zodFormResolver<ReRegisterIllegalHfDraft, ReRegisterIllegalHFApplicationDTO>(ReRegisterIllegalHFSchema),
    defaultValues: {
      legalTin: '',
      hazardousFacilityId: undefined,
      phoneNumber: '',
      upperOrganization: '',
      name: '',
      hfTypeId: undefined,
      spheres: [],
      regionId: '',
      districtId: '',
      address: '',
      location: '',
      extraArea: '',
      hazardousSubstance: '',
      identificationCardPath: undefined,
      receiptPath: undefined,
      insurancePolicyPath: undefined,
      insurancePolicyExpiryDate: undefined,
      cadastralPassportPath: undefined,
      projectDocumentationPath: undefined,
      licensePath: undefined,
      licenseExpiryDate: undefined,
      expertOpinionPath: undefined,
      appointmentOrderPath: undefined,
      permitPath: undefined,
      permitExpiryDate: undefined,
      industrialSafetyDeclarationPath: undefined,
    },
  })

  const ownerLookup = useOwnerLookup({ legalOnly: true })
  const orgData = ownerLookup.owner

  const regionId = form.watch('regionId')
  const legalTin = form.watch('legalTin')
  const hazardousFacilityId = form.watch('hazardousFacilityId')

  const { spheres } = useApplicationFormConstants()

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(regionId)
  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

  const { data: hfList } = useHazardousFacilityByTinQuery(legalTin, !!legalTin && legalTin.length === 9 && !!orgData)

  const { data: detail } = useDetail<HfDetail>(`/hf/`, hazardousFacilityId, !!hazardousFacilityId)

  useEffect(() => {
    if (detail) {
      const currentTin = form.getValues('legalTin')
      const currentId = form.getValues('hazardousFacilityId')
      const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

      form.reset((p) => ({
        ...p,
        legalTin: currentTin,
        hazardousFacilityId: currentId,
        name: detail.name || '',
        phoneNumber: detail.phoneNumber || '',
        upperOrganization: detail.upperOrganization || '',
        hfTypeId: detail.hfTypeId ? String(detail.hfTypeId) : undefined,
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: detail.address || '',
        location: detail.location || '',
        extraArea: detail.extraArea || '',
        hazardousSubstance: detail.hazardousSubstance || '',
        spheres: detail.spheres || [],
        identificationCardPath: detail.files?.identificationCardPath?.path || '',
        receiptPath: detail.files?.receiptPath?.path || '',
        insurancePolicyPath: detail.files?.insurancePolicyPath?.path || '',
        insurancePolicyExpiryDate: parseDate(detail.files?.insurancePolicyPath?.expiryDate),
        cadastralPassportPath: detail.files?.cadastralPassportPath?.path || '',
        projectDocumentationPath: detail.files?.projectDocumentationPath?.path || '',
        licensePath: detail.files?.licensePath?.path || '',
        licenseExpiryDate: parseDate(detail.files?.licensePath?.expiryDate),
        expertOpinionPath: detail.files?.expertOpinionPath?.path || '',
        appointmentOrderPath: detail.files?.appointmentOrderPath?.path || '',
        permitPath: detail.files?.permitPath?.path || '',
        permitExpiryDate: parseDate(detail.files?.permitPath?.expiryDate),
        industrialSafetyDeclarationPath: detail.files?.industrialSafetyDeclarationPath?.path || '',
      }))

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form])

  const handleSearch = () => {
    if (legalTin?.length === 9 && !form.formState.errors.legalTin) {
      form.setValue('hazardousFacilityId', undefined)
      ownerLookup.search(legalTin)
    } else {
      void form.trigger('legalTin')
    }
  }

  const handleClear = () => {
    ownerLookup.clear()
    form.reset({ legalTin: '' })
  }

  const districtOptions = useMemo(() => getSelectOptions(districts), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions), [regions])
  const hazardousFacilityTypeOptions = useMemo(() => getSelectOptions(hazardousFacilityTypes), [hazardousFacilityTypes])
  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hfList || []), [hfList])

  return {
    form,
    spheres,
    regionOptions,
    districtOptions,
    hazardousFacilityTypeOptions,
    hazardousFacilitiesOptions,
    handleSearch,
    handleClear,
    orgData,
    isSearching: ownerLookup.isSearching,
  }
}
