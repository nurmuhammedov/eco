import { useForm } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import {
  applicationFormConstants,
  CreateLiftApplicationDTO,
  LifAppealDtoSchema,
  useCreateLiftApplicationMutations,
} from '@/entities/create-application';
import {
  useChildEquipmentTypes,
  useDistrictSelectQueries,
  useHazardousFacilityDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries';

export const useCreateBoilerApplication = () => {
  const form = useForm<CreateLiftApplicationDTO>({
    resolver: zodResolver(LifAppealDtoSchema),
  });

  const regionId = form.watch('regionId');

  const { spheres } = applicationFormConstants();

  const { data: regions } = useRegionSelectQueries();

  const { data: districts } = useDistrictSelectQueries(regionId);

  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect();

  //TODO: replace string to enum or constant
  const { data: childEquipmentTypes } = useChildEquipmentTypes('ELEVATOR');

  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hazardousFacilities), [hazardousFacilities]);

  const districtOptions = useMemo(() => getSelectOptions(districts), [districts, regionId]);

  const regionOptions = useMemo(() => getSelectOptions(regions), [regions]);

  const childEquipmentOptions = useMemo(() => getSelectOptions(childEquipmentTypes), [childEquipmentTypes]);

  const { mutateAsync: createLiftApplication, isPending } = useCreateLiftApplicationMutations();

  const handleSubmit = useCallback(
    async (formData: CreateLiftApplicationDTO): Promise<boolean> => {
      try {
        const response = await createLiftApplication(formData);
        return response.success;
      } catch (error) {
        console.error('Boiler application submission error:', error);
        return false;
      }
    },
    [createLiftApplication],
  );

  return {
    form,
    spheres,
    isPending,
    handleSubmit,
    regionOptions,
    districtOptions,
    childEquipmentOptions,
    hazardousFacilitiesOptions,
  };
};
