// src/features/application/create-application/model/use-create-irs-application.ts
import { CreateIrsApplicationDTO, IrsAppealDtoSchema } from '@/entities/create-application';
import { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums';
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

export const useCreateIrsApplication = () => {
  const form = useForm<CreateIrsApplicationDTO>({
    resolver: zodResolver(IrsAppealDtoSchema),
    defaultValues: {
      phoneNumber: '',
      parentOrganization: '',
      supervisorName: '',
      supervisorPosition: '',
      supervisorStatus: '',
      supervisorEducation: '',
      supervisorPhoneNumber: '',
      division: '',
      identifierType: undefined, // Enum
      symbol: '',
      sphere: '',
      factoryNumber: '',
      serialNumber: '',
      activity: undefined, // Number
      type: '',
      category: undefined, // Enum
      country: '',
      manufacturedAt: '', // String (date)
      acceptedFrom: '',
      acceptedAt: '', // String (date)
      isValid: true, // Boolean
      usageType: undefined, // Enum
      storageLocation: '',
      passportPath: undefined,
      additionalFilePath: undefined,
      regionId: '',
      districtId: '',
      address: '',
    },
    mode: 'onChange',
  });

  const regionId = form.watch('regionId');

  const { data: regions } = useRegionSelectQueries();
  const { data: districts } = useDistrictSelectQueries(regionId);

  const irsIdentifierTypeOptions = useMemo(
    () =>
      getSelectOptions(
        Object.values(IrsIdentifierType).map((val) => ({
          id: val,
          name: val,
        })),
      ),
    [],
  );
  const irsCategoryOptions = useMemo(
    () =>
      getSelectOptions(
        Object.values(IrsCategory).map((val) => ({
          id: val,
          name: val,
        })),
      ),
    [],
  );
  const irsUsageTypeOptions = useMemo(
    () =>
      getSelectOptions([
        { id: IrsUsageType.USAGE, name: 'Ishlatish (foydalanish) uchun' },
        { id: IrsUsageType.DISPOSAL, name: 'Ko‘mish uchun' },
        { id: IrsUsageType.EXPORT, name: 'Chet-elga olib chiqish uchun' },
        { id: IrsUsageType.STORAGE, name: 'Vaqtinchalik saqlash uchun' },
      ]),
    [],
  );
  const irsStatusOptions = useMemo(
    () => [
      { id: 'true', name: 'Aktiv' },
      { id: 'false', name: 'Aktiv emas' },
    ],
    [],
  );

  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts]);
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions]);

  return {
    form,
    regionOptions,
    districtOptions,
    irsIdentifierTypeOptions,
    irsCategoryOptions,
    irsUsageTypeOptions,
    irsStatusOptions,
  };
};
