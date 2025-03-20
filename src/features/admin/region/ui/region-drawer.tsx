import { useForm } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { regionSchema } from '@/entities/admin/region';
import { useRegionDrawer } from '@/shared/hooks/entity-hooks';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { UIModeEnum } from '@/shared/types/ui-types';
import {
  useCreateRegion,
  useUpdateRegion,
} from '@/entities/admin/region/region.fetcher';
import {
  CreateRegionDTO,
  RegionFormValues,
  UpdateRegionDTO,
} from '@/entities/admin/region/region.types';

export const RegionDrawer = () => {
  const { t } = useTranslation('common');
  const { mutate: createRegion } = useCreateRegion();
  const { mutate: updateRegion } = useUpdateRegion();
  const { isOpen, onClose, mode } = useRegionDrawer();
  const isCreate = mode === UIModeEnum.CREATE;

  const defaultValues = useMemo<RegionFormValues>(
    () => ({
      name: '',
      region_id: '',
    }),
    [],
  );

  const form = useForm<RegionFormValues>({
    resolver: zodResolver(regionSchema),
    defaultValues,
  });

  const onSubmit = useCallback(
    (data: unknown) =>
      isCreate
        ? createRegion(data as CreateRegionDTO)
        : updateRegion(data as UpdateRegionDTO),
    [onClose],
  );

  return (
    <BaseDrawer
      asForm
      open={isOpen}
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      title={isCreate ? t('actions.add') : t('actions.edit')}
    >
      <Form {...form}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('name')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </BaseDrawer>
  );
};
