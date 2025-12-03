import { AttractionAppealDtoSchema, CreateAttractionApplicationDTO } from '@/entities/create-application';
import { useChildEquipmentTypes, useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries';
import useData from '@/shared/hooks/api/useData';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

export const useCreateAttractionApplication = () => {
  const form = useForm<CreateAttractionApplicationDTO>({
    resolver: zodResolver(AttractionAppealDtoSchema),
    defaultValues: {
      phoneNumber: '',
      attractionName: '',
      childEquipmentId: undefined,
      childEquipmentSortId: undefined,
      factory: '',
      manufacturedAt: undefined,
      acceptedAt: undefined,
      servicePeriod: undefined,
      factoryNumber: '',
      country: '',
      regionId: undefined,
      districtId: undefined,
      address: '',
      location: '',
      riskLevel: undefined,
      passportPath: undefined,
      labelPath: undefined,
      conformityCertPath: undefined,
      technicalJournalPath: undefined,
      servicePlanPath: undefined,
      technicalManualPath: undefined,
      seasonalInspectionPath: undefined,
      seasonalInspectionExpiryDate: undefined,
      seasonalReadinessActPath: undefined,
      seasonalReadinessActExpiryDate: undefined,
      technicalReadinessActPath: undefined,
      employeeSafetyKnowledgePath: undefined,
      employeeSafetyKnowledgeExpiryDate: undefined,
      usageRightsPath: undefined,
      usageRightsExpiryDate: undefined,
      preservationActPath: undefined,
      cctvInstallationPath: undefined,
      qrPath: undefined,
    },
    mode: 'onChange',
  });

  const regionId = form.watch('regionId')?.toString();
  const childEquipmentId = form.watch('childEquipmentId');

  const { data: regions } = useRegionSelectQueries();
  const { data: districts } = useDistrictSelectQueries(regionId);

  const { data: attractionNames } = useChildEquipmentTypes('ATTRACTION');

  const { data: attractionSorts } = useData<any[]>(`/child-equipment-sorts/select`, !!childEquipmentId, {
    childEquipmentId,
  });

  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions]);
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts]);
  const attractionNameOptions = useMemo(() => getSelectOptions(attractionNames || []), [attractionNames]);
  const attractionSortOptions = useMemo(() => getSelectOptions(attractionSorts || []), [attractionSorts]);

  const riskLevels = useMemo(
    () =>
      [
        { label: 'I-yuqori', value: 'I' },
        { label: 'II-o‘rta', value: 'II' },
        {
          label: 'III-past',
          value: 'III',
        },
        { label: 'IV-ahamiyatsiz', value: 'IV' },
      ].map((level) => ({ id: level?.value, name: level?.label })),
    [],
  );
  const riskLevelOptions = useMemo(() => getSelectOptions(riskLevels), [riskLevels]);

  return {
    form,
    regionOptions,
    districtOptions,
    attractionNameOptions,
    attractionSortOptions,
    riskLevelOptions,
  };
};
