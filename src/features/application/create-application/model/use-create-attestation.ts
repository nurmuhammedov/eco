import { EmployeeLevel } from '@/entities/attestation/model/attestation.types'
import {
  AttestationAppealDtoSchema,
  CreateAttestationDTO,
} from '@/entities/create-application/schemas/register-attestation.schema'
import { API_ENDPOINTS } from '@/shared/api'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { OptionItem } from '@/shared/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useFieldArray, useForm } from 'react-hook-form'

const ATTESTATION_DIRECTIONS: OptionItem<string>[] = [
  { id: 'REGIONAL', name: 'Muhandis-texnik va oddiy xodimlar' },
  { id: 'COMMITTEE', name: 'Rahbar xodimlar' },
]

export const useCreateAttestation = () => {
  const form = useForm<CreateAttestationDTO>({
    resolver: zodResolver(AttestationAppealDtoSchema),
    defaultValues: {
      phoneNumber: '',
      direction: 'REGIONAL',
      hfId: '',
      hfRegistryNumber: '',
      upperOrganizationName: '',
      legalName: '',
      legalTin: '',
      hfName: '',
      address: '',
      regionId: '',
      dateOfAttestation: null,
      districtId: '',
      employeeList: [{ pin: '', fullName: '', profession: '', level: 'EMPLOYEE' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'employeeList',
  })

  const hfId = form.watch('hfId')

  const { data: hfOptions, isLoading: isHfLoading } = useQuery<OptionItem<string>[]>({
    queryKey: ['hf-select'],
    queryFn: () => CommonService.getData(API_ENDPOINTS.HF_SELECT),
  })

  const { data: employeeOptions, isLoading: isEmployeeLoading } = useQuery<OptionItem<string>[]>({
    queryKey: ['employees-select', hfId],
    queryFn: () => CommonService.getData(`${API_ENDPOINTS.EMPLOYEES_SELECT}${hfId}`),
    enabled: !!hfId,
  })

  const selectedRegionId = form.watch('regionId')
  const { data: regions, isLoading: isRegionLoading } = useRegionSelectQueries()
  const { data: districts, isLoading: isDistrictLoading } = useDistrictSelectQueries(selectedRegionId)

  const addEmployee = () => {
    append({
      pin: '',
      fullName: '',
      profession: '',
      level: EmployeeLevel.EMPLOYEE,
      certNumber: '',
      certDate: '',
      certExpiryDate: '',
      ctcTrainingFromDate: '',
      ctcTrainingToDate: '',
      dateOfEmployment: '',
    })
  }

  return {
    form,
    fields,
    addEmployee,
    remove,
    directions: ATTESTATION_DIRECTIONS,
    hfOptions,
    isHfLoading,
    employeeOptions,
    isEmployeeLoading,
    regionOptions: regions,
    isRegionLoading,
    districtOptions: districts,
    isDistrictLoading,
  }
}
