import { APPLICATIONS_DATA } from '@/entities/create-application/constants/constants';
import { ApplicationTypeEnum } from '@/entities/create-application/types/enums';
import { useRiskAnalysisIntervalsQuery } from '@/shared/api/dictionaries/hooks/use-risk-analysis-intervals-query';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { FilterField, FilterRow } from '@/shared/components/common/filters';
import SearchInput from '@/shared/components/common/search-input/ui/search-input';
import DatePicker from '@/shared/components/ui/datepicker';
import { Form, FormField, FormItem } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useCustomSearchParams } from '@/shared/hooks';
import useData from '@/shared/hooks/api/useData';
import { useAuth } from '@/shared/hooks/use-auth';
import { debounce } from '@/shared/lib';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { getDate } from '@/shared/utils/date';
import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const ALL_ITEMS_VALUE = null;

interface ApplicationFiltersFormValues {
  search?: string;
  appealType?: ApplicationTypeEnum;
  officeId?: string;
  executorId?: string;
  startDate?: Date;
  endDate?: Date;
  intervalId?: string;
}

interface ApplicationFiltersProps {
  inputKeys: (keyof ApplicationFiltersFormValues)[];
  className?: string;
}

const Filter: React.FC<ApplicationFiltersProps> = ({ inputKeys, className = 'mb-3' }) => {
  const { t } = useTranslation(['common']);
  const { paramsObject, addParams } = useCustomSearchParams();
  const { user } = useAuth();

  const form = useForm<ApplicationFiltersFormValues>({
    defaultValues: {
      search: paramsObject.search || '',
      appealType: paramsObject.appealType || '',
      officeId: paramsObject.officeId?.toString() || '',
      executorId: paramsObject.executorId?.toString() || '',
      startDate: paramsObject.startDate ? new Date(paramsObject.startDate) : undefined,
      endDate: paramsObject.endDate ? new Date(paramsObject.endDate) : undefined,
      intervalId: paramsObject.intervalId?.toString() || user?.interval?.id.toString(),
    },
  });

  const { control, handleSubmit } = form;

  const isOfficeFilterEnabled = useMemo(() => inputKeys.includes('officeId'), [inputKeys]);
  const isExecutorFilterEnabled = useMemo(() => inputKeys.includes('executorId'), [inputKeys]);
  const isStartDateFilterEnabled = useMemo(() => inputKeys.includes('startDate'), [inputKeys]);
  const isEndDateFilterEnabled = useMemo(() => inputKeys.includes('endDate'), [inputKeys]);

  const isIntervalFilterEnabled = useMemo(() => inputKeys.includes('intervalId'), [inputKeys]);

  const { data: intervalOptionsData, isLoading: isLoadingIntervals } =
    useRiskAnalysisIntervalsQuery(isIntervalFilterEnabled);

  const intervalOptions = useMemo(() => {
    if (!intervalOptionsData) return [];
    return intervalOptionsData.map((interval) => (
      <SelectItem key={interval.id} value={interval.id.toString()}>
        <span className="whitespace-nowrap">{`${getDate(interval.startDate)} - ${getDate(interval.endDate)}`}</span>
      </SelectItem>
    ));
  }, [intervalOptionsData]);

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
    const formattedData: any = { ...data };
    if (data.startDate) {
      formattedData.startDate = format(data.startDate, 'yyyy-MM-dd');
    }
    if (data.endDate) {
      formattedData.endDate = format(data.endDate, 'yyyy-MM-dd');
    }
    if (data.intervalId && data.intervalId == user?.interval?.id) {
      delete formattedData.intervalId;
    }
    addParams(formattedData, 'page', data.intervalId == user?.interval?.id ? 'intervalId' : '');
  };

  const debouncedSubmit = useCallback(debounce(handleSubmit(onSubmit), 300), [handleSubmit, onSubmit]);

  const renderInput = (key: keyof ApplicationFiltersFormValues) => {
    switch (key) {
      case 'search':
        return (
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
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
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
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
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
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
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
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
      case 'startDate':
        if (!isStartDateFilterEnabled) return null;
        return (
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
            <FormField
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <DatePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      handleSubmit(onSubmit)();
                    }}
                    placeholder="dan"
                  />
                </FormItem>
              )}
            />
          </FilterField>
        );
      case 'endDate':
        if (!isEndDateFilterEnabled) return null;
        return (
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
            <FormField
              control={control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <DatePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      handleSubmit(onSubmit)();
                    }}
                    placeholder="gacha"
                  />
                </FormItem>
              )}
            />
          </FilterField>
        );
      case 'intervalId':
        if (!isIntervalFilterEnabled) return null;
        return (
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
            <Controller
              name="intervalId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSubmit(onSubmit)();
                  }}
                  value={field.value}
                  disabled={isLoadingIntervals}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Davrni tanlang" />
                  </SelectTrigger>
                  <SelectContent>{intervalOptions}</SelectContent>
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
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FilterRow>{inputKeys.map((key) => renderInput(key))}</FilterRow>
      </form>
    </Form>
  );
};

export default Filter;
