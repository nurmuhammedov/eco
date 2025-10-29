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
  hfOfficeId?: string;
  officeId?: string;
  regionId?: string;
  eqOfficeId?: string;
  irsRegionId?: string;
  xrayRegionId?: string;
  executorId?: string;
  mode?: string;
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
      mode: paramsObject.mode?.toString() || '',
      startDate: paramsObject.startDate ? new Date(paramsObject.startDate) : undefined,
      endDate: paramsObject.endDate ? new Date(paramsObject.endDate) : undefined,
      intervalId: paramsObject.intervalId?.toString() || user?.interval?.id.toString(),
    },
  });

  const { control, handleSubmit } = form;

  const isOfficeFilterEnabled = useMemo(() => inputKeys.includes('officeId'), [inputKeys]);
  const isRegionFilterEnabled = useMemo(() => inputKeys.includes('regionId'), [inputKeys]);
  const isHfOfficeFilterEnabled = useMemo(() => inputKeys.includes('hfOfficeId'), [inputKeys]);
  const isEqOfficeFilterEnabled = useMemo(() => inputKeys.includes('eqOfficeId'), [inputKeys]);
  const isIrsRegionFilterEnabled = useMemo(() => inputKeys.includes('irsRegionId'), [inputKeys]);
  const isXrayRegionFilterEnabled = useMemo(() => inputKeys.includes('xrayRegionId'), [inputKeys]);
  const isExecutorFilterEnabled = useMemo(() => inputKeys.includes('executorId'), [inputKeys]);
  const isStartDateFilterEnabled = useMemo(() => inputKeys.includes('startDate'), [inputKeys]);
  const isEndDateFilterEnabled = useMemo(() => inputKeys.includes('endDate'), [inputKeys]);
  const modeFilterEnabled = useMemo(() => inputKeys.includes('mode'), [inputKeys]);

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
    isOfficeFilterEnabled || isHfOfficeFilterEnabled || isEqOfficeFilterEnabled,
  );

  const { data: regionOptionsDataFromApi, isLoading: isLoadingRegions } = useData<any>(
    `${API_ENDPOINTS.REGIONS_SELECT}`,
    isRegionFilterEnabled || isIrsRegionFilterEnabled || isXrayRegionFilterEnabled,
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
    if (data.intervalId && data.intervalId?.toString() == user?.interval?.id?.toString()) {
      delete formattedData.intervalId;
    }
    addParams(formattedData, 'page', data.intervalId == user?.interval?.id ? 'intervalId' : '');
  };

  const debouncedSubmit = useCallback(debounce(handleSubmit(onSubmit), 300), [handleSubmit, onSubmit]);

  const customDisabledFn = (date: Date) => {
    // @ts-ignore
    const today = new Date(form.watch('startDate'));
    today.setHours(0, 0, 0, 0);

    return date < today;
  };

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
      case 'hfOfficeId':
        if (!isHfOfficeFilterEnabled) return null;
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
                    <SelectValue placeholder={t('office_id_placeholder', 'XICHO joylashgan manzil')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_ITEMS_VALUE as unknown as string}>{t('all', 'Barchasi')}</SelectItem>
                    {getSelectOptions(officeOptionsDataFromApi || [])}
                  </SelectContent>
                </Select>
              )}
            />
          </FilterField>
        );
      case 'irsRegionId':
        if (!isIrsRegionFilterEnabled) return null;
        return (
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
            <Controller
              name="regionId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSubmit(onSubmit)();
                  }}
                  value={field.value}
                  disabled={isLoadingRegions}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('office_id_placeholder', 'INM joylashgan manzil')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_ITEMS_VALUE as unknown as string}>{t('all', 'Barchasi')}</SelectItem>
                    {getSelectOptions(regionOptionsDataFromApi || [])}
                  </SelectContent>
                </Select>
              )}
            />
          </FilterField>
        );
      case 'xrayRegionId':
        if (!isXrayRegionFilterEnabled) return null;
        return (
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
            <Controller
              name="regionId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSubmit(onSubmit)();
                  }}
                  value={field.value}
                  disabled={isLoadingRegions}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('office_id_placeholder', 'Rentgenlar joylashgan manzil')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_ITEMS_VALUE as unknown as string}>{t('all', 'Barchasi')}</SelectItem>
                    {getSelectOptions(regionOptionsDataFromApi || [])}
                  </SelectContent>
                </Select>
              )}
            />
          </FilterField>
        );
      case 'eqOfficeId':
        if (!isEqOfficeFilterEnabled) return null;
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
                    <SelectValue placeholder={t('office_id_placeholder', 'Qurilma joylashgan manzil')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_ITEMS_VALUE as unknown as string}>{t('all', 'Barchasi')}</SelectItem>
                    {getSelectOptions(officeOptionsDataFromApi || [])}
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
                    {getSelectOptions(officeOptionsDataFromApi || [])}
                  </SelectContent>
                </Select>
              )}
            />
          </FilterField>
        );
      case 'mode':
        if (!modeFilterEnabled) return null;
        return (
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
            <Controller
              name="mode"
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
                    <SelectValue placeholder={t('mode_placeholder', 'Rasmiylashtirish turi')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_ITEMS_VALUE as unknown as string}>{t('all', 'Barchasi')}</SelectItem>
                    {getSelectOptions([
                      { id: 'OFFICIAL', name: "Arizachilar tomonidan ro'yxatga olingan" },
                      {
                        id: 'UNOFFICIAL',
                        name: "Qo'mita tomonidan ro'yxatga olingan",
                      },
                    ])}
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
                    {getSelectOptions(executorOptionsDataFromApi || [])}
                  </SelectContent>
                </Select>
              )}
            />
          </FilterField>
        );
      // case 'startDate':
      //   if (!isStartDateFilterEnabled) return null;
      //   return (
      //     <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
      //       <FormField
      //         control={control}
      //         name="startDate"
      //         render={({ field }) => (
      //           <FormItem>
      //             <div className="relative">
      //               <DatePicker
      //                 value={field.value}
      //                 onChange={(date) => {
      //                   field.onChange(date);
      //                   handleSubmit(onSubmit)();
      //                 }}
      //                 placeholder="dan"
      //               />
      //               {field.value && (
      //                 <button
      //                   type="button"
      //                   onClick={() => {
      //                     field.onChange(undefined);
      //                     handleSubmit(onSubmit)();
      //                   }}
      //                   className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
      //                 >
      //                   ✖
      //                 </button>
      //               )}
      //             </div>
      //           </FormItem>
      //         )}
      //       />
      //     </FilterField>
      //   );

      case 'startDate':
        if (!isStartDateFilterEnabled) return null;
        return (
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
            <FormField
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <DatePicker
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        const endDate = form.getValues('endDate');
                        if (endDate && date && endDate < date) {
                          form.setValue('endDate', undefined);
                        }
                        handleSubmit(onSubmit)();
                      }}
                      placeholder="dan"
                    />
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(undefined);
                          handleSubmit(onSubmit)();
                        }}
                        className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </FilterField>
        );

      //
      // case 'endDate':
      //   if (!isEndDateFilterEnabled) return null;
      //   return (
      //     <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
      //       <FormField
      //         control={control}
      //         name="endDate"
      //         render={({ field }) => (
      //           <FormItem>
      //             <div className="relative">
      //               <DatePicker
      //                 value={field.value}
      //                 onChange={(date) => {
      //                   field.onChange(date);
      //                   handleSubmit(onSubmit)();
      //                 }}
      //                 placeholder="gacha"
      //               />
      //               {field.value && (
      //                 <button
      //                   type="button"
      //                   onClick={() => {
      //                     field.onChange(undefined);
      //                     handleSubmit(onSubmit)();
      //                   }}
      //                   className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
      //                 >
      //                   ✖
      //                 </button>
      //               )}
      //             </div>
      //           </FormItem>
      //         )}
      //       />
      //     </FilterField>
      //   );
      //

      case 'endDate':
        if (!isEndDateFilterEnabled) return null;
        return (
          <FilterField key={key} className="w-auto 3xl:w-auto flex-1 max-w-80">
            <FormField
              control={control}
              name="endDate"
              render={({ field }) => {
                const startDate = form.getValues('startDate');
                return (
                  <FormItem>
                    <div className="relative">
                      <DatePicker
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(date);
                          handleSubmit(onSubmit)();
                        }}
                        placeholder="gacha"
                        disableStrategy="custom"
                        customDisabledFn={customDisabledFn}
                        minDate={startDate}
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(undefined);
                            handleSubmit(onSubmit)();
                          }}
                          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                        >
                          ✖
                        </button>
                      )}
                    </div>
                  </FormItem>
                );
              }}
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
