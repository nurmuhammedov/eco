import { ContainerAppealDtoSchema, CreateContainerApplicationDTO } from '@/entities/create-application'
import { UserRoles } from '@/entities/user'
import {
  useChildEquipmentTypes,
  useDistrictSelectQueries,
  useHazardousFacilityDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { useAuth } from '@/shared/hooks/use-auth'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const useCreateContainerApplication = () => {
  const { user } = useAuth()
  const form = useForm<CreateContainerApplicationDTO>({
    resolver: zodResolver(ContainerAppealDtoSchema),
    defaultValues: {
      phoneNumber: '',
      hazardousFacilityId: undefined,
      childEquipmentId: '',
      factoryNumber: '',
      regionId: '',
      districtId: '',
      address: '',
      model: '',
      factory: '',
      location: '',
      manufacturedAt: undefined,
      partialCheckDate: undefined,
      fullCheckDate: undefined,
      nonDestructiveCheckDate: undefined,
      capacity: '',
      environment: '',
      pressure: '',
      labelPath: undefined,
      saleContractPath: undefined,
      equipmentCertPath: undefined,
      assignmentDecreePath: undefined,
      expertisePath: undefined,
      expertiseExpiryDate: undefined,
      installationCertPath: undefined,
      additionalFilePath: undefined,
      internalInspectionPath: undefined,
      nextInternalInspectionDate: undefined,
      hydraulicTestPath: undefined,
      nextHydraulicTestDate: undefined,
    },
    mode: 'onChange',
  })

  const regionId = form.watch('regionId')

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect(user?.role !== UserRoles.INDIVIDUAL)
  const { data: childEquipmentTypes } = useChildEquipmentTypes('CONTAINER')

  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hazardousFacilities || []), [hazardousFacilities])
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const childEquipmentOptions = useMemo(() => getSelectOptions(childEquipmentTypes || []), [childEquipmentTypes])

  return {
    form,
    regionOptions,
    districtOptions,
    childEquipmentOptions,
    hazardousFacilitiesOptions,
  }
}
