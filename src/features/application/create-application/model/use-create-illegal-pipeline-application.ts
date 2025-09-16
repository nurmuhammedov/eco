// src/features/application/create-application/model/use-create-pipeline-application.ts
import { PipelineIllegalAppealDtoSchema, RegisterIllegalPipelineApplicationDTO } from '@/entities/create-application';
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

export const useCreateIllegalPipelineApplication = () => {
  const form = useForm<RegisterIllegalPipelineApplicationDTO>({
    resolver: zodResolver(PipelineIllegalAppealDtoSchema),
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
      nonDestructiveCheckDate: undefined,
      diameter: '',
      thickness: '',
      length: '',
      pressure: '',
      environment: '',
    },
    mode: 'onChange',
  });

  const regionId = form.watch('regionId');

  const { data: regions } = useRegionSelectQueries();
  const { data: districts } = useDistrictSelectQueries(regionId);
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect();
  const { data: childEquipmentTypes } = useChildEquipmentTypes('PIPELINE'); // Child equipment turi 'PIPELINE'

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
