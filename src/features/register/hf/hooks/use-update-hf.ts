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
    },
  })

  const regionId = form.watch('regionId')
  const { spheres } = applicationFormConstants()

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

  const { data: orgData, isLoading: isOrgLoading } = useQuery({
    queryKey: ['legal-entity', tin],
    queryFn: async () => {
      const res = await apiClient.post<any>('/integration/iip/legal', { tin })
      return res.data
    },
    enabled: !!tin && tin.length === 9,
  })

  const { data: detail, isLoading: isDetailLoading } = useDetail<any>(`/hf/`, id, !!id)

  useEffect(() => {
    if (detail) {
      const parseDate = (dateString?: string | null) => (dateString ? new Date(dateString) : undefined)

      form.reset((p) => ({
        ...p,
        name: detail.name || '',
        upperOrganization: detail.upperOrganization || '',
        hfTypeId: detail.hfTypeId ? String(detail.hfTypeId) : 'undefined',
        regionId: detail.regionId ? String(detail.regionId) : '',
        address: detail.address || '',
        location: detail.location || '',
        extraArea: detail.extraArea || '',
        hazardousSubstance: detail.hazardousSubstance || '',
        managerCount: detail.managerCount || '',
        engineerCount: detail.engineerCount || '',
        workerCount: detail.workerCount || '',
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
    isLoading: isOrgLoading || isDetailLoading,
  }
}
