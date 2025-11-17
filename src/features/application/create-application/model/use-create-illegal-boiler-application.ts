// src/features/application/create-application/model/use-create-boiler-application.ts
import { RegisterIllegalBoilerApplicationDTO } from '@/entities/create-application';
import { useChildEquipmentTypes, useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { BoilerIllegalAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-boiler.schema';

export const useCreateIlleagalBoilerApplication = () => {
  const form = useForm<RegisterIllegalBoilerApplicationDTO>({
    resolver: zodResolver(BoilerIllegalAppealDtoSchema),
    defaultValues: {
      phoneNumber: '',
      identity: '',
      birthDate: undefined,
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
      capacity: '',
      environment: '',
      pressure: '',
    },
    mode: 'onChange',
  });

  const regionId = form.watch('regionId');
  const { data: regions } = useRegionSelectQueries();
  const { data: districts } = useDistrictSelectQueries(regionId);
  const { data: childEquipmentTypes } = useChildEquipmentTypes('BOILER');

  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts]);
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions]);
  const childEquipmentOptions = useMemo(() => getSelectOptions(childEquipmentTypes || []), [childEquipmentTypes]);

  return {
    form,
    regionOptions,
    districtOptions,
    childEquipmentOptions,
  };
};
