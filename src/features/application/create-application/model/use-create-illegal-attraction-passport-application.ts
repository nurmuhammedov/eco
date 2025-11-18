import {
  AttractionIllegalAppealDtoSchema,
  RegisterIllegalAttractionApplicationDTO,
} from '@/entities/create-application';
import { useChildEquipmentTypes, useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries';
import useData from '@/shared/hooks/api/useData';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = RegisterIllegalAttractionApplicationDTO & {
  identity: string;
  birthDate?: Date;
};

export const useCreateIllegalAttractionPassportApplication = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(AttractionIllegalAppealDtoSchema),
    mode: 'onChange',
    defaultValues: {
      identity: '',
      phoneNumber: '',
      attractionName: '',
      childEquipmentId: undefined,
      childEquipmentSortId: undefined,
      factory: '',
      factoryNumber: '',
      country: '',
      regionId: undefined,
      districtId: undefined,
      address: '',
      location: '',
      riskLevel: undefined,
      birthDate: undefined,
      manufacturedAt: undefined,
      acceptedAt: undefined,
      servicePeriod: undefined,
      passportPath: undefined,
      labelPath: undefined,
      conformityCertPath: undefined,
      technicalJournalPath: undefined,
      qrPath: undefined,
      preservationActPath: undefined,
      preservationActExpiryDate: undefined,
      servicePlanPath: undefined,
      servicePlanExpiryDate: undefined,
      technicalManualPath: undefined,
      technicalManualExpiryDate: undefined,
      seasonalInspectionPath: undefined,
      seasonalInspectionExpiryDate: undefined,
      seasonalReadinessActPath: undefined,
      seasonalReadinessActExpiryDate: undefined,
      technicalReadinessActPath: undefined,
      employeeSafetyKnowledgePath: undefined,
      employeeSafetyKnowledgeExpiryDate: undefined,
      usageRightsPath: undefined,
      usageRightsExpiryDate: undefined,
      cctvInstallationPath: undefined,
      filesBuilt: false,
    },
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

  const riskLevels = useMemo(() => ['I', 'II', 'III', 'IV'].map((level) => ({ id: level, name: level })), []);
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
