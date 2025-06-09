import { APPLICATIONS_DATA } from '@/entities/create-application/constants/constants';
import { ApplicationTypeEnum } from '@/entities/create-application/types/enums';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { FilterField, FilterRow } from '@/shared/components/common/filters';
import SearchInput from '@/shared/components/common/search-input/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useCustomSearchParams } from '@/shared/hooks';
import useData from '@/shared/hooks/api/useData';
import { debounce } from '@/shared/lib';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import React, { useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const ALL_ITEMS_VALUE = null;

interface ApplicationFiltersFormValues {
  search?: string;
  appealType?: ApplicationTypeEnum;
  officeId?: string;
  executorId?: string;
}

interface ApplicationFiltersProps {
  inputKeys: (keyof ApplicationFiltersFormValues)[];
}

const Filter: React.FC<ApplicationFiltersProps> = ({ inputKeys }) => {
  const { t } = useTranslation(['common']);
  const { paramsObject, addParams } = useCustomSearchParams();

  const { control, handleSubmit } = useForm<ApplicationFiltersFormValues>({
    defaultValues: {
      search: paramsObject.search || '',
      appealType: paramsObject.appealType || '',
      officeId: paramsObject.officeId?.toString() || '',
      executorId: paramsObject.executorId?.toString() || '',
    },
  });

  const isOfficeFilterEnabled = useMemo(() => inputKeys.includes('officeId'), [inputKeys]);
  const isExecutorFilterEnabled = useMemo(() => inputKeys.includes('executorId'), [inputKeys]);

  const dynamicApplicationTypeOptions = APPLICATIONS_DATA.map((item) => (
    <SelectItem key={item.type} value={item.type}>
      {item.title}
    </SelectItem>
  ));

  const { data: officeOptionsDataFromApi, isLoading: isLoadingOffices } = useData<any>(
    `${API_ENDPOINTS.OFFICES}/select`,
    isOfficeFilterEnabled,
  );

  const { data: executorOptionsDataFromApi, isLoading: isLoadingExecutors } = useData<any>(
    `${API_ENDPOINTS.USERS}/office-users/inspectors/select`,
    isExecutorFilterEnabled,
  );

  const onSubmit = (data: ApplicationFiltersFormValues) => {
    addParams(data, 'page');
  };

  const debouncedSubmit = useCallback(debounce(handleSubmit(onSubmit), 300), [handleSubmit, onSubmit]);

  const renderInput = (key: keyof ApplicationFiltersFormValues) => {
    switch (key) {
      case 'search':
        return (
          <FilterField key={key}>
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <SearchInput
                  {...field}
                  placeholder={t('search_placeholder', 'Qidirish ...')}
                  onChange={(value: string) => {
                    field.onChange(value);
                    debouncedSubmit();
                  }}
                />
              )}
            />
          </FilterField>
        );
      case 'appealType':
        return (
          <FilterField key={key}>
            <Controller
              name="appealType"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSubmit(onSubmit)();
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('appeal_type_placeholder', 'Ariza turi')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_ITEMS_VALUE as unknown as string}>{t('all', 'Barchasi')}</SelectItem>
                    {dynamicApplicationTypeOptions}
                  </SelectContent>
                </Select>
              )}
            />
          </FilterField>
        );
      case 'officeId':
        if (!isOfficeFilterEnabled) return null;
        return (
          <FilterField key={key}>
            <Controller
              name="officeId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSubmit(onSubmit)();
                  }}
                  value={field.value}
                  disabled={isLoadingOffices}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('office_id_placeholder', 'Ijrochi hududiy boshqarma')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_ITEMS_VALUE as unknown as string}>{t('all', 'Barchasi')}</SelectItem>
                    {getSelectOptions(officeOptionsDataFromApi?.data || [])}
                  </SelectContent>
                </Select>
              )}
            />
          </FilterField>
        );
      case 'executorId':
        if (!isExecutorFilterEnabled) return null;
        return (
          <FilterField key={key}>
            <Controller
              name="executorId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSubmit(onSubmit)();
                  }}
                  value={field.value}
                  disabled={isLoadingExecutors}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('executor_id_placeholder', 'Maʼsul ijrochi')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_ITEMS_VALUE as unknown as string}>{t('all', 'Barchasi')}</SelectItem>
                    {getSelectOptions(executorOptionsDataFromApi?.data || [])}
                  </SelectContent>
                </Select>
              )}
            />
          </FilterField>
        );
      default:
        return null;
    }
  };

  return (
    <form className="mb-3">
      <FilterRow>{inputKeys.map((key) => renderInput(key))}</FilterRow>
    </form>
  );
};

export default Filter;
