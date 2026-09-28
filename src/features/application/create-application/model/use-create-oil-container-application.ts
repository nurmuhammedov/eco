import { CreateOilContainerApplicationDTO, OilContainerAppealDtoSchema } from '@/entities/create-application'
import { UserRoles } from '@/shared/types/user'
import {
  useChildEquipmentTypes,
  useDistrictSelectQuery,
  useHazardousFacilityDictionarySelect,
  useRegionSelectQuery,
} from '@/shared/api/dictionaries'
import { useAuth } from '@/shared/hooks/use-auth'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const useCreateOilContainerApplication = () => {
  const { user } = useAuth()

  const form = useForm<FormDraft<typeof OilContainerAppealDtoSchema>, unknown, CreateOilContainerApplicationDTO>({
    resolver: zodFormResolver<FormDraft<typeof OilContainerAppealDtoSchema>, CreateOilContainerApplicationDTO>(
      OilContainerAppealDtoSchema
    ),
    defaultValues: {
      phoneNumber: '',
      hazardousFacilityId: undefined,
      childEquipmentId: undefined,
      regionId: '',
      districtId: '',
      address: '',
      location: '',
      capacity: '',
      nonDestructiveCheckDate: undefined,
      manufacturedAt: undefined,
      labelPath: undefined,
      saleContractPath: undefined,
      equipmentCertPath: undefined,
      assignmentDecreePath: undefined,
      expertisePath: undefined,
      expertiseExpiryDate: undefined,
      installationCertPath: undefined,
      passportPath: undefined,
      servicePeriod: undefined,
    },
    mode: 'onChange',
  })

  const regionId = form.watch('regionId')

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(regionId)
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect(user?.role !== UserRoles.INDIVIDUAL)
  // Assuming 'OIL_CONTAINER' is the correct key for child equipment types
  const { data: childEquipmentTypes } = useChildEquipmentTypes('OIL_CONTAINER')

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
