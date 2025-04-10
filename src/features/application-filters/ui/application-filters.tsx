import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  ApplicationFilters as ApplicationFiltersType,
  ApplicationStatus,
} from '@/entities/application';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface ApplicationFiltersProps {
  initialFilters?: ApplicationFiltersType;
  onFilter: (filters: ApplicationFiltersType) => void;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  onFilter,
  initialFilters,
}) => {
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<ApplicationFiltersType>({
      defaultValues: initialFilters || {
        search: '',
        type: '',
        status: undefined,
      },
    });

  const onSubmit = (data: ApplicationFiltersType) => onFilter(data);

  const handleReset = () => {
    const clearableObject = {
      name: '',
      search: '',
      type: '',
      status: undefined,
    };
    reset(clearableObject);
    onFilter(clearableObject);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Input placeholder="Қидирув" {...register('search')} />
        </div>

        <div>
          <Select
            onValueChange={(value) => setValue('type', value)}
            defaultValue={watch('type')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ариза тури" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="XICHONI_RUYHATGA_OLISH">
                ХИЧОни рўйхатга олиш
              </SelectItem>
              <SelectItem value="KRANNI_RUYHATGA_OLISH">
                Кранни рўйхатга олиш
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            onValueChange={(value) =>
              setValue('status', value as ApplicationStatus)
            }
            defaultValue={watch('status')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ариза ҳолати" />
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
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={handleReset}>
          Тозалаш
        </Button>
        <Button type="submit">Қидириш</Button>
      </div>
    </form>
  );
};
