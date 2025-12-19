import { applicationFormConstants, ReRegisterIllegalHFApplicationDTO } from '@/entities/create-application'
import { ReRegisterIllegalHFSchema } from '@/entities/create-application/schemas/re-register-illegal-hf.schema'
import {
  useDistrictSelectQueries,
  useHazardousFacilityTypeDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import useAdd from '@/shared/hooks/api/useAdd'
import { useQuery } from '@tanstack/react-query'
import { getHfoByTinSelect } from '@/entities/expertise/api/expertise.api'
import { useDetail } from '@/shared/hooks'

export const useReRegisterIllegalHFApplication = () => {
  const form = useForm<ReRegisterIllegalHFApplicationDTO>({
    resolver: zodResolver(ReRegisterIllegalHFSchema),
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

  const [orgData, setOrgData] = useState<any>(undefined)

  const regionId = form.watch('regionId')
  const legalTin = form.watch('legalTin')
  const hazardousFacilityId = form.watch('hazardousFacilityId')

  const { spheres } = applicationFormConstants()

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

  const { mutateAsync: searchLegal, isPending: isSearching } = useAdd<any, any, any>('/integration/iip/legal')

  const { data: hfoList } = useQuery({
    queryKey: ['hfoSelect', legalTin],
    queryFn: () => getHfoByTinSelect(legalTin),
    enabled: !!legalTin && legalTin.length === 9 && !!orgData,
    retry: 1,
  })

  const { data: detail } = useDetail<any>(`/hf/`, hazardousFacilityId, !!hazardousFacilityId)

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

  const handleSearch = () => {
    if (legalTin?.length === 9 && !form.formState.errors.legalTin) {
      searchLegal({ tin: legalTin }).then((res) => {
        setOrgData(res.data)
        form.setValue('hazardousFacilityId', undefined as any)
      })
    } else {
      form.trigger('legalTin').catch((err) => console.log(err))
    }
  }

  const handleClear = () => {
    setOrgData(undefined)
    form.reset({ legalTin: '' })
  }

  const districtOptions = useMemo(() => getSelectOptions(districts), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions), [regions, regionId])
  const hazardousFacilityTypeOptions = useMemo(() => getSelectOptions(hazardousFacilityTypes), [hazardousFacilityTypes])
  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hfoList || []), [hfoList])

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
    isSearching,
  }
}
