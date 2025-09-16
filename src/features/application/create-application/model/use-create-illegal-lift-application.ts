import { RegisterIllegalLiftApplicationDTO } from '@/entities/create-application';
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
import { LiftIllegalAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-lift.schema.ts';

export const useCreateIllegalLiftApplication = () => {
  const form = useForm<RegisterIllegalLiftApplicationDTO>({
    resolver: zodResolver(LiftIllegalAppealDtoSchema),
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
      sphere: undefined,
      liftingCapacity: '',
      stopCount: '',
    },
    mode: 'onChange',
  });

  const regionId = form.watch('regionId');

  const { data: regions } = useRegionSelectQueries();
  const { data: districts } = useDistrictSelectQueries(regionId);
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect();
  const { data: childEquipmentTypes } = useChildEquipmentTypes('ELEVATOR');

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
    sphereSelectOptions,
    childEquipmentOptions,
    hazardousFacilitiesOptions,
  };
};
