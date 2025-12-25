import { CreateLiftApplicationDTO, LifAppealDtoSchema } from '@/entities/create-application'
import { BuildingSphereType } from '@/entities/create-application/types/enums'
import { UserRoles } from '@/entities/user'
import {
  useChildEquipmentTypes,
  useDistrictSelectQueries,
  useHazardousFacilityDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { useAuth } from '@/shared/hooks/use-auth'
import { useTranslatedObject } from '@/shared/hooks'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const useCreateLiftApplication = () => {
  const { user } = useAuth()

  const form = useForm<CreateLiftApplicationDTO>({
    resolver: zodResolver(LifAppealDtoSchema),
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
      sphere: undefined,
      liftingCapacity: '',
      stopCount: '',
      labelPath: undefined,
      saleContractPath: undefined,
      equipmentCertPath: undefined,
      assignmentDecreePath: undefined,
      expertisePath: undefined,
      installationCertPath: undefined,
      passportPath: undefined,
      fullCheckPath: undefined,
      nextFullCheckDate: undefined,
    },
    mode: 'onChange',
  })

  const regionId = form.watch('regionId')

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect(user?.role !== UserRoles.INDIVIDUAL)
  const { data: childEquipmentTypes } = useChildEquipmentTypes('ELEVATOR')

  const buildingSphereTypeOptions = useTranslatedObject(BuildingSphereType, 'building_sphere_type')

  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hazardousFacilities || []), [hazardousFacilities])
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const childEquipmentOptions = useMemo(() => getSelectOptions(childEquipmentTypes || []), [childEquipmentTypes])
  const sphereSelectOptions = useMemo(
    () => getSelectOptions(buildingSphereTypeOptions || []),
    [buildingSphereTypeOptions]
  )

  return {
    form,
    regionOptions,
    districtOptions,
    sphereSelectOptions,
    childEquipmentOptions,
    hazardousFacilitiesOptions,
  }
}
