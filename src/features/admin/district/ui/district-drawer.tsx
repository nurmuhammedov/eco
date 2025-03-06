import { useUI } from '@/entities/ui';
import { useForm } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { withUI } from '@/shared/hoc/with-ui';
import { zodResolver } from '@hookform/resolvers/zod';
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { BaseDrawer } from '@/shared/components/common/base-drawer/ui';

function DistrictDrawerBase() {
  const { mutate } = useSaveDistrict();
  const { isOpen, data: districtId, onClose } = useUI();

  const { data: district } = useDistrictById(districtId);

  const defaultValues = useMemo<DistrictFormValues>(
    () => ({
      name: '',
      region_id: String(district?.id) || '',
    }),
    [],
  );

  const form = useForm<DistrictFormValues>({
    resolver: zodResolver(districtSchema),
    defaultValues,
    mode: 'onSubmit',
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
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Viloyat tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'null'}>Mavjud emas</SelectItem>
                  </SelectContent>
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
