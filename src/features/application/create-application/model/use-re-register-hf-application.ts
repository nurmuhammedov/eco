import { applicationFormConstants, ReRegisterHFApplicationDTO } from '@/entities/create-application'
import { ReRegisterHFSchema } from '@/entities/create-application/schemas/re-register-hf.schema'
import {
  useDistrictSelectQueries,
  useHazardousFacilityDictionarySelect,
  useHazardousFacilityTypeDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useDetail } from '@/shared/hooks'

export const useReRegisterHFApplication = () => {
  const form = useForm<ReRegisterHFApplicationDTO>({
    resolver: zodResolver(ReRegisterHFSchema),
    defaultValues: {
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

  const { spheres } = applicationFormConstants()
  const regionId = form.watch('regionId')
  const hazardousFacilityId = form.watch('hazardousFacilityId')

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect()

  const { data: detail } = useDetail<any>(`/hf/`, hazardousFacilityId, !!hazardousFacilityId)

  useEffect(() => {
    if (detail) {
      const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)
      form.reset((p) => ({
        ...p,
        name: detail.name || '',
        phoneNumber: detail.phoneNumber || '',
        upperOrganization: detail.upperOrganization || '',
        hfTypeId: detail.hfTypeId ? detail.hfTypeId : undefined,
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

  const districtOptions = useMemo(() => getSelectOptions(districts), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions), [regions, regionId])
  const hazardousFacilityTypeOptions = useMemo(() => getSelectOptions(hazardousFacilityTypes), [hazardousFacilityTypes])
  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hazardousFacilities), [hazardousFacilities])

  return {
    form,
    spheres,
    regionOptions,
    districtOptions,
    hazardousFacilityTypeOptions,
    hazardousFacilitiesOptions,
  }
}
