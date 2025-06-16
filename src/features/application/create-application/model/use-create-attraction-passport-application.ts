import {
  AttractionPassportAppealDtoSchema,
  CreateAttractionPassportApplicationDTO,
} from '@/entities/create-application';
import { useChildEquipmentTypes, useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries';
import useData from '@/shared/hooks/api/useData';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

export const useCreateAttractionPassportApplication = () => {
  const form = useForm<CreateAttractionPassportApplicationDTO>({
    resolver: zodResolver(AttractionPassportAppealDtoSchema),
    mode: 'onChange',
  });

  const regionId = form.watch('regionId')?.toString();
  const childEquipmentId = form.watch('childEquipmentId');

  const { data: regions } = useRegionSelectQueries();
  const { data: districts } = useDistrictSelectQueries(regionId);

  // Attraksion nomlari (turi emas, aynan nomlari)
  const { data: attractionNames } = useChildEquipmentTypes('ATTRACTION');

  // Attraksion tiplari (nomiga bog'liq holda)
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
