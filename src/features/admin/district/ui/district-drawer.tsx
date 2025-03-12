import { useUI } from '@/entities/ui';
import { useForm } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { withUI } from '@/shared/hoc/with-ui';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import { getSelectOptions } from '@/shared/utils/get-select-options';
import {
  useDistrictById,
  useSaveDistrict,
} from '@/entities/admin/district/api';
import {
  DistrictFormValues,
  districtSchema,
} from '@/entities/admin/district/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

const regions = [
  {
    value: 1,
    label: 'Toshkent shahri',
  },
  {
    value: 2,
    label: 'Toshkent viloyati',
  },
  {
    value: 3,
    label: 'Samarqand viloyati',
  },
  {
    value: 4,
    label: 'Sirdaryo viloyati',
  },
  {
    value: 5,
    label: 'Andijon viloyati',
  },
];

function DistrictDrawerBase() {
  const { mutate } = useSaveDistrict();
  const { isOpen, data: districtId, onClose } = useUI();

  const { data: _district } = useDistrictById(districtId);

  const regionOptions = getSelectOptions(regions);

  const defaultValues = useMemo<DistrictFormValues>(
    () => ({
      name: '',
      region_id: '',
    }),
    [],
  );

  const form = useForm<DistrictFormValues>({
    resolver: zodResolver(districtSchema),
    defaultValues,
  });

  const onSubmit = useCallback(
    (data: DistrictFormValues) => {
      mutate(
        {
          ...data,
          id: districtId,
        },
        {
          onSuccess: () => {
            // toast
            form.reset();
            onClose();
          },
        },
      );
    },
    [onClose],
  );

  return (
    <BaseDrawer
      asForm
      open={isOpen}
      onClose={onClose}
      title="Tuman qo'shish"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <FormField
          name="region_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Viloyat</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  {...field}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Viloyat tanlang" />
                  </SelectTrigger>
                  <SelectContent>{regionOptions}</SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomi</FormLabel>
              <FormControl>
                <Input placeholder="Nomi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </BaseDrawer>
  );
}

export const DistrictDrawer = withUI(DistrictDrawerBase, 'district-drawer');
