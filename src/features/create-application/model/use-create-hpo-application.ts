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
  const form = useForm<CreateHPOApplicationDTO>({
    resolver: zodResolver(HFAppealDtoSchema),
    defaultValues: {
      upperOrganization: 'Yuqori tashkilot 123',
      name: 'Yangi XICHO nomi',
      phoneNumber: '+998702245665',
      hfTypeId: '1',
      spheres: ['GAS', 'GEOLOGY'],
      regionId: '4',
      districtId: '3',
      address: 'Amir Temur 45',
      location: '40.857788302649716, 69.62396344735042',
      extraArea: 'XICHO sexlari, uchastkalari va maydonchalari nomi',
      hazardousSubstance: 'Xavfli moddalarning nomi va miqdori',
      description: 'Ariza bayoni',
      projectDocumentationPath: '/files/registry-files/2025/may/6/1746530534201.pdf',
      insurancePolicyPath: '/files/registry-files/2025/may/6/1746530556534.pdf',
      appointmentOrderPath: '/files/registry-files/2025/may/6/1746530608010.pdf',
      identificationCardPath: '/files/registry-files/2025/may/6/1746530536411.pdf',
      expertOpinionPath: '/files/registry-files/2025/may/6/1746530596065.pdf',
      licensePath: '/files/registry-files/2025/may/6/1746530610947.pdf',
      ecologicalConclusionPath: '/files/registry-files/2025/may/6/1746530539055.pdf',
      permitPath: '/files/registry-files/2025/may/6/1746530599390.pdf',
      receiptPath: '/files/registry-files/2025/may/6/1746530613337.pdf',
      certificationPath: '/files/registry-files/2025/may/6/1746530548333.pdf',
      cadastralPassportPath: '/files/registry-files/2025/may/6/1746530601848.pdf',
      replyLetterPath: '/files/registry-files/2025/may/6/1746530616337.pdf',
      industrialSafetyDeclarationPath: '/files/registry-files/2025/may/6/1746530552641.pdf',
      deviceTestingPath: '/files/registry-files/2025/may/6/1746530604754.pdf',
    },
  });

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
