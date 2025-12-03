import { CablewayAppealDtoSchema, CreateCablewayApplicationDTO } from '@/entities/create-application';
import { UserRoles } from '@/entities/user';
import {
  useChildEquipmentTypes,
  useDistrictSelectQueries,
  useHazardousFacilityDictionarySelect,
  useRegionSelectQueries,
} from '@/shared/api/dictionaries';
import { useAuth } from '@/shared/hooks/use-auth';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

export const useCreateCablewayApplication = () => {
  const { user } = useAuth();

  const form = useForm<CreateCablewayApplicationDTO>({
    resolver: zodResolver(CablewayAppealDtoSchema),
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
      speed: '',
      passengerCount: '',
      length: '',
      labelPath: undefined,
      assignmentDecreePath: undefined,
      passportPath: undefined,
      saleContractPath: undefined,
      expertisePath: undefined,
      expertiseExpiryDate: undefined,
      equipmentCertPath: undefined,
      installationCertPath: undefined,
      technicalInspectionPath: undefined,
      nextTechnicalInspectionDate: undefined,
    },
    mode: 'onChange',
  });

  const regionId = form.watch('regionId');

  const { data: regions } = useRegionSelectQueries();
  const { data: districts } = useDistrictSelectQueries(regionId);
  const { data: hazardousFacilities } = useHazardousFacilityDictionarySelect(user?.role !== UserRoles.INDIVIDUAL);
  const { data: childEquipmentTypes } = useChildEquipmentTypes('CABLEWAY');

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
