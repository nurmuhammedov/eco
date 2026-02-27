import { applicationFormConstants } from '@/entities/create-application'
import {
  useDistrictSelectQueries,
  useHazardousFacilityTypeDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { useDetail } from '@/shared/hooks'
import { useParams, useSearchParams } from 'react-router-dom'
import { UpdateHFDTO, UpdateHFSchema } from '@/features/register/hf/model/update-hf.schema'
import { apiClient } from '@/shared/api/api-client'

export const useUpdateHF = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')

  const form = useForm<UpdateHFDTO>({
    resolver: zodResolver(UpdateHFSchema),
    defaultValues: {
      name: '',
      upperOrganization: '',
      regionId: '',
      districtId: '',
      address: '',
      location: '',
      hfTypeId: undefined,
      extraArea: '',
      hazardousSubstance: '',
      spheres: [],
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
      regulationPath: undefined,
      regulationExpiryDate: undefined,
      staffAttestationPath: undefined,
      staffAttestationExpiryDate: undefined,
      managerAttestationPath: undefined,
      managerAttestationExpiryDate: undefined,
    },
  })

  const regionId = form.watch('regionId')
  const { spheres } = applicationFormConstants()

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/hf/`, id, !!id)
  const resolvedTin = tin || detail?.legalTin

  const { data: orgData, isLoading: isOrgLoading } = useQuery({
    queryKey: ['legal-entity', resolvedTin],
    queryFn: async () => {
      const res = await apiClient.get<any>('/users/legal/' + resolvedTin)
      return res.data
    },
    enabled: !!resolvedTin && resolvedTin.length === 9,
  })

  useEffect(() => {
    if (detail) {
      const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)
      const getValue = (val: string) => (/[\u0400-\u04FF]/.test(val) ? '' : val)

      form.reset((p) => ({
        ...p,
        name: getValue(detail.name || ''),
        upperOrganization: getValue(detail.upperOrganization || ''),
        hfTypeId: detail.hfTypeId ? String(detail.hfTypeId) : 'undefined',
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: getValue(detail.address || ''),
        location: detail.location || '',
        extraArea: getValue(detail.extraArea || ''),
        hazardousSubstance: getValue(detail.hazardousSubstance || ''),
        managerCount: detail.managerCount?.toString() || '',
        engineerCount: detail.engineerCount?.toString() || '',
        workerCount: detail.workerCount?.toString() || '',
        spheres: detail.spheres || [],
        identificationCardPath: detail.files?.identificationCardPath?.path || '',
        receiptPath: detail.files?.receiptPath?.path || '',
        insurancePolicyPath: detail.files?.insurancePolicyPath?.path || '',
        insurancePolicyExpiryDate: parseDate(detail.files?.insurancePolicyPath?.expiryDate) as unknown as Date,
        cadastralPassportPath: detail.files?.cadastralPassportPath?.path || '',
        projectDocumentationPath: detail.files?.projectDocumentationPath?.path || '',
        licensePath: detail.files?.licensePath?.path || '',
        licenseExpiryDate: parseDate(detail.files?.licensePath?.expiryDate) as unknown as Date,
        expertOpinionPath: detail.files?.expertOpinionPath?.path || '',
        appointmentOrderPath: detail.files?.appointmentOrderPath?.path || '',
        permitPath: detail.files?.permitPath?.path || '',
        permitExpiryDate: parseDate(detail.files?.permitPath?.expiryDate) as unknown as Date,
        industrialSafetyDeclarationPath: detail.files?.industrialSafetyDeclarationPath?.path || '',
        regulationPath: detail.files?.regulationPath?.path || '',
        regulationExpiryDate: parseDate(detail.files?.regulationPath?.expiryDate) as unknown as Date,
        staffAttestationPath: detail.files?.staffAttestationPath?.path || '',
        staffAttestationExpiryDate: parseDate(detail.files?.staffAttestationPath?.expiryDate) as unknown as Date,
        managerAttestationPath: detail.files?.managerAttestationPath?.path || '',
        managerAttestationExpiryDate: parseDate(detail.files?.managerAttestationPath?.expiryDate) as unknown as Date,
      }))

      setTimeout(() => {
        form.setValue('districtId', detail.districtId ? String(detail.districtId) : '')
      }, 500)
    }
  }, [detail, form])

  const districtOptions = useMemo(() => getSelectOptions(districts), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions), [regions, regionId])
  const hazardousFacilityTypeOptions = useMemo(() => getSelectOptions(hazardousFacilityTypes), [hazardousFacilityTypes])

  return {
    form,
    spheres,
    regionOptions,
    districtOptions,
    hazardousFacilityTypeOptions,
    orgData: orgData?.data,
    detail,
    isLoading: isOrgLoading || isDetailLoading,
  }
}
