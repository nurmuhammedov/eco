import { CreateTankerApplicationDTO, TankerAppealDtoSchema } from '@/entities/create-application'
import { UserRoles } from '@/shared/types/user'
import {
  useDistrictSelectQuery,
  useHazardousFacilityDictionarySelect,
  useRegionSelectQuery,
} from '@/shared/api/dictionaries'
import { useAuth } from '@/shared/hooks/use-auth'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTankerChildTypes } from './use-tanker-child-types'

export type TankerAppealDraft = FormDraft<typeof TankerAppealDtoSchema>

export const useCreateTankerApplication = () => {
  const { user } = useAuth()

  const form = useForm<TankerAppealDraft, unknown, CreateTankerApplicationDTO>({
    resolver: zodFormResolver<TankerAppealDraft, CreateTankerApplicationDTO>(TankerAppealDtoSchema),
    defaultValues: {
      phoneNumber: '',
      hazardousFacilityId: undefined,
      childType: '',
      regionId: '',
      districtId: '',
      address: '',
      location: '',
      numberPlate: '',
      model: '',
      factoryNumber: '',
      factory: '',
      capacity: '',
      environment: '',
      pressure: '',
    },
    mode: 'onChange',
  })

  const regionId = form.watch('regionId')

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(regionId)
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect(user?.role !== UserRoles.INDIVIDUAL)
  const { childTypeOptions } = useTankerChildTypes()

  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hazardousFacilities || []), [hazardousFacilities])
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])

  return {
    form,
    regionOptions,
    districtOptions,
    childTypeOptions,
    hazardousFacilitiesOptions,
  }
}
