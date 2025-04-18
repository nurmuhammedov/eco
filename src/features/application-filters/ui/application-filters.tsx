import React, { useCallback, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FilterField, FilterRow } from '@/shared/components/common/filters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import {
  ApplicationFilters as ApplicationFiltersType,
  ApplicationStatus,
  FilterApplicationDTO,
} from '@/entities/application';
import { debounce } from '@/shared/lib';
import SearchInput from '@/shared/components/common/search-input/ui/search-input.tsx';
import { Button } from '@/shared/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const DEFAULT_FILTERS: ApplicationFiltersType = {
  search: '',
  type: '',
  status: undefined,
  name: '',
};

interface ApplicationFiltersProps {
  initialFilters?: FilterApplicationDTO;
  onFilter: (filters: ApplicationFiltersType) => void;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({ onFilter, initialFilters }) => {
  const searchRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, setValue, reset } = useForm<ApplicationFiltersType>({
    defaultValues: initialFilters || {
      search: '',
      type: '',
      status: undefined,
    },
  });

  const debouncedFilter = useCallback(
    debounce((data: ApplicationFiltersType) => onFilter(data), 300),
    [onFilter],
  );

  const onSubmit = useCallback(
    (data: ApplicationFiltersType) => {
      onFilter(data);
    },
    [onFilter],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setValue('search', value);
      handleSubmit((data) => debouncedFilter(data))();
    },
    [setValue, handleSubmit, debouncedFilter],
  );

  const handleReset = useCallback(() => {
    reset(DEFAULT_FILTERS);
    if (searchRef.current) {
      searchRef.current.value = '';
    }
    onFilter(DEFAULT_FILTERS);
  }, [reset, onFilter]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-3">
      <FilterRow>
        <FilterField>
          <SearchInput
            ref={searchRef}
            placeholder="Ariza raqami"
            onChange={handleSearchChange}
            defaultValue={initialFilters?.name}
          />
        </FilterField>

        <FilterField>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSubmit(onSubmit)();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ariza turi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XICHONI_RUYHATGA_OLISH">ХИЧОни рўйхатга олиш</SelectItem>
                  <SelectItem value="KRANNI_RUYHATGA_OLISH">Кранни рўйхатга олиш</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FilterField>

        <FilterField>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => {
                  field.onChange(value as ApplicationStatus);
                  handleSubmit(onSubmit)();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ijrochi hududiy boshqarma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YANGI">Янги</SelectItem>
                  <SelectItem value="IJRODA">Ижрода</SelectItem>
                  <SelectItem value="KELISHISHDA">Келишишда</SelectItem>
                  <SelectItem value="TASDIQLASHDA">Тасдиқлашда</SelectItem>
                  <SelectItem value="YAKUNLANGAN">Якунланган</SelectItem>
                  <SelectItem value="QAYTARILGAN">Қайтарилган</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FilterField>
        <FilterField>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => {
                  field.onChange(value as ApplicationStatus);
                  handleSubmit(onSubmit)();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Maʼsul ijrochi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YANGI">Янги</SelectItem>
                  <SelectItem value="IJRODA">Ижрода</SelectItem>
                  <SelectItem value="KELISHISHDA">Келишишда</SelectItem>
                  <SelectItem value="TASDIQLASHDA">Тасдиқлашда</SelectItem>
                  <SelectItem value="YAKUNLANGAN">Якунланган</SelectItem>
                  <SelectItem value="QAYTARILGAN">Қайтарилган</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FilterField>
        <Button type="button" variant="outline" size="icon" onClick={handleReset} disabled>
          <RefreshCcw size={16} />
        </Button>
      </FilterRow>
    </form>
  );
};
