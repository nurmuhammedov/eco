import {
  applicationFormConstants,
  type CreateHPOApplicationDTO,
  HFAppealDtoSchema,
} from '@/entities/create-application';
import {
  useDistrictSelectQueries,
  useHazardousFacilityTypeDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

export const useCreateHPOApplication = () => {
  const form = useForm<CreateHPOApplicationDTO>({ resolver: zodResolver(HFAppealDtoSchema) });

  const regionId = form.watch('regionId');

  const { spheres } = applicationFormConstants();

  const { data: regions } = useRegionSelectQueries();

  const { data: districts } = useDistrictSelectQueries(regionId);

  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect();

  const districtOptions = useMemo(() => getSelectOptions(districts), [districts]);

  const regionOptions = useMemo(() => getSelectOptions(regions), [regions, regionId]);

  const hazardousFacilityTypeOptions = useMemo(
    () => getSelectOptions(hazardousFacilityTypes),
    [hazardousFacilityTypes],
  );

  return { form, spheres, regionOptions, districtOptions, hazardousFacilityTypeOptions };
};
