// src/features/application/create-application/model/use-create-escalator-application.ts
import { CreateEscalatorApplicationDTO, EscalatorAppealDtoSchema } from '@/entities/create-application';
import { BuildingSphereType } from '@/entities/create-application/types/enums';
import {
  useChildEquipmentTypes,
  useDistrictSelectQueries,
  useHazardousFacilityDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries';
import { useTranslatedObject } from '@/shared/hooks';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

export const useCreateEscalatorApplication = () => {
  const form = useForm<CreateEscalatorApplicationDTO>({
    resolver: zodResolver(EscalatorAppealDtoSchema),
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
      // sphere: undefined,
      passengersPerMinute: '',
      length: '',
      speed: '',
      height: '',
    },
    mode: 'onChange',
  });

  const regionId = form.watch('regionId');

  const { data: regions } = useRegionSelectQueries();
  const { data: districts } = useDistrictSelectQueries(regionId);
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect();
  const { data: childEquipmentTypes } = useChildEquipmentTypes('ESCALATOR');

  const buildingSphereTypeOptions = useTranslatedObject(BuildingSphereType, 'building_sphere_type');

  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hazardousFacilities || []), [hazardousFacilities]);
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts]);
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions]);
  const childEquipmentOptions = useMemo(() => getSelectOptions(childEquipmentTypes || []), [childEquipmentTypes]);
  const sphereSelectOptions = useMemo(
    () => getSelectOptions(buildingSphereTypeOptions || []),
    [buildingSphereTypeOptions],
  );

  return {
    form,
    regionOptions,
    districtOptions,
    childEquipmentOptions,
    hazardousFacilitiesOptions,
    sphereSelectOptions,
  };
};
