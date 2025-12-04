import { CreateHeatPipelineApplicationDTO, HeatPipelineAppealDtoSchema } from '@/entities/create-application'
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

export const useCreateHeatPipelineApplication = () => {
  const { user } = useAuth()

  const form = useForm<CreateHeatPipelineApplicationDTO>({
    resolver: zodResolver(HeatPipelineAppealDtoSchema),
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
      diameter: '',
      thickness: '',
      length: '',
      pressure: '',
      temperature: '',
      labelPath: undefined,
      saleContractPath: undefined,
      equipmentCertPath: undefined,
      assignmentDecreePath: undefined,
      expertisePath: undefined,
      expertiseExpiryDate: undefined,
      installationCertPath: undefined,
      additionalFilePath: undefined,
      hydraulicTestPath: undefined,
      nextHydraulicTestDate: undefined,
      externalExaminationPath: undefined,
      nextExternalExaminationDate: undefined,
    },
    mode: 'onChange',
  })

  const regionId = form.watch('regionId')

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect(user?.role !== UserRoles.INDIVIDUAL)
  const { data: childEquipmentTypes } = useChildEquipmentTypes('HEAT_PIPELINE')

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
