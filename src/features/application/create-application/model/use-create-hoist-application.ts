// src/features/application/create-application/model/use-create-hoist-application.ts
import { CreateHoistApplicationDTO, HoistAppealDtoSchema } from '@/entities/create-application';
import {
  useChildEquipmentTypes,
  useDistrictSelectQueries,
  useHazardousFacilityDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

export const useCreateHoistApplication = () => {
  const form = useForm<CreateHoistApplicationDTO>({
    resolver: zodResolver(HoistAppealDtoSchema),
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
      labelPath: undefined,
      saleContractPath: undefined,
      equipmentCertPath: undefined,
      assignmentDecreePath: undefined,
      expertisePath: undefined,
      installationCertPath: undefined,
      additionalFilePath: undefined,
      height: '',
      liftingCapacity: '',
    },
    mode: 'onChange',
  });

  const regionId = form.watch('regionId');

  const { data: regions } = useRegionSelectQueries();
  const { data: districts } = useDistrictSelectQueries(regionId);
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect();
  const { data: childEquipmentTypes } = useChildEquipmentTypes('HOIST'); // Child equipment turi

  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hazardousFacilities || []), [hazardousFacilities]);
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts]);
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions]);
  const childEquipmentOptions = useMemo(() => getSelectOptions(childEquipmentTypes || []), [childEquipmentTypes]);

  return {
    form,
    regionOptions,
    districtOptions,
    childEquipmentOptions,
    hazardousFacilitiesOptions,
  };
};
