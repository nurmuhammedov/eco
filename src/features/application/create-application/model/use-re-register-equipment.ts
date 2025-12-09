import { ReRegisterEquipmentDTO } from '@/entities/create-application'
import { ReRegisterEquipmentSchema } from '@/entities/create-application/schemas/re-register-equipment.schema'
import {
  useDistrictSelectQueries,
  useHazardousFacilityDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const useReRegisterEquipment = () => {
  const form = useForm<ReRegisterEquipmentDTO>({
    resolver: zodResolver(ReRegisterEquipmentSchema),
    defaultValues: {
      phoneNumber: '',
      hazardousFacilityId: undefined,
      type: '',
      regionId: '',
      districtId: '',
      address: '',
      oldRegistryNumber: '',
      location: '',
      partialCheckDate: undefined,
      fullCheckDate: undefined,
      labelPath: undefined,
      saleContractPath: undefined,
      equipmentCertPath: undefined,
      assignmentDecreePath: undefined,
      expertisePath: undefined,
      installationCertPath: undefined,
    },
    mode: 'onChange',
  })

  const regionId = form.watch('regionId')

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect()

  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hazardousFacilities || []), [hazardousFacilities])
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])

  return {
    form,
    regionOptions,
    districtOptions,
    hazardousFacilitiesOptions,
  }
}
