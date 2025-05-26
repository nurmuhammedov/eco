import { useForm } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import {
  applicationFormConstants,
  type CreateHPOApplicationDTO,
  HFAppealDtoSchema,
  useCreateHPOApplicationMutations,
} from '@/entities/create-application';
import {
  useDistrictSelectQueries,
  useHazardousFacilityTypeDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries';

export const useCreateHPOApplication = () => {
  const form = useForm<CreateHPOApplicationDTO>({ resolver: zodResolver(HFAppealDtoSchema) });

  const regionId = form.watch('regionId');

  const { spheres } = applicationFormConstants();

  const { data: regions } = useRegionSelectQueries();

  const { data: districts } = useDistrictSelectQueries(regionId);

  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect();

  const districtOptions = useMemo(() => getSelectOptions(districts), [districts]);

  const { mutateAsync: createHPOApplication, isPending } = useCreateHPOApplicationMutations();

  const regionOptions = useMemo(() => getSelectOptions(regions), [regions, regionId]);

  const hazardousFacilityTypeOptions = useMemo(
    () => getSelectOptions(hazardousFacilityTypes),
    [hazardousFacilityTypes],
  );

  const handleSubmit = useCallback(
    async (formData: CreateHPOApplicationDTO) => {
      try {
        const response = await createHPOApplication(formData);
        return response.data;
      } catch (error) {
        console.error('HPO application submission error:', error);
        return false;
      }
    },
    [createHPOApplication],
  );

  return { form, handleSubmit, isPending, spheres, regionOptions, districtOptions, hazardousFacilityTypeOptions };
};
