import { useForm } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import {
  applicationFormConstants,
  CraneAppealDtoSchema,
  CreateCraneApplicationDTO,
  useCreateCraneApplicationMutations,
} from '@/entities/create-application';
import {
  useDistrictSelectQueries,
  useHazardousFacilityTypeDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries';

export const useCreateCraneApplication = () => {
  const form = useForm<CreateCraneApplicationDTO>({
    resolver: zodResolver(CraneAppealDtoSchema),
  });

  const regionId = form.watch('regionId');

  const { spheres } = applicationFormConstants();

  const { data: regions } = useRegionSelectQueries();

  const { data: districts } = useDistrictSelectQueries(regionId);

  const districtOptions = useMemo(() => getSelectOptions(districts), [districts]);

  const regionOptions = useMemo(() => getSelectOptions(regions), [regions, regionId]);

  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect();

  const { mutateAsync: createCraneApplication, isPending } = useCreateCraneApplicationMutations();

  const hazardousFacilityTypeOptions = useMemo(
    () => getSelectOptions(hazardousFacilityTypes),
    [hazardousFacilityTypes],
  );

  const handleSubmit = useCallback(
    async (formData: CreateCraneApplicationDTO): Promise<boolean> => {
      try {
        const response = await createCraneApplication(formData);
        return response.success;
      } catch (error) {
        console.error('HPO application submission error:', error);
        return false;
      }
    },
    [createCraneApplication],
  );

  return { form, handleSubmit, isPending, spheres, regionOptions, districtOptions, hazardousFacilityTypeOptions };
};
